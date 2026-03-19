"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Zap,
  Bot,
  BarChart3,
  Calendar,
  Shield,
  ArrowRight,
  Sparkles,
  Github,
} from "lucide-react";

const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "AI Chatbot",
    description:
      "Natural language commands. Just type 'add buy milk tomorrow' and your AI assistant handles the rest.",
    color: "text-accent-primary",
    bg: "bg-accent-primary/10",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Smart Suggestions",
    description:
      "Get intelligent recommendations based on due dates, priority levels, and your productivity patterns.",
    color: "text-accent-warning",
    bg: "bg-accent-warning/10",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Live Analytics",
    description:
      "Track completion rates, overdue tasks, and productivity summaries in a beautiful dashboard.",
    color: "text-accent-success",
    bg: "bg-accent-success/10",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Task Management",
    description:
      "Full CRUD with priority levels, due dates, categories, tags, and powerful search & filters.",
    color: "text-accent-info",
    bg: "bg-accent-info/10",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Activity History",
    description:
      "Every action logged. See a complete timeline of what was created, completed, or deleted.",
    color: "text-accent-secondary",
    bg: "bg-accent-secondary/10",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Demo Auth",
    description:
      "Protected routes with demo credentials. Production-ready auth structure included.",
    color: "text-accent-danger",
    bg: "bg-accent-danger/10",
  },
];

const commands = [
  "add buy milk tomorrow",
  "show pending tasks",
  "complete gym workout",
  "what should I do today?",
  "delete old meeting task",
  "stats",
];

export default function LandingPage() {
  const [commandIndex, setCommandIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = commands[commandIndex];
    if (charIndex < current.length) {
      const timer = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 60);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCharIndex(0);
        setDisplayed("");
        setCommandIndex((i) => (i + 1) % commands.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [charIndex, commandIndex]);

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 border-b border-bg-border backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-text-primary">TaskAI</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/zohairazmat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <Link href="/login" className="btn-primary text-sm">
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full px-4 py-1.5 text-accent-primary text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Productivity — Portfolio Project by Zohair Azmat
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight">
            Your intelligent
            <br />
            <span className="text-gradient">task assistant</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage tasks with natural language. Get smart suggestions. Track
            your productivity. Powered by AI with a beautiful dark dashboard.
          </p>

          {/* Animated command demo */}
          <div className="inline-flex items-center gap-3 bg-bg-card border border-bg-border rounded-xl px-5 py-3 mb-10 font-mono text-sm">
            <Bot className="w-4 h-4 text-accent-primary flex-shrink-0" />
            <span className="text-text-secondary">›</span>
            <span className="text-text-primary min-w-[200px] text-left">
              {displayed}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="btn-primary flex items-center gap-2 text-base px-6 py-3"
            >
              Launch Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary flex items-center gap-2 text-base px-6 py-3"
            >
              Demo Login
            </Link>
          </div>

          <p className="text-text-muted text-sm mt-4">
            Demo credentials: <code className="text-accent-primary bg-accent-primary/10 px-1 rounded">demo@taskai.com</code> /{" "}
            <code className="text-accent-primary bg-accent-primary/10 px-1 rounded">demo123</code>
          </p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-1 shadow-glow">
            <div className="bg-bg-secondary rounded-xl p-6">
              {/* Mock dashboard */}
              <div className="flex gap-4 mb-6">
                <div className="w-48 hidden md:block">
                  <div className="space-y-1">
                    {["Dashboard", "Tasks", "History"].map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          i === 0
                            ? "bg-accent-primary/10 text-accent-primary"
                            : "text-text-muted"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total", value: "24", color: "text-text-primary" },
                    { label: "Completed", value: "18", color: "text-accent-success" },
                    { label: "Pending", value: "5", color: "text-accent-warning" },
                    { label: "Overdue", value: "1", color: "text-accent-danger" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-card p-4 text-center">
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-text-muted text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { title: "Buy groceries", status: "completed", priority: "medium" },
                  { title: "Finish project report", status: "in_progress", priority: "high" },
                  { title: "Team meeting", status: "pending", priority: "urgent" },
                ].map((task) => (
                  <div key={task.title} className="glass-card p-3 flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.status === "completed"
                          ? "bg-accent-success"
                          : task.priority === "urgent"
                          ? "bg-accent-danger"
                          : "bg-accent-warning"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium truncate ${
                          task.status === "completed"
                            ? "line-through text-text-muted"
                            : "text-text-primary"
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-xs text-text-muted capitalize">
                        {task.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything you need
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              A complete full-stack application showcasing modern web development
              practices.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:border-accent-primary/30 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Built with modern tech
          </h2>
          <p className="text-text-secondary mb-12">
            Production-ready stack with clean architecture and professional code
            quality.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 14",
              "TypeScript",
              "Tailwind CSS",
              "FastAPI",
              "SQLAlchemy",
              "SQLite",
              "OpenAI API",
              "Pydantic",
              "Axios",
              "Lucide Icons",
            ].map((tech) => (
              <span
                key={tech}
                className="bg-bg-card border border-bg-border text-text-secondary px-4 py-2 rounded-full text-sm font-medium hover:border-accent-primary/50 hover:text-text-primary transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-bg-secondary/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-10 shadow-glow">
            <Sparkles className="w-10 h-10 text-accent-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Try the demo now
            </h2>
            <p className="text-text-secondary mb-8">
              No setup required for the frontend demo. Launch the dashboard and
              explore all features.
            </p>
            <Link
              href="/login"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent-gradient rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-text-secondary text-sm">
              TaskAI — Built by{" "}
              <span className="text-text-primary font-medium">Zohair Azmat</span>
            </span>
          </div>
          <div className="text-text-muted text-sm">
            Next.js 14 · FastAPI · OpenAI · SQLite
          </div>
        </div>
      </footer>
    </div>
  );
}
