# 🚀 TaskAI – AI-Powered Task Manager

> A professional full-stack task management application with an AI chatbot, smart suggestions, and a beautiful dark dashboard. Built by **Zohair Azmat**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite)

---

## 🎬 Demo Video

[![TaskAI Demo](https://img.youtube.com/vi/_XYQGFO3ruk/maxresdefault.jpg)](https://www.youtube.com/watch?v=_XYQGFO3ruk)

> Click the thumbnail above to watch the full demo on YouTube.

---

## 📖 Overview

TaskAI is a modern, production-quality task manager that lets you manage your work through both a clean UI and natural language commands. The AI assistant understands commands like *"add finish report by friday"* or *"what should I do today?"* — and if no OpenAI key is configured, a smart rule-based engine handles everything seamlessly.

Built as a portfolio project demonstrating:
- 🏗️ Full-stack architecture (Next.js 14 + FastAPI)
- 🤖 AI/LLM integration with graceful fallback
- 🎨 Professional dark UI with responsive design
- 🧹 Clean code organization and best practices

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🤖 **AI Chatbot** | Natural language task management. OpenAI GPT or smart rule-based fallback |
| ✅ **Task CRUD** | Create, edit, delete, complete with priority, due dates, tags, categories |
| 💡 **Smart Suggestions** | Overdue warnings, today's priorities, productivity recommendations |
| 📊 **Dashboard Analytics** | Completion rate, stats cards, weekly progress |
| 📜 **Activity History** | Full timeline of every create/update/delete/complete event |
| 🔍 **Search & Filters** | Filter by status, priority, category — search across title/description/tags |
| 🔐 **Demo Auth** | Protected routes with localStorage session |
| 📚 **API Docs** | Auto-generated Swagger UI at `/docs` |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                     │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │          Frontend  (Next.js 14 + TypeScript)     │  │
│   │    Landing → Login → Dashboard → Tasks → History │  │
│   └────────────────────┬────────────────────────────┘  │
│                        │  HTTP / REST API               │
└────────────────────────┼────────────────────────────────┘
                         ▼
          ┌──────────────────────────────┐
          │     Backend  (FastAPI)        │
          │  /api/tasks  /api/chat        │
          │  /api/stats  /api/history     │
          └──────────┬───────────────────┘
                     │
          ┌──────────▼───────────────────┐
          │      SQLite Database          │
          │   tasks.db  (auto-created)    │
          └──────────────────────────────┘
                     │
          ┌──────────▼───────────────────┐
          │    AI Service                 │
          │  OpenAI GPT  │  Rule Engine  │
          └──────────────────────────────┘
```

---

## 🖼️ Screenshots

### 🏠 Landing Page
The dark hero page with gradient accents and animated feature highlights.

### 🔑 Login Page
Clean auth form with demo credentials — no registration required.

### 📊 Dashboard
Full-featured overview with stats cards, AI chatbot panel, smart suggestions, and activity feed — all in a collapsible sidebar layout.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS** — Custom dark theme design system
- **Axios** — API client
- **Lucide React** — Icons
- **date-fns** — Date formatting

### Backend
- **FastAPI** — High-performance Python API
- **SQLAlchemy 2.0** — ORM with async-ready structure
- **SQLite** — Zero-config local database (swap to PostgreSQL via env var)
- **Pydantic v2** — Request/response validation
- **OpenAI SDK** — GPT integration with fallback
- **Uvicorn** — ASGI server

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

---

### 1. Clone & Setup

```bash
git clone https://github.com/zohair-azmat-ai/Ai-Task-Manager-Zohair.git
cd Ai-Task-Manager-Zohair
```

---

### 2. Start the Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (optional — app works without OpenAI key)
cp .env.example .env
# Edit .env and add OPENAI_API_KEY if you have one

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend runs at: **http://127.0.0.1:8000**
API docs: **http://127.0.0.1:8000/docs**

> The SQLite database (`tasks.db`) is created automatically on first run.

---

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env.local

# Run the dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

### 4. Log In

Open **http://localhost:3000** and use the demo credentials:

| Email | Password |
|-------|----------|
| `demo@taskai.com` | `demo123` |
| `admin@taskai.com` | `admin123` |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
# OpenAI (optional - app works with fallback if not set)
OPENAI_API_KEY=sk-your-key-here

# Database (default: SQLite)
DATABASE_URL=sqlite:///./tasks.db

# CORS
FRONTEND_URL=http://localhost:3000

# App
SECRET_KEY=your-secret-key
APP_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_APP_NAME=TaskAI
```

---

## 🤖 AI Chatbot Commands

The chatbot works with or without an OpenAI API key.

| Command | Example | Action |
|---------|---------|--------|
| ➕ Add task | `add buy milk tomorrow` | Creates a task with due date |
| 📝 Create task | `create finish report by friday` | Creates a task |
| 📋 Show pending | `show pending tasks` | Lists pending tasks |
| 📂 Show all | `show all tasks` | Lists all tasks |
| ✅ Complete task | `complete gym workout` | Marks matching task done |
| 🗑️ Delete task | `delete old meeting` | Deletes matching task |
| 🗓️ Today's plan | `what should I do today?` | Smart priority suggestions |
| ⚠️ Overdue | `show overdue tasks` | Lists overdue items |
| 📊 Stats | `stats` | Productivity summary |
| ❓ Help | `help` | Lists all commands |

---

## 🔌 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List tasks (with filters) |
| POST | `/api/tasks/` | Create task |
| GET | `/api/tasks/{id}` | Get task |
| PUT | `/api/tasks/{id}` | Update task |
| PATCH | `/api/tasks/{id}/complete` | Mark complete |
| DELETE | `/api/tasks/{id}` | Delete task |
| POST | `/api/chat/` | Chatbot message |
| GET | `/api/stats/dashboard` | Dashboard statistics |
| GET | `/api/stats/suggestions` | Smart suggestions |
| GET | `/api/history/` | Activity log |

---

## 📁 Project Structure

```
ai-task-manager-zohair/
│
├── frontend/                       # Next.js 14 app
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   └── dashboard/
│   │       ├── layout.tsx         # Auth guard + sidebar
│   │       ├── page.tsx           # Dashboard overview
│   │       ├── tasks/
│   │       │   └── page.tsx       # Full task manager
│   │       └── history/
│   │           └── page.tsx       # Activity timeline
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Collapsible nav sidebar
│   │   │   └── Header.tsx         # Page header
│   │   ├── dashboard/
│   │   │   ├── StatsCards.tsx     # Metric cards
│   │   │   ├── SmartSuggestions.tsx
│   │   │   └── ActivityLog.tsx
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx       # Individual task
│   │   │   ├── TaskForm.tsx       # Create/edit modal
│   │   │   └── TaskList.tsx       # Task list wrapper
│   │   └── chatbot/
│   │       └── ChatbotPanel.tsx   # AI chat interface
│   │
│   ├── lib/
│   │   ├── api.ts                 # API client (Axios)
│   │   ├── auth.ts                # Demo auth helpers
│   │   └── utils.ts               # Formatting, colors, cn()
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   │
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── backend/                        # FastAPI Python app
│   └── app/
│       ├── main.py                # FastAPI app + CORS
│       ├── database.py            # SQLAlchemy setup
│       ├── models.py              # Task, ActivityLog models
│       ├── schemas.py             # Pydantic schemas
│       ├── routers/
│       │   ├── tasks.py          # Task CRUD endpoints
│       │   ├── chatbot.py        # Chat endpoint
│       │   ├── stats.py          # Stats + suggestions
│       │   └── history.py        # Activity log
│       └── services/
│           ├── task_service.py   # Business logic
│           └── ai_service.py     # OpenAI + fallback
│
└── specs/
    ├── project-spec.md
    ├── feature-list.md
    ├── api-spec.md
    └── prompt-history.md
```

---

## 🚀 Deployment

### Frontend — Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push repo to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add env var: `NEXT_PUBLIC_API_URL=<your-backend-url>`
5. Deploy — Vercel handles the rest

### Backend — Hugging Face Spaces

1. Create a new Space on [Hugging Face](https://huggingface.co/spaces)
2. Select **Docker** as the SDK
3. Push the `backend/` folder contents
4. Add `OPENAI_API_KEY` as a Space secret (optional)
5. Space URL becomes your FastAPI backend

---

## 🔮 Future Improvements

- 🔐 **Real Auth** — NextAuth.js or Clerk with JWT/sessions
- 🐘 **PostgreSQL** — Production database (just change `DATABASE_URL`)
- 📌 **Kanban Board** — Drag-and-drop task columns
- 📧 **Email Reminders** — Due date notifications via SendGrid
- 💬 **Task Comments** — Per-task discussion thread
- 🔁 **Recurring Tasks** — Daily/weekly repeat
- 📱 **Mobile App** — React Native companion
- ⚡ **Real-time Updates** — WebSocket for live chatbot responses
- 📤 **Export** — Download tasks as CSV or PDF
- 📅 **Calendar View** — Month/week task visualization

---

## 👤 Author

<table>
  <tr>
    <td align="center">
      <b>Zohair Azmat</b><br/>
      Full-Stack Developer & AI Enthusiast<br/>
      <a href="https://github.com/zohair-azmat-ai">GitHub</a>
    </td>
  </tr>
</table>

**Stack:** Next.js · TypeScript · FastAPI · Python · SQLAlchemy · OpenAI · Tailwind CSS

---

*This project is portfolio-grade software — structured, documented, and built for real-world readability.*
