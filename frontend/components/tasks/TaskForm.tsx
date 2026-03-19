"use client";

import { useState, useEffect } from "react";
import { X, Plus, Calendar, Tag } from "lucide-react";
import type { Task, TaskCreate, Priority, Status } from "@/types";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskCreate) => Promise<void>;
  onClose: () => void;
}

const priorities: Priority[] = ["low", "medium", "high", "urgent"];
const statuses: Status[] = ["pending", "in_progress", "completed"];
const priorityColors: Record<Priority, string> = {
  low: "text-text-muted",
  medium: "text-accent-info",
  high: "text-accent-warning",
  urgent: "text-accent-danger",
};

export default function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<Priority>(task?.priority || "medium");
  const [status, setStatus] = useState<Status>(task?.status || "pending");
  const [category, setCategory] = useState(task?.category || "");
  const [dueDate, setDueDate] = useState(
    task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ""
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        category: category.trim() || undefined,
        tags,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      onClose();
    } catch {
      setError("Failed to save task. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg shadow-card-hover animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-bg-border sticky top-0 bg-bg-card z-10">
          <h2 className="font-semibold text-text-primary">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-bg-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-text-secondary text-sm font-medium">
              Title <span className="text-accent-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="What needs to be done?"
              autoFocus
              maxLength={255}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-text-secondary text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none h-20"
              placeholder="Optional details..."
            />
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-text-secondary text-sm font-medium">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={cn("input-field", priorityColors[priority])}
              >
                {priorities.map((p) => (
                  <option key={p} value={p} className="bg-bg-secondary text-text-primary capitalize">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-text-secondary text-sm font-medium">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="input-field"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-bg-secondary text-text-primary">
                    {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-text-secondary text-sm font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-text-secondary text-sm font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                placeholder="e.g. Work, Personal"
                maxLength={100}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-text-secondary text-sm font-medium">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="input-field text-sm flex-1"
                placeholder="Type tag + Enter"
                maxLength={30}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary px-3 py-2 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge bg-accent-primary/10 text-accent-primary cursor-pointer hover:bg-accent-danger/10 hover:text-accent-danger transition-colors"
                    onClick={() => removeTag(tag)}
                    title="Click to remove"
                  >
                    #{tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-accent-danger text-sm bg-accent-danger/10 border border-accent-danger/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : task ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
