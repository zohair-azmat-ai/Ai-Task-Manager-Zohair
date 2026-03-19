"use client";

import { CheckSquare, ListTodo } from "lucide-react";
import type { Task } from "@/types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  emptyMessage?: string;
}

const TaskSkeleton = () => (
  <div className="glass-card p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="w-5 h-5 bg-bg-hover rounded-full flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-bg-hover rounded" />
        <div className="h-3 w-full bg-bg-hover rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-bg-hover rounded-full" />
          <div className="h-5 w-20 bg-bg-hover rounded-full" />
          <div className="h-5 w-24 bg-bg-hover rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function TaskList({
  tasks,
  loading,
  onComplete,
  onDelete,
  onEdit,
  emptyMessage = "No tasks found.",
}: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <TaskSkeleton key={i} />)}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card py-16 text-center animate-fade-in">
        <ListTodo className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
        <p className="text-text-muted text-sm">{emptyMessage}</p>
        <p className="text-text-muted text-xs mt-1">
          Create a task using the button above or the AI chatbot.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
