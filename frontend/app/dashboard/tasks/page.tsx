"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  CheckSquare,
  ListFilter,
} from "lucide-react";
import Header from "@/components/layout/Header";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "@/lib/api";
import type { Task, TaskCreate, FilterState, Priority, Status } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: Status | ""; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS: { value: Priority | ""; label: string }[] = [
  { value: "", label: "All Priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const TAB_FILTERS: { label: string; status: Status | "" }[] = [
  { label: "All", status: "" },
  { label: "Pending", status: "pending" },
  { label: "In Progress", status: "in_progress" },
  { label: "Completed", status: "completed" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<Status | "">("");
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    priority: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks({
        ...filters,
        status: activeTab || filters.status,
      });
      setTasks(data);
    } catch {
      setError("Failed to load tasks. Is the backend running?");
    }
    setLoading(false);
  }, [filters, activeTab]);

  useEffect(() => {
    const timer = setTimeout(loadTasks, 300);
    return () => clearTimeout(timer);
  }, [loadTasks]);

  const handleCreate = async (data: TaskCreate) => {
    await createTask(data);
    await loadTasks();
  };

  const handleEdit = async (data: TaskCreate) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, data);
    setEditingTask(null);
    await loadTasks();
  };

  const handleComplete = async (id: number) => {
    await completeTask(id);
    await loadTasks();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(id);
    await loadTasks();
  };

  const clearFilters = () => {
    setFilters({ status: "", priority: "", search: "" });
    setActiveTab("");
  };

  const hasActiveFilters =
    filters.search || filters.priority || (filters.status && !activeTab);

  return (
    <>
      <Header
        title="Tasks"
        subtitle={`${tasks.length} task${tasks.length !== 1 ? "s" : ""} found`}
      />

      <div className="p-6 space-y-4">
        {error && (
          <div className="bg-accent-danger/10 border border-accent-danger/20 rounded-xl p-4 text-accent-danger text-sm">
            {error}
          </div>
        )}

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="input-field pl-9 text-sm"
              placeholder="Search tasks..."
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "btn-secondary flex items-center gap-1.5 text-sm",
                showFilters && "border-accent-primary/50 text-accent-primary"
              )}
            >
              <ListFilter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full" />
              )}
            </button>

            {/* New Task */}
            <button
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="btn-primary flex items-center gap-1.5 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="glass-card p-4 flex flex-wrap items-center gap-3 animate-slide-up">
            <select
              value={filters.priority || ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  priority: e.target.value as Priority | "",
                }))
              }
              className="input-field text-sm w-auto min-w-[130px]"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-bg-secondary">
                  {opt.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={filters.category || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              className="input-field text-sm w-auto min-w-[130px]"
              placeholder="Category..."
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-danger flex items-center gap-1.5 text-sm py-2"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        )}

        {/* Status tabs */}
        <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg w-fit">
          {TAB_FILTERS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.status)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                activeTab === tab.status
                  ? "bg-accent-primary text-white shadow-glow"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-hover"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onEdit={(task) => {
            setEditingTask(task);
            setShowForm(true);
          }}
          emptyMessage={
            hasActiveFilters || activeTab
              ? "No tasks match your filters."
              : "No tasks yet. Create your first task!"
          }
        />
      </div>

      {/* Task form modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEdit : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}
