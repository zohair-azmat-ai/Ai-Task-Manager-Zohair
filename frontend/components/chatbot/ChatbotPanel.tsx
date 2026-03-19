"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

const EXAMPLE_COMMANDS = [
  "add buy milk tomorrow",
  "show pending tasks",
  "complete gym",
  "what should I do today?",
  "stats",
];

interface ChatbotPanelProps {
  onTaskChange?: () => void;
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-bg-hover px-1 rounded text-accent-primary text-xs">$1</code>')
    .replace(/\n/g, '<br/>');
}

export default function ChatbotPanel({ onTaskChange }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm your **AI Task Assistant**. I can help you manage tasks with natural language.\n\nTry: `add buy milk tomorrow` or `what should I do today?`\n\nType `help` to see all commands.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(messageText);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date(),
        action: response.action,
        tasks: response.tasks,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Refresh task list if a task was modified
      if (
        response.action &&
        ["task_created", "task_completed", "task_deleted"].includes(
          response.action
        )
      ) {
        onTaskChange?.();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "⚠️ Couldn't connect to the backend. Make sure the FastAPI server is running on port 8000.",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-bg-border cursor-pointer hover:bg-bg-hover/50 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center shadow-glow">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary text-sm">
              AI Assistant
            </h2>
            <p className="text-text-muted text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-accent-success rounded-full" />
              Online — Smart fallback enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
          {collapsed ? (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          )}
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-[200px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 animate-slide-up",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    message.role === "assistant"
                      ? "bg-accent-gradient shadow-glow"
                      : "bg-bg-hover border border-bg-border"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-text-secondary" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed",
                    message.role === "assistant"
                      ? "bg-bg-hover text-text-primary rounded-tl-none"
                      : "bg-accent-primary/20 text-text-primary border border-accent-primary/30 rounded-tr-none"
                  )}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(message.content),
                    }}
                  />
                  <p className="text-text-muted text-xs mt-1.5 opacity-70">
                    {message.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-accent-gradient flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-bg-hover rounded-xl rounded-tl-none px-3 py-2.5 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 text-accent-primary animate-spin" />
                  <span className="text-text-muted text-xs">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick commands */}
          <div className="px-4 pb-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {EXAMPLE_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleSend(cmd)}
                  disabled={loading}
                  className="flex-shrink-0 text-xs bg-bg-hover hover:bg-bg-border text-text-muted hover:text-text-secondary px-2.5 py-1 rounded-full border border-bg-border transition-all disabled:opacity-50 font-mono"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 pt-2 border-t border-bg-border">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command... (e.g. add buy milk)"
                className="input-field text-sm flex-1"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="btn-primary p-2.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
