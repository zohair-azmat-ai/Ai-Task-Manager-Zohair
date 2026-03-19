"""
Stats router — dashboard analytics and smart suggestions.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List
from app.database import get_db
from app.schemas import DashboardStats, SmartSuggestion
from app.services import task_service

router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get comprehensive dashboard statistics."""
    user_id = "demo_user"
    all_tasks = task_service.get_tasks(db, user_id, limit=1000)
    overdue = task_service.get_overdue_tasks(db, user_id)

    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    total = len(all_tasks)
    completed = [t for t in all_tasks if t.status == "completed"]
    pending = [t for t in all_tasks if t.status == "pending"]
    in_progress = [t for t in all_tasks if t.status == "in_progress"]

    # Recent completions (last 7 days)
    recent_completions = len([
        t for t in completed
        if t.completed_at and t.completed_at.replace(tzinfo=timezone.utc) >= week_ago
    ])

    # Tasks by priority
    priority_counts = {}
    for t in all_tasks:
        priority_counts[t.priority] = priority_counts.get(t.priority, 0) + 1

    # Tasks by category
    category_counts = {}
    for t in all_tasks:
        cat = t.category or "Uncategorized"
        category_counts[cat] = category_counts.get(cat, 0) + 1

    completion_rate = round(len(completed) / total * 100, 1) if total > 0 else 0.0

    return DashboardStats(
        total_tasks=total,
        completed_tasks=len(completed),
        pending_tasks=len(pending),
        in_progress_tasks=len(in_progress),
        overdue_tasks=len(overdue),
        completion_rate=completion_rate,
        tasks_by_priority=priority_counts,
        tasks_by_category=category_counts,
        recent_completions=recent_completions,
    )


@router.get("/suggestions", response_model=List[SmartSuggestion])
def get_smart_suggestions(db: Session = Depends(get_db)):
    """Get AI-powered smart suggestions based on current task state."""
    user_id = "demo_user"
    suggestions = []

    all_tasks = task_service.get_tasks(db, user_id, limit=1000)
    overdue = task_service.get_overdue_tasks(db, user_id)
    pending = [t for t in all_tasks if t.status == "pending"]
    completed = [t for t in all_tasks if t.status == "completed"]

    now = datetime.now(timezone.utc)
    today_end = now.replace(hour=23, minute=59, second=59)

    # Overdue warning
    if overdue:
        suggestions.append(SmartSuggestion(
            type="overdue",
            title=f"⚠️ {len(overdue)} Overdue Task{'s' if len(overdue) > 1 else ''}",
            message=f"You have {len(overdue)} overdue task(s). Consider addressing them immediately.",
            tasks=[t.to_dict() for t in overdue[:3]],
        ))

    # Today's due tasks
    today_due = [t for t in pending if t.due_date and t.due_date <= today_end]
    if today_due:
        suggestions.append(SmartSuggestion(
            type="priority",
            title=f"📅 {len(today_due)} Task{'s' if len(today_due) > 1 else ''} Due Today",
            message=f"Focus on completing tasks due today: {', '.join([t.title for t in today_due[:2]])}",
            tasks=[t.to_dict() for t in today_due[:3]],
        ))

    # High priority tasks
    high_priority = [t for t in pending if t.priority in ("high", "urgent")]
    if high_priority:
        suggestions.append(SmartSuggestion(
            type="priority",
            title=f"⚡ {len(high_priority)} High Priority Task{'s' if len(high_priority) > 1 else ''}",
            message=f"Don't forget your high-priority items: {', '.join([t.title for t in high_priority[:2]])}",
            tasks=[t.to_dict() for t in high_priority[:3]],
        ))

    # Productivity summary
    total = len(all_tasks)
    if total > 0:
        rate = round(len(completed) / total * 100, 1)
        message = (
            f"You've completed {len(completed)} of {total} tasks ({rate}%). "
        )
        if rate >= 80:
            message += "Excellent productivity! 🏆"
        elif rate >= 50:
            message += "Good progress — keep it up! 💪"
        else:
            message += "Room to grow — tackle a few tasks today!"

        suggestions.append(SmartSuggestion(
            type="summary",
            title="📊 Productivity Summary",
            message=message,
        ))

    # Recommendation when no urgent tasks
    if not overdue and not today_due and pending:
        next_task = sorted(pending, key=lambda t: (
            {"urgent": 0, "high": 1, "medium": 2, "low": 3}.get(t.priority, 2)
        ))[0]
        suggestions.append(SmartSuggestion(
            type="recommendation",
            title="💡 Recommended Next Task",
            message=f"Your highest priority pending task is: **{next_task.title}**",
            tasks=[next_task.to_dict()],
        ))

    if not suggestions:
        suggestions.append(SmartSuggestion(
            type="summary",
            title="✨ All Clear!",
            message="No urgent tasks right now. Great time to plan ahead or add new goals.",
        ))

    return suggestions
