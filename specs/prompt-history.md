# Development Log — AI Task Manager Assistant

**Project:** AI Task Manager Assistant — Zohair Azmat
**Built with:** Claude AI (Sonnet 4.6) via Claude Code
**Date:** March 2026

---

## Phase 1 — Project Scaffolding

**Goal:** Set up the repository structure and tech stack selection.

Inspected the empty repository and decided on:
- Next.js 14 App Router (TypeScript) for modern React patterns
- FastAPI + SQLAlchemy for a clean Python backend
- SQLite for zero-config local development
- Tailwind CSS with a custom dark theme palette
- Lucide React for consistent iconography

Created the folder structure:
```
ai-task-manager-zohair/
├── frontend/     ← Next.js app
├── backend/      ← FastAPI + SQLite
└── specs/        ← Documentation
```

---

## Phase 2 — Backend Implementation

**Goal:** Build a complete REST API with business logic.

### Database Layer
- Designed `Task` and `ActivityLog` SQLAlchemy models
- Configured SQLite with `check_same_thread=False`
- Used `server_default=func.now()` for automatic timestamps
- Added `to_dict()` methods for clean serialization

### Service Layer
- `task_service.py` — full CRUD with search/filter/pagination
- Auto-logs activity on every create/update/delete/complete action
- `get_overdue_tasks()` — queries tasks past due_date that aren't completed

### AI Service
- `ai_service.py` — routes to OpenAI if key present, else rule-based fallback
- Implemented `rule_based_response()` with pattern matching for 10+ command types
- Date parsing helper (`_parse_date_hint`) handles "tomorrow", "today", "next week"
- Priority detection from keywords like "urgent", "asap", "important"

### API Routers
- `tasks.py` — 6 endpoints (list, create, get, update, complete, delete)
- `chatbot.py` — 1 endpoint (process natural language)
- `stats.py` — 2 endpoints (dashboard stats, smart suggestions)
- `history.py` — 1 endpoint (activity log)
- CORS configured for Next.js dev server

---

## Phase 3 — Frontend Foundation

**Goal:** Set up Next.js with custom dark theme and shared utilities.

### Design System
- Extended Tailwind config with semantic color tokens:
  - `bg.primary` (#07070f), `bg.secondary` (#0e0e1a), `bg.card` (#12121f)
  - `accent.primary` (#6366f1 indigo), gradient to `accent.secondary` (#8b5cf6)
  - `text.primary` (#e2e8f0), `text.secondary` (#94a3b8), `text.muted` (#475569)
- Defined reusable component classes in `globals.css`: `.glass-card`, `.btn-primary`, `.input-field`, `.badge`, `.sidebar-link`
- Custom scrollbar styling, text selection highlight, smooth scroll

### Utilities
- `lib/utils.ts` — `priorityConfig`, `statusConfig`, `formatDate`, `formatRelativeTime`, `isOverdue`, `cn()`
- `lib/api.ts` — centralized Axios client, all API calls in one place
- `lib/auth.ts` — demo auth with localStorage, includes multiple demo credential sets
- `types/index.ts` — comprehensive TypeScript interfaces

---

## Phase 4 — UI Components

**Goal:** Build reusable, professional-grade React components.

### Layout Components
- `Sidebar` — collapsible left nav with logo, nav items, AI info card, user profile
- `Header` — sticky header with page title, API status indicator, live clock, avatar

### Dashboard Components
- `StatsCards` — 4 metric cards + progress bar + weekly summary with loading skeletons
- `SmartSuggestions` — color-coded suggestion cards by type (overdue/priority/recommendation/summary)
- `ActivityLog` — timeline with action icons, relative timestamps, loading states

### Task Components
- `TaskCard` — hover-reveal actions, priority/status badges, overdue highlighting, tag pills
- `TaskForm` — full modal with all fields, tag management, validation
- `TaskList` — wraps cards with loading skeletons and empty states

### Chatbot Component
- `ChatbotPanel` — collapsible chat UI, message bubbles, quick-command pills, markdown rendering
- Loading spinner during API calls, auto-scroll to latest message
- Triggers dashboard refresh on task mutations

---

## Phase 5 — Pages

**Goal:** Connect all components into routed, functional pages.

### Landing Page (`/`)
- Animated typewriter demo showing chatbot commands
- Hero with gradient text and glow effects
- Mock dashboard screenshot UI
- Features grid with hover effects
- Tech stack tags
- CTA section

### Login Page (`/login`)
- Pre-filled demo credentials
- Password show/hide toggle
- Error state with icon
- Loading state during authentication
- Redirects to dashboard if already logged in

### Dashboard Page (`/dashboard`)
- Loads stats, suggestions, activity, and recent tasks in parallel
- Error banner when backend is offline (with helpful instruction)
- 2-column layout: chatbot + task preview left, suggestions + activity right
- Task form modal for create/edit

### Tasks Page (`/dashboard/tasks`)
- Status tabs (All/Pending/In Progress/Completed)
- Search with clear button
- Collapsible filter panel (priority, category)
- Debounced search (300ms)
- Inline delete confirmation

### History Page (`/dashboard/history`)
- Action summary cards (clickable to filter)
- Full timeline with action badges
- Configurable limit selector
- Relative + absolute timestamps

---

## Phase 6 — Documentation & Specs

**Goal:** Professional documentation for portfolio and GitHub.

- `README.md` — full project overview, setup, features, folder structure
- `specs/project-spec.md` — architecture, goals, tech stack, security notes
- `specs/feature-list.md` — complete checked feature list with future improvements
- `specs/api-spec.md` — full API reference with request/response examples
- `specs/prompt-history.md` — this file (development log)
- `.env.example` files for both frontend and backend

---

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite over PostgreSQL | Zero-setup for demos; environment variable swap for production |
| Rule-based AI fallback | App must work without OpenAI key for all demos/interviews |
| Next.js rewrites for API proxy | Single origin, no CORS issues in development |
| localStorage for auth | Demo simplicity; structure ready for NextAuth migration |
| Tailwind CSS | Rapid dark theme implementation, design system consistency |
| App Router over Pages Router | Modern Next.js patterns, better code organization |
| Axios over fetch | Better error handling, interceptors ready for auth tokens |
| SQLAlchemy 2.0 | Modern async-compatible ORM, production-ready |
