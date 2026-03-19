"use client";

import {
  CheckCircle,
  Circle,
  Trash2,
  Edit3,
  Calendar,
  Tag,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { Task } from "@/types";
import {
  priorityConfig,
  statusConfig,
  formatDate,
  formatRelativeTime,
  isOverdue,
  cn,
} from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({
  task,
  onComplete,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const overdue = isOverdue(task.due_date, task.status);
  const completed = task.status === "completed";

  return (
    <div
      className={cn(
        "glass-card p-4 group hover:shadow-card-hover hover:border-accent-primary/20 transition-all duration-200 animate-fade-in",
        completed && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Complete toggle */}
        <button
          onClick={() => !completed && onComplete(task.id)}
          className={cn(
            "mt-0.5 flex-shrink-0 transition-all duration-200",
            completed
              ? "text-accent-success cursor-default"
              : "text-text-muted hover:text-accent-success"
          )}
          title={completed ? "Completed" : "Mark complete"}
          disabled={completed}
        >
          {completed ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-sm leading-snug",
                completed
                  ? "line-through text-text-muted"
                  : "text-text-primary"
              )}
            >
              {task.title}
            </h3>

            {/* Actions — show on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-all"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-text-muted hover:text-accent-danger hover:bg-accent-danger/10 rounded-md transition-all"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-text-muted text-xs mt-1 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-2 mt-2.5">
            {/* Priority badge */}
            <span className={cn("badge", priority.bg, priority.color)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", priority.dot)} />
              {priority.label}
            </span>

            {/* Status badge */}
            <span className={cn("badge", status.bg, status.color)}>
              {status.label}
            </span>

            {/* Due date */}
            {task.due_date && (
              <span
                className={cn(
                  "badge",
                  overdue
                    ? "bg-accent-danger/10 text-accent-danger"
                    : "bg-bg-hover text-text-muted"
                )}
              >
                {overdue ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
                {overdue ? "Overdue · " : ""}
                {formatDate(task.due_date)}
              </span>
            )}

            {/* Category */}
            {task.category && (
              <span className="badge bg-bg-hover text-text-muted">
                <Tag className="w-3 h-3" />
                {task.category}
              </span>
            )}

            {/* Tags */}
            {task.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="badge bg-accent-primary/10 text-accent-primary"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1 mt-2">
            <Clock className="w-3 h-3 text-text-muted" />
            <span className="text-text-muted text-xs">
              {completed && task.completed_at
                ? `Completed ${formatRelativeTime(task.completed_at)}`
                : `Created ${formatRelativeTime(task.created_at)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
