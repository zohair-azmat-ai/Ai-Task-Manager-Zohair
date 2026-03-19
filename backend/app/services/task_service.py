"""
Task service layer — business logic for task operations.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timezone
from typing import Optional, List
from app.models import Task, ActivityLog
from app.schemas import TaskCreate, TaskUpdate


def log_activity(db: Session, action: str, task: Task, details: str = None):
    """Helper to record an activity log entry."""
    entry = ActivityLog(
        action=action,
        task_id=task.id,
        task_title=task.title,
        details=details,
        user_id=task.user_id,
    )
    db.add(entry)
    db.commit()


def create_task(db: Session, task_data: TaskCreate, user_id: str = "demo_user") -> Task:
    tags_str = ",".join(task_data.tags) if task_data.tags else ""
    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority.value,
        status=task_data.status.value,
        category=task_data.category,
        tags=tags_str,
        due_date=task_data.due_date,
        user_id=user_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    log_activity(db, "created", task, f"Task '{task.title}' was created")
    return task


def get_task(db: Session, task_id: int, user_id: str = "demo_user") -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()


def get_tasks(
    db: Session,
    user_id: str = "demo_user",
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Task]:
    query = db.query(Task).filter(Task.user_id == user_id)

    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if category:
        query = query.filter(Task.category == category)
    if search:
        query = query.filter(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%"),
                Task.tags.ilike(f"%{search}%"),
            )
        )

    return query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()


def update_task(db: Session, task_id: int, task_data: TaskUpdate, user_id: str = "demo_user") -> Optional[Task]:
    task = get_task(db, task_id, user_id)
    if not task:
        return None

    update_data = task_data.model_dump(exclude_unset=True)

    # Handle status change to completed
    if update_data.get("status") == "completed" and task.status != "completed":
        task.completed_at = datetime.now(timezone.utc)
    elif update_data.get("status") and update_data["status"] != "completed":
        task.completed_at = None

    # Handle tags serialization
    if "tags" in update_data and update_data["tags"] is not None:
        task.tags = ",".join(update_data.pop("tags"))
    elif "tags" in update_data:
        update_data.pop("tags")

    # Handle enum values
    if "priority" in update_data and update_data["priority"] is not None:
        update_data["priority"] = update_data["priority"].value if hasattr(update_data["priority"], "value") else update_data["priority"]
    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = update_data["status"].value if hasattr(update_data["status"], "value") else update_data["status"]

    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)

    action = "completed" if task.status == "completed" else "updated"
    log_activity(db, action, task, f"Task '{task.title}' was {action}")
    return task


def delete_task(db: Session, task_id: int, user_id: str = "demo_user") -> bool:
    task = get_task(db, task_id, user_id)
    if not task:
        return False

    # Log before deletion
    entry = ActivityLog(
        action="deleted",
        task_id=task.id,
        task_title=task.title,
        details=f"Task '{task.title}' was deleted",
        user_id=user_id,
    )
    db.add(entry)

    db.delete(task)
    db.commit()
    return True


def get_overdue_tasks(db: Session, user_id: str = "demo_user") -> List[Task]:
    now = datetime.now(timezone.utc)
    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status != "completed",
            Task.due_date != None,
            Task.due_date < now,
        )
        .all()
    )
