import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isAfter, parseISO } from "date-fns";
import type { Priority, Status } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const priorityConfig: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
  low: {
    label: "Low",
    color: "text-text-secondary",
    bg: "bg-bg-hover",
    dot: "bg-text-muted",
  },
  medium: {
    label: "Medium",
    color: "text-accent-info",
    bg: "bg-accent-info/10",
    dot: "bg-accent-info",
  },
  high: {
    label: "High",
    color: "text-accent-warning",
    bg: "bg-accent-warning/10",
    dot: "bg-accent-warning",
  },
  urgent: {
    label: "Urgent",
    color: "text-accent-danger",
    bg: "bg-accent-danger/10",
    dot: "bg-accent-danger",
  },
};

export const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  pending: {
    label: "Pending",
    color: "text-text-secondary",
    bg: "bg-bg-hover",
  },
  in_progress: {
    label: "In Progress",
    color: "text-accent-info",
    bg: "bg-accent-info/10",
  },
  completed: {
    label: "Completed",
    color: "text-accent-success",
    bg: "bg-accent-success/10",
  },
};

export const actionConfig: Record<string, { icon: string; color: string }> = {
  created: { icon: "➕", color: "text-accent-success" },
  updated: { icon: "✏️", color: "text-accent-info" },
  deleted: { icon: "🗑️", color: "text-accent-danger" },
  completed: { icon: "✅", color: "text-accent-success" },
};

export function formatDate(date: string | null | undefined): string {
  if (!date) return "No due date";
  try {
    return format(parseISO(date), "MMM d, yyyy");
  } catch {
    return "Invalid date";
  }
}

export function formatRelativeTime(date: string | null | undefined): string {
  if (!date) return "";
  try {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  } catch {
    return "";
  }
}

export function isOverdue(dueDate: string | null | undefined, status: Status): boolean {
  if (!dueDate || status === "completed") return false;
  try {
    return !isAfter(parseISO(dueDate), new Date());
  } catch {
    return false;
  }
}
