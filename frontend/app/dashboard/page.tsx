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
  getDashboardStats,
  getSmartSuggestions,
  getActivityLog,
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "@/lib/api";
import type {
  DashboardStats,
  SmartSuggestion,
  ActivityLog,
  Task,
  TaskCreate,
} from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const loadAll = useCallback(async () => {
    setError("");
    try {
      const [statsData, suggestionsData, activityData, tasksData] =
        await Promise.all([
          getDashboardStats(),
          getSmartSuggestions(),
          getActivityLog(10),
          getTasks({ status: "pending" }),
        ]);
      setStats(statsData);
      setSuggestions(suggestionsData);
      setActivity(activityData);
      setRecentTasks(tasksData.slice(0, 5));
    } catch {
      setError(
        "⚠️ Cannot connect to backend. Check that the backend service is running and NEXT_PUBLIC_API_URL is set correctly."
      );
    }
    setLoadingStats(false);
    setLoadingActivity(false);
    setLoadingTasks(false);
  }, []);

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

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="AI-powered task management overview"
      />

      <div className="p-6 space-y-6">
        {/* Error banner */}
        {error && (
          <div className="bg-accent-warning/10 border border-accent-warning/30 rounded-xl p-4 text-accent-warning text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats ? (
          <StatsCards stats={stats} />
        ) : (
          <StatsCards stats={{
            total_tasks: 0, completed_tasks: 0, pending_tasks: 0,
            in_progress_tasks: 0, overdue_tasks: 0, completion_rate: 0,
            tasks_by_priority: {}, tasks_by_category: {}, recent_completions: 0,
          }} loading={loadingStats} />
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left column — tasks + chatbot */}
          <div className="xl:col-span-2 space-y-6">
            {/* Chatbot */}
            <ChatbotPanel onTaskChange={loadAll} />

            {/* Pending Tasks preview */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary text-sm">
                  Pending Tasks
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
                tasks={recentTasks}
                loading={loadingTasks}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
                emptyMessage="No pending tasks — you're all caught up!"
              />
              {recentTasks.length > 0 && (
                <a
                  href="/dashboard/tasks"
                  className="block text-center text-accent-primary text-sm mt-4 hover:text-accent-secondary transition-colors"
                >
                  View all tasks →
                </a>
              )}
            </div>
          </div>

          {/* Right column — suggestions + activity */}
          <div className="space-y-6">
            <SmartSuggestions
              suggestions={suggestions}
              loading={loadingStats}
              onRefresh={loadAll}
            />
            <ActivityLogPanel
              logs={activity}
              loading={loadingActivity}
              onRefresh={loadAll}
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
