import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskAI – AI-Powered Task Manager | Zohair Azmat",
  description:
    "A professional AI-powered task manager with smart chatbot, real-time suggestions, and beautiful dark UI. Built with Next.js 14, FastAPI, and OpenAI.",
  keywords: ["task manager", "AI", "productivity", "Next.js", "FastAPI"],
  authors: [{ name: "Zohair Azmat" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
