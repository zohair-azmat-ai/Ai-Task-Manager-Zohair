"use client";

import { Bell, Search, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const user = getUser();
  const [isOnline, setIsOnline] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    // Check backend connectivity
    fetch("/api")
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false));

    // Live clock
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-bg-secondary/50 border-b border-bg-border flex items-center justify-between px-6 backdrop-blur-sm sticky top-0 z-30">
      <div>
        <h1 className="text-text-primary font-semibold text-lg leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-muted text-xs mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* API Status */}
        <div
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
            isOnline
              ? "text-accent-success bg-accent-success/10 border-accent-success/20"
              : "text-accent-danger bg-accent-danger/10 border-accent-danger/20"
          }`}
        >
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          <span className="hidden sm:inline">{isOnline ? "API Connected" : "API Offline"}</span>
        </div>

        {/* Time */}
        <span className="text-text-muted text-sm hidden md:block font-mono">
          {time}
        </span>

        {/* Notification bell (decorative) */}
        <button className="relative p-2 text-text-muted hover:text-text-secondary hover:bg-bg-hover rounded-lg transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-primary rounded-full" />
        </button>

        {/* Avatar */}
        {user && (
          <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-white text-sm font-bold">
            {user.name.charAt(0)}
          </div>
        )}
      </div>
    </header>
  );
}
