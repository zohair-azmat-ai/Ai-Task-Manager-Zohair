/**
 * API client — all backend communication goes through here.
 * Uses Next.js rewrites to proxy /api/* → FastAPI backend.
 */

import axios from "axios";
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  DashboardStats,
  SmartSuggestion,
  ActivityLog,
  ChatResponse,
  FilterState,
} from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const getTasks = async (filters?: FilterState): Promise<Task[]> => {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.priority) params.priority = filters.priority;
  if (filters?.category) params.category = filters.category;
  if (filters?.search) params.search = filters.search;

  const { data } = await api.get<Task[]>("/tasks/", { params });
  return data;
};

export const getTask = async (id: number): Promise<Task> => {
  const { data } = await api.get<Task>(`/tasks/${id}`);
  return data;
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  const { data } = await api.post<Task>("/tasks/", task);
  return data;
};

export const updateTask = async (id: number, task: TaskUpdate): Promise<Task> => {
  const { data } = await api.put<Task>(`/tasks/${id}`, task);
  return data;
};

export const completeTask = async (id: number): Promise<Task> => {
  const { data } = await api.patch<Task>(`/tasks/${id}/complete`);
  return data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// ─── Chatbot ──────────────────────────────────────────────────────────────────

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>("/chat/", {
    message,
    user_id: "demo_user",
  });
  return data;
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>("/stats/dashboard");
  return data;
};

export const getSmartSuggestions = async (): Promise<SmartSuggestion[]> => {
  const { data } = await api.get<SmartSuggestion[]>("/stats/suggestions");
  return data;
};

// ─── History ──────────────────────────────────────────────────────────────────

export const getActivityLog = async (limit = 20): Promise<ActivityLog[]> => {
  const { data } = await api.get<ActivityLog[]>("/history/", { params: { limit } });
  return data;
};
