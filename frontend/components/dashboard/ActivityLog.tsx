"use client";

import { History, RefreshCw } from "lucide-react";
import type { ActivityLog } from "@/types";
import { formatRelativeTime, actionConfig } from "@/lib/utils";

interface ActivityLogProps {
  logs: ActivityLog[];
  loading?: boolean;
  onRefresh?: () => void;
}

export default function ActivityLogPanel({
  logs,
  loading,
  onRefresh,
}: ActivityLogProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-accent-primary" />
          <h2 className="font-semibold text-text-primary text-sm">
            Recent Activity
          </h2>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-text-muted hover:text-text-secondary transition-colors p-1 rounded hover:bg-bg-hover"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-6 h-6 bg-bg-hover rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 w-3/4 bg-bg-hover rounded mb-1.5" />
                <div className="h-2 w-1/3 bg-bg-hover rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-text-muted text-sm">
          <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No activity yet. Start by creating a task!
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log, index) => {
            const config = actionConfig[log.action] || { icon: "•", color: "text-text-muted" };
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 py-2.5 border-b border-bg-border last:border-0 animate-fade-in group"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="text-base flex-shrink-0 mt-0.5 w-5 text-center">
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-secondary text-sm leading-snug">
                    <span className={`font-medium capitalize ${config.color}`}>
                      {log.action}
                    </span>{" "}
                    {log.task_title && (
                      <span className="text-text-primary">
                        &ldquo;{log.task_title}&rdquo;
                      </span>
                    )}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {formatRelativeTime(log.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
