# Project Specification — AI Task Manager Assistant

**Project Name:** AI Task Manager Assistant
**Author:** Zohair Azmat
**Version:** 1.0.0
**Type:** Full-Stack Portfolio Project

---

## Overview

A professional, full-stack AI-powered task management application built for portfolio purposes. The project demonstrates modern web development practices including React with Next.js 14, FastAPI for the backend, SQLite for persistence, and a smart AI chatbot with OpenAI integration (with a rule-based fallback so the demo always works).

---

## Goals

1. Build a production-quality full-stack application from scratch
2. Demonstrate clean architecture and code organization
3. Showcase AI integration in a practical context
4. Create a visually impressive dashboard suitable for portfolio screenshots
5. Ensure the app is fully functional in demo mode without any API keys

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom dark theme
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Date Handling:** date-fns

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **ORM:** SQLAlchemy 2.0
- **Database:** SQLite (production-ready for PostgreSQL upgrade)
- **Validation:** Pydantic v2
- **AI:** OpenAI GPT-3.5-turbo (with smart fallback)
- **ASGI Server:** Uvicorn

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js Frontend                     │
│  Landing Page → Login → Dashboard → Tasks → History     │
│                                                          │
│  Components: Sidebar, Header, TaskCard, TaskForm,        │
│              ChatbotPanel, StatsCards, SmartSuggestions  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (proxied rewrites)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     FastAPI Backend                      │
│                                                          │
│  Routers: /api/tasks, /api/chat, /api/stats, /api/hist  │
│  Services: task_service, ai_service                      │
│  Models: Task, ActivityLog                               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
                    SQLite Database
                    (tasks.db — auto-created)
```

---

## User Flow

1. User visits landing page → gets overview of the product
2. User clicks "Launch Dashboard" → redirected to login
3. User logs in with demo credentials
4. Dashboard shows stats, recent tasks, chatbot, and suggestions
5. User can:
   - Create/edit/delete tasks with the form
   - Use the chatbot for natural language task management
   - View all tasks with filters on the Tasks page
   - Review the activity timeline on the History page

---

## Security Notes

- Demo auth is localStorage-based for simplicity
- In production: use NextAuth.js or JWT with HTTP-only cookies
- Backend uses user_id="demo_user" globally — production needs proper auth middleware
- .env files excluded from git via .gitignore
- Input validation via Pydantic on backend

---

## Scalability Path

- Swap SQLite → PostgreSQL by changing DATABASE_URL
- Replace demo auth → NextAuth / Clerk / Auth0
- Add Redis for caching frequently accessed stats
- Add WebSockets for real-time chatbot responses
- Deploy frontend to Vercel, backend to Railway/Render
