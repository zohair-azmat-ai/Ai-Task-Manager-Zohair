"""
Chatbot router — AI-powered natural language task management.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatMessage, ChatResponse
from app.services.ai_service import process_chat_message

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage, db: Session = Depends(get_db)):
    """
    Process a natural language command.
    Routes to OpenAI if key is set, otherwise uses smart rule-based fallback.

    Examples:
    - "add buy milk tomorrow"
    - "show pending tasks"
    - "complete gym"
    - "what should I do today?"
    - "delete meeting task"
    """
    result = await process_chat_message(
        message=message.message,
        db=db,
        user_id=message.user_id,
    )
    return ChatResponse(**result)
