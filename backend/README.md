---
title: TaskAI Backend
emoji: 🚀
colorFrom: indigo
colorTo: orange
sdk: docker
pinned: false
---

# TaskAI — FastAPI Backend

This is the FastAPI backend for [TaskAI](https://github.com/zohair-azmat-ai/Ai-Task-Manager-Zohair), an AI-powered task manager.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |
| GET/POST | `/api/tasks/` | Task CRUD |
| POST | `/api/chat/` | AI Chatbot |
| GET | `/api/stats/dashboard` | Dashboard stats |
| GET | `/api/history/` | Activity log |

## Environment Variables

Set these as **Secrets** in your Hugging Face Space settings:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional | Enables GPT responses (falls back to rule engine if not set) |
| `FRONTEND_URL` | Recommended | Your Vercel frontend URL for CORS (e.g. `https://your-app.vercel.app`) |
| `SECRET_KEY` | Recommended | A random secret string |

## Deployment

This Space uses the **Docker** SDK. The `Dockerfile` at the root handles everything automatically.

1. Push the contents of the `backend/` folder to a new Hugging Face Space
2. Set the environment secrets above
3. The Space will build and run automatically
