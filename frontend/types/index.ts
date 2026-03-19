// Global TypeScript types for the AI Task Manager

export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "pending" | "in_progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  category?: string | null;
  tags: string[];
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  user_id: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  category?: string;
  tags?: string[];
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  category?: string;
  tags?: string[];
  due_date?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: string;
  tasks?: Task[];
}

export interface ChatResponse {
  reply: string;
  action?: string;
  task?: Task;
  tasks?: Task[];
  mode: "openai" | "fallback";
}

export interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  tasks_by_priority: Record<string, number>;
  tasks_by_category: Record<string, number>;
  recent_completions: number;
}

export interface SmartSuggestion {
  type: "priority" | "overdue" | "recommendation" | "summary";
  title: string;
  message: string;
  tasks?: Task[];
}

export interface ActivityLog {
  id: number;
  action: string;
  task_id?: number | null;
  task_title?: string | null;
  details?: string | null;
  user_id: string;
  created_at: string;
}

export interface FilterState {
  status?: Status | "";
  priority?: Priority | "";
  category?: string;
  search?: string;
}
