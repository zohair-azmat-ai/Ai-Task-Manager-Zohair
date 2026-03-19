"use client";

import { AlertTriangle, Calendar, Zap, BarChart3, Lightbulb, RefreshCw } from "lucide-react";
import type { SmartSuggestion } from "@/types";

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  loading?: boolean;
  onRefresh?: () => void;
}

const typeConfig = {
  overdue: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-accent-danger",
    bg: "bg-accent-danger/10",
    border: "border-accent-danger/20",
  },
  priority: {
    icon: <Zap className="w-4 h-4" />,
    color: "text-accent-warning",
    bg: "bg-accent-warning/10",
    border: "border-accent-warning/20",
  },
  recommendation: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: "text-accent-primary",
    bg: "bg-accent-primary/10",
    border: "border-accent-primary/20",
  },
  summary: {
    icon: <BarChart3 className="w-4 h-4" />,
    color: "text-accent-success",
    bg: "bg-accent-success/10",
    border: "border-accent-success/20",
  },
};

export default function SmartSuggestions({
  suggestions,
  loading,
  onRefresh,
}: SmartSuggestionsProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent-primary" />
          <h2 className="font-semibold text-text-primary text-sm">Smart Suggestions</h2>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-text-muted hover:text-text-secondary transition-colors p-1 rounded hover:bg-bg-hover"
            title="Refresh suggestions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-bg-hover rounded-lg animate-pulse" />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-6 text-text-muted text-sm">
          No suggestions right now.
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const config = typeConfig[suggestion.type] || typeConfig.summary;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${config.bg} ${config.border} animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`flex items-start gap-2 ${config.color}`}>
                  <div className="mt-0.5 flex-shrink-0">{config.icon}</div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-text-primary leading-snug">
                      {suggestion.title}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
                      {suggestion.message}
                    </p>
                    {suggestion.tasks && suggestion.tasks.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {suggestion.tasks.slice(0, 3).map((task) => (
                          <span
                            key={task.id}
                            className="text-xs bg-bg-primary/50 text-text-secondary px-2 py-0.5 rounded border border-bg-border truncate max-w-[120px]"
                            title={task.title}
                          >
                            {task.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
