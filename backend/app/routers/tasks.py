"""
Tasks router — CRUD endpoints for task management.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.services import task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/", response_model=List[TaskResponse])
def list_tasks(
    status: Optional[str] = Query(None, description="Filter by status: pending, in_progress, completed"),
    priority: Optional[str] = Query(None, description="Filter by priority: low, medium, high, urgent"),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search by title, description, or tags"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List all tasks with optional filtering."""
    tasks = task_service.get_tasks(
        db,
        user_id="demo_user",
        status=status,
        priority=priority,
        category=category,
        search=search,
        skip=skip,
        limit=limit,
    )
    # Convert to response format
    result = []
    for task in tasks:
        d = task.to_dict()
        result.append(TaskResponse(**{
            **d,
            "due_date": task.due_date,
            "created_at": task.created_at,
            "updated_at": task.updated_at,
            "completed_at": task.completed_at,
        }))
    return result


@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task."""
    task = task_service.create_task(db, task_data, user_id="demo_user")
    d = task.to_dict()
    return TaskResponse(**{
        **d,
        "due_date": task.due_date,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "completed_at": task.completed_at,
    })


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a single task by ID."""
    task = task_service.get_task(db, task_id, user_id="demo_user")
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    d = task.to_dict()
    return TaskResponse(**{
        **d,
        "due_date": task.due_date,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "completed_at": task.completed_at,
    })


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    """Update a task."""
    task = task_service.update_task(db, task_id, task_data, user_id="demo_user")
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    d = task.to_dict()
    return TaskResponse(**{
        **d,
        "due_date": task.due_date,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "completed_at": task.completed_at,
    })


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    """Mark a task as completed."""
    from app.schemas import StatusEnum
    task = task_service.update_task(
        db, task_id, TaskUpdate(status=StatusEnum.COMPLETED), user_id="demo_user"
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    d = task.to_dict()
    return TaskResponse(**{
        **d,
        "due_date": task.due_date,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "completed_at": task.completed_at,
    })


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task."""
    deleted = task_service.delete_task(db, task_id, user_id="demo_user")
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return None
