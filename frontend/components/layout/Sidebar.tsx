"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  History,
  Sparkles,
  LogOut,
  Bot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logout, getUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/history", label: "Activity", icon: History },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-bg-secondary border-r border-bg-border flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-bg-border flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-text-primary truncate">TaskAI</span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-muted hover:text-text-secondary transition-colors p-1 rounded-md hover:bg-bg-hover"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link",
                active && "active",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* AI Tag */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-4 h-4 text-accent-primary" />
            <span className="text-accent-primary text-xs font-medium">
              AI Assistant
            </span>
          </div>
          <p className="text-text-muted text-xs leading-relaxed">
            Chatbot available on the dashboard. Type naturally!
          </p>
        </div>
      )}

      {/* User / Logout */}
      <div className="p-3 border-t border-bg-border flex-shrink-0">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-text-primary text-sm font-medium truncate">
                {user.name}
              </p>
              <p className="text-text-muted text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "sidebar-link w-full text-accent-danger hover:text-accent-danger hover:bg-accent-danger/10",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
