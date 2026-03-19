"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import SmartSuggestions from "@/components/dashboard/SmartSuggestions";
import ActivityLogPanel from "@/components/dashboard/ActivityLog";
import ChatbotPanel from "@/components/chatbot/ChatbotPanel";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import {
  getSmartSuggestions,
  getActivityLog,
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "@/lib/api";
import { isOverdue } from "@/lib/utils";
import type {
  DashboardStats,
  SmartSuggestion,
  ActivityLog,
  Task,
  TaskCreate,
} from "@/types";

// Compute dashboard stats entirely from the task list — no /stats endpoint needed
function computeStats(tasks: Task[]): DashboardStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const overdue = tasks.filter((t) => isOverdue(t.due_date, t.status)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentCompletions = tasks.filter(
    (t) =>
      t.status === "completed" &&
      t.completed_at &&
      new Date(t.completed_at) >= sevenDaysAgo
  ).length;

  const tasksByPriority = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {});

  const tasksByCategory = tasks.reduce<Record<string, number>>((acc, t) => {
    if (t.category) acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  return {
    total_tasks: total,
    completed_tasks: completed,
    pending_tasks: pending,
    in_progress_tasks: inProgress,
    overdue_tasks: overdue,
    completion_rate: completionRate,
    tasks_by_priority: tasksByPriority,
    tasks_by_category: tasksByCategory,
    recent_completions: recentCompletions,
  };
}

const EMPTY_STATS: DashboardStats = {
  total_tasks: 0, completed_tasks: 0, pending_tasks: 0,
  in_progress_tasks: 0, overdue_tasks: 0, completion_rate: 0,
  tasks_by_priority: {}, tasks_by_category: {}, recent_completions: 0,
};

export default function DashboardPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  // Primary fetch — same pattern as Tasks page (which works)
  const loadTasks = useCallback(async () => {
    setError("");
    try {
      const data = await getTasks();
      setAllTasks(data);
    } catch {
      setError("⚠️ Cannot connect to backend. Ensure NEXT_PUBLIC_API_URL is set in Vercel and the backend is running.");
    }
    setLoading(false);
  }, []);

  // Secondary fetches — isolated so failures don't break the main view
  const loadSecondary = useCallback(async () => {
    setLoadingActivity(true);
    const [suggestionsResult, activityResult] = await Promise.allSettled([
      getSmartSuggestions(),
      getActivityLog(10),
    ]);
    if (suggestionsResult.status === "fulfilled") setSuggestions(suggestionsResult.value);
    if (activityResult.status === "fulfilled") setActivity(activityResult.value);
    setLoadingActivity(false);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await loadTasks();
    loadSecondary(); // fire-and-forget — doesn't block tasks display
  }, [loadTasks, loadSecondary]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleCreateTask = async (data: TaskCreate) => {
    await createTask(data);
    await loadAll();
  };

  const handleEditTask = async (data: TaskCreate) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, data);
    setEditingTask(null);
    await loadAll();
  };

  const handleComplete = async (id: number) => {
    await completeTask(id);
    await loadAll();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    await loadAll();
  };

  // Derived data — computed from allTasks, no extra API call needed
  const stats = computeStats(allTasks);
  const pendingTasks = allTasks
    .filter((t) => t.status === "pending")
    .slice(0, 5);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="AI-powered task management overview"
      />

      <div className="p-6 space-y-6">
        {/* Error banner — only shown on actual fetch failure */}
        {error && (
          <div className="bg-accent-warning/10 border border-accent-warning/30 rounded-xl p-4 text-accent-warning text-sm">
            {error}
          </div>
        )}

        {/* Stats — computed from tasks, always accurate */}
        <StatsCards stats={stats} loading={loading} />

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left column — chatbot + pending tasks */}
          <div className="xl:col-span-2 space-y-6">
            <ChatbotPanel onTaskChange={loadAll} />

            {/* Pending Tasks */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary text-sm">
                  Pending Tasks
                  {!loading && (
                    <span className="ml-2 text-text-muted font-normal">
                      ({pendingTasks.length})
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAll}
                    className="text-text-muted hover:text-text-secondary transition-colors p-1 rounded hover:bg-bg-hover"
                    title="Refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setShowForm(true);
                    }}
                    className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Task
                  </button>
                </div>
              </div>
              <TaskList
                tasks={pendingTasks}
                loading={loading}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
                emptyMessage="No pending tasks — you're all caught up!"
              />
              {allTasks.length > 0 && (
                <a
                  href="/dashboard/tasks"
                  className="block text-center text-accent-primary text-sm mt-4 hover:text-accent-secondary transition-colors"
                >
                  View all {allTasks.length} tasks →
                </a>
              )}
            </div>
          </div>

          {/* Right column — suggestions + activity */}
          <div className="space-y-6">
            <SmartSuggestions
              suggestions={suggestions}
              loading={loadingActivity}
              onRefresh={loadSecondary}
            />
            <ActivityLogPanel
              logs={activity}
              loading={loadingActivity}
              onRefresh={loadSecondary}
            />
          </div>
        </div>
      </div>

      {/* Task form modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}
