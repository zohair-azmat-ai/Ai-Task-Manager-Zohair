"use client";

import { useState, useEffect, useCallback } from "react";
import { History, RefreshCw, Filter } from "lucide-react";
import Header from "@/components/layout/Header";
import { getActivityLog } from "@/lib/api";
import type { ActivityLog } from "@/types";
import { formatDate, formatRelativeTime, actionConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
  created: "bg-accent-success/10 border-accent-success/30 text-accent-success",
  updated: "bg-accent-info/10 border-accent-info/30 text-accent-info",
  deleted: "bg-accent-danger/10 border-accent-danger/30 text-accent-danger",
  completed: "bg-accent-success/10 border-accent-success/30 text-accent-success",
};

export default function HistoryPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getActivityLog(limit);
      setLogs(data);
    } catch {
      setError("Failed to load history. Is the backend running?");
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredLogs = filter
    ? logs.filter(
        (log) =>
          log.action === filter ||
          log.task_title?.toLowerCase().includes(filter.toLowerCase())
      )
    : logs;

  const actionCounts = logs.reduce(
    (acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <Header
        title="Activity History"
        subtitle="Complete log of all task actions"
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-accent-danger/10 border border-accent-danger/20 rounded-xl p-4 text-accent-danger text-sm">
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["created", "completed", "updated", "deleted"].map((action) => {
            const config = actionConfig[action] || { icon: "•", color: "text-text-muted" };
            const colorClass = ACTION_COLORS[action] || "";
            return (
              <div
                key={action}
                className={cn(
                  "glass-card p-4 cursor-pointer transition-all hover:scale-[1.02]",
                  filter === action && "border-accent-primary/50"
                )}
                onClick={() => setFilter(filter === action ? "" : action)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-text-muted text-xs capitalize">
                    {action}
                  </span>
                </div>
                <div className={cn("text-2xl font-bold", config.color)}>
                  {actionCounts[action] || 0}
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent-primary" />
            <h2 className="font-semibold text-text-primary">
              {filteredLogs.length} Events
            </h2>
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="text-xs text-accent-primary hover:text-accent-secondary ml-2"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="input-field text-sm w-auto"
            >
              <option value={20} className="bg-bg-secondary">Last 20</option>
              <option value={50} className="bg-bg-secondary">Last 50</option>
              <option value={100} className="bg-bg-secondary">Last 100</option>
              <option value={200} className="bg-bg-secondary">Last 200</option>
            </select>
            <button
              onClick={loadHistory}
              className="btn-secondary flex items-center gap-1.5 text-sm py-2"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", loading && "animate-spin")}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card divide-y divide-bg-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center">
              <History className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
              <p className="text-text-muted">
                {filter ? "No events match this filter." : "No activity yet."}
              </p>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const config = actionConfig[log.action] || {
                icon: "•",
                color: "text-text-muted",
              };
              const colorClass = ACTION_COLORS[log.action] || "bg-bg-hover border-bg-border text-text-muted";
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 hover:bg-bg-hover/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
                >
                  {/* Action badge */}
                  <span
                    className={cn(
                      "badge border flex-shrink-0 mt-0.5 capitalize",
                      colorClass
                    )}
                  >
                    {config.icon} {log.action}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm">
                      {log.task_title ? (
                        <>
                          <span className="font-medium">&ldquo;{log.task_title}&rdquo;</span>
                          {" "}
                          <span className="text-text-muted">was {log.action}</span>
                        </>
                      ) : (
                        <span className="text-text-muted">{log.details}</span>
                      )}
                    </p>
                    {log.details && log.task_title && (
                      <p className="text-text-muted text-xs mt-0.5">
                        {log.details}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-text-muted text-xs">
                      {formatRelativeTime(log.created_at)}
                    </p>
                    <p className="text-text-muted text-xs opacity-60">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
