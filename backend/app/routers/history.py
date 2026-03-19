"""
History router — activity log endpoints.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ActivityLog
from app.schemas import ActivityResponse

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/", response_model=List[ActivityResponse])
def get_activity_log(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Get recent activity log entries, newest first."""
    logs = (
        db.query(ActivityLog)
        .filter(ActivityLog.user_id == "demo_user")
        .order_by(ActivityLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        ActivityResponse(
            id=log.id,
            action=log.action,
            task_id=log.task_id,
            task_title=log.task_title,
            details=log.details,
            user_id=log.user_id,
            created_at=log.created_at,
        )
        for log in logs
    ]
