"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class StatusEnum(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


# ─── Task Schemas ────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.MEDIUM
    status: StatusEnum = StatusEnum.PENDING
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str
    status: str
    category: Optional[str]
    tags: List[str]
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    user_id: str

    class Config:
        from_attributes = True


# ─── Chatbot Schemas ──────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    user_id: str = "demo_user"


class ChatResponse(BaseModel):
    reply: str
    action: Optional[str] = None
    task: Optional[dict] = None
    tasks: Optional[List[dict]] = None
    mode: str = "fallback"  # "openai" or "fallback"


# ─── Stats Schemas ────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    overdue_tasks: int
    completion_rate: float
    tasks_by_priority: dict
    tasks_by_category: dict
    recent_completions: int  # last 7 days


class SmartSuggestion(BaseModel):
    type: str  # "priority", "overdue", "recommendation", "summary"
    title: str
    message: str
    tasks: Optional[List[dict]] = None


# ─── Activity Schemas ─────────────────────────────────────────────────────────

class ActivityResponse(BaseModel):
    id: int
    action: str
    task_id: Optional[int]
    task_title: Optional[str]
    details: Optional[str]
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
