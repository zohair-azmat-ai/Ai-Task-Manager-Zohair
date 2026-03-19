"""
AI Task Manager — FastAPI Backend
Main application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.database import init_db
from app.routers import tasks, chatbot, stats, history

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(
    title="AI Task Manager API",
    description="Backend API for the AI-powered Task Manager by Zohair Azmat",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(tasks.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(history.router, prefix="/api")


@app.on_event("startup")
async def on_startup():
    """Initialize the database on startup."""
    init_db()
    print("Database initialized")
    print("AI Task Manager API running")
    print("Docs: http://127.0.0.1:8000/docs")


@app.get("/")
def root():
    return {
        "name": "AI Task Manager API",
        "version": "1.0.0",
        "author": "Zohair Azmat",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
