"use client";

import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const StatSkeleton = () => (
  <div className="stat-card animate-pulse">
    <div className="h-4 w-20 bg-bg-hover rounded mb-3" />
    <div className="h-8 w-12 bg-bg-hover rounded mb-2" />
    <div className="h-3 w-16 bg-bg-hover rounded" />
  </div>
);

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Tasks",
      value: stats.total_tasks,
      icon: <ListTodo className="w-5 h-5" />,
      color: "text-text-secondary",
      iconBg: "bg-bg-hover",
      sub: "All time",
    },
    {
      label: "Completed",
      value: stats.completed_tasks,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-accent-success",
      iconBg: "bg-accent-success/10",
      sub: `${stats.completion_rate}% rate`,
    },
    {
      label: "Pending",
      value: stats.pending_tasks,
      icon: <Clock className="w-5 h-5" />,
      color: "text-accent-warning",
      iconBg: "bg-accent-warning/10",
      sub: `${stats.in_progress_tasks} in progress`,
    },
    {
      label: "Overdue",
      value: stats.overdue_tasks,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: stats.overdue_tasks > 0 ? "text-accent-danger" : "text-text-secondary",
      iconBg: stats.overdue_tasks > 0 ? "bg-accent-danger/10" : "bg-bg-hover",
      sub: stats.overdue_tasks > 0 ? "Action needed" : "All on time",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-muted text-sm font-medium">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.iconBg} ${card.color} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
            <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-text-muted text-xs mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress bar + supplemental row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completion Progress */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm font-medium">Completion Progress</span>
            <TrendingUp className="w-4 h-4 text-accent-primary" />
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-2xl font-bold text-text-primary">
              {stats.completion_rate}%
            </span>
            <span className="text-text-muted text-sm mb-0.5">
              {stats.completed_tasks} of {stats.total_tasks}
            </span>
          </div>
          <div className="w-full h-2 bg-bg-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-gradient rounded-full transition-all duration-700"
              style={{ width: `${stats.completion_rate}%` }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm font-medium">This Week</span>
            <Zap className="w-4 h-4 text-accent-warning" />
          </div>
          <div className="text-2xl font-bold text-text-primary mb-1">
            {stats.recent_completions}
          </div>
          <p className="text-text-muted text-xs">Tasks completed in the last 7 days</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            {Object.entries(stats.tasks_by_priority).map(([priority, count]) => (
              <span
                key={priority}
                className={`badge ${
                  priority === "urgent"
                    ? "bg-accent-danger/10 text-accent-danger"
                    : priority === "high"
                    ? "bg-accent-warning/10 text-accent-warning"
                    : priority === "medium"
                    ? "bg-accent-info/10 text-accent-info"
                    : "bg-bg-hover text-text-muted"
                }`}
              >
                {count} {priority}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
