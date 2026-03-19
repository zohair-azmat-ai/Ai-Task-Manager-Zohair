"""
AI Service — handles chatbot logic.
Tries OpenAI GPT if API key is set, otherwise uses smart rule-based fallback.
"""

import os
import re
from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


def _parse_date_hint(text: str) -> Optional[datetime]:
    """Parse natural date hints from text."""
    text_lower = text.lower()
    now = datetime.now(timezone.utc)

    if "tomorrow" in text_lower:
        return now + timedelta(days=1)
    if "today" in text_lower:
        return now
    if "next week" in text_lower:
        return now + timedelta(weeks=1)
    if "monday" in text_lower:
        days_ahead = 0 - now.weekday()
        if days_ahead <= 0:
            days_ahead += 7
        return now + timedelta(days=days_ahead)

    # Try to match dd/mm or mm/dd patterns
    date_match = re.search(r"\b(\d{1,2})[/\-](\d{1,2})\b", text_lower)
    if date_match:
        try:
            month, day = int(date_match.group(1)), int(date_match.group(2))
            return now.replace(month=month, day=day, hour=23, minute=59, second=0)
        except Exception:
            pass

    return None


def _extract_task_title(message: str, command: str) -> str:
    """Extract task title from a command message."""
    # Remove the command keyword and cleanup
    text = message.lower()
    for keyword in [command, "task", "please", "can you", "could you"]:
        text = text.replace(keyword, "")

    # Remove date hints
    for hint in ["tomorrow", "today", "next week", "monday", "tuesday", "wednesday", "thursday", "friday"]:
        text = text.replace(hint, "")

    # Clean up date patterns
    text = re.sub(r"\b\d{1,2}[/\-]\d{1,2}\b", "", text)
    return text.strip().strip(",.-").title() or "New Task"


def rule_based_response(message: str, db: Session, user_id: str = "demo_user") -> dict:
    """
    Smart rule-based chatbot fallback.
    Parses natural language commands to perform task operations.
    """
    from app.services import task_service
    from app.schemas import TaskCreate, TaskUpdate, StatusEnum, PriorityEnum

    msg = message.strip().lower()

    # ─── ADD TASK ────────────────────────────────────────────────────────────
    add_patterns = ["add ", "create ", "new task ", "add task ", "create task ", "remind me to ", "i need to "]
    for pat in add_patterns:
        if msg.startswith(pat):
            raw_title = message[len(pat):].strip()
            due = _parse_date_hint(raw_title)
            # Remove date hint from title
            for hint in ["tomorrow", "today", "next week"]:
                raw_title = re.sub(hint, "", raw_title, flags=re.IGNORECASE).strip()

            # Detect priority from message
            priority = PriorityEnum.MEDIUM
            if any(w in msg for w in ["urgent", "asap", "critical", "immediately"]):
                priority = PriorityEnum.URGENT
            elif any(w in msg for w in ["high priority", "important"]):
                priority = PriorityEnum.HIGH
            elif "low priority" in msg:
                priority = PriorityEnum.LOW

            task_data = TaskCreate(
                title=raw_title.strip().strip(",.-") or "New Task",
                priority=priority,
                due_date=due,
            )
            task = task_service.create_task(db, task_data, user_id)
            due_str = f" (due {due.strftime('%b %d')})" if due else ""
            return {
                "reply": f"✅ Task created: **{task.title}**{due_str} — Priority: {task.priority.capitalize()}",
                "action": "task_created",
                "task": task.to_dict(),
                "mode": "fallback",
            }

    # ─── SHOW TASKS ──────────────────────────────────────────────────────────
    if any(p in msg for p in ["show pending", "list pending", "pending tasks", "what's pending"]):
        tasks = task_service.get_tasks(db, user_id, status="pending")
        if not tasks:
            return {"reply": "🎉 No pending tasks — you're all caught up!", "action": "list_tasks", "tasks": [], "mode": "fallback"}
        task_list = "\n".join([f"• [{t.priority.upper()}] {t.title}" for t in tasks[:10]])
        return {
            "reply": f"📋 **Pending Tasks** ({len(tasks)} total):\n{task_list}",
            "action": "list_tasks",
            "tasks": [t.to_dict() for t in tasks],
            "mode": "fallback",
        }

    if any(p in msg for p in ["show all", "list all", "all tasks", "show tasks", "list tasks"]):
        tasks = task_service.get_tasks(db, user_id)
        if not tasks:
            return {"reply": "📭 No tasks yet. Add one by typing: **add buy milk tomorrow**", "action": "list_tasks", "tasks": [], "mode": "fallback"}
        task_list = "\n".join([f"• [{t.status.upper()}] {t.title}" for t in tasks[:10]])
        return {
            "reply": f"📋 **All Tasks** ({len(tasks)} total):\n{task_list}",
            "action": "list_tasks",
            "tasks": [t.to_dict() for t in tasks],
            "mode": "fallback",
        }

    if any(p in msg for p in ["show completed", "list completed", "completed tasks", "done tasks"]):
        tasks = task_service.get_tasks(db, user_id, status="completed")
        if not tasks:
            return {"reply": "No completed tasks yet. Keep going!", "action": "list_tasks", "tasks": [], "mode": "fallback"}
        task_list = "\n".join([f"• ✅ {t.title}" for t in tasks[:10]])
        return {
            "reply": f"✅ **Completed Tasks** ({len(tasks)}):\n{task_list}",
            "action": "list_tasks",
            "tasks": [t.to_dict() for t in tasks],
            "mode": "fallback",
        }

    # ─── COMPLETE TASK ────────────────────────────────────────────────────────
    complete_patterns = ["complete ", "mark done ", "finish ", "done with ", "completed "]
    for pat in complete_patterns:
        if msg.startswith(pat):
            search_term = message[len(pat):].strip()
            tasks = task_service.get_tasks(db, user_id, search=search_term)
            pending = [t for t in tasks if t.status != "completed"]
            if not pending:
                return {"reply": f"❓ No pending task found matching **'{search_term}'**.", "action": "not_found", "mode": "fallback"}
            task = pending[0]
            updated = task_service.update_task(db, task.id, TaskUpdate(status=StatusEnum.COMPLETED), user_id)
            return {
                "reply": f"✅ Marked as complete: **{updated.title}**",
                "action": "task_completed",
                "task": updated.to_dict(),
                "mode": "fallback",
            }

    # ─── DELETE TASK ──────────────────────────────────────────────────────────
    delete_patterns = ["delete ", "remove ", "cancel task ", "delete task ", "remove task "]
    for pat in delete_patterns:
        if msg.startswith(pat):
            search_term = message[len(pat):].strip()
            tasks = task_service.get_tasks(db, user_id, search=search_term)
            if not tasks:
                return {"reply": f"❓ No task found matching **'{search_term}'**.", "action": "not_found", "mode": "fallback"}
            task = tasks[0]
            title = task.title
            task_service.delete_task(db, task.id, user_id)
            return {
                "reply": f"🗑️ Deleted task: **{title}**",
                "action": "task_deleted",
                "mode": "fallback",
            }

    # ─── TODAY'S SUGGESTIONS ──────────────────────────────────────────────────
    if any(p in msg for p in ["what should i do", "today's tasks", "suggest", "what to do", "plan today", "my schedule"]):
        from datetime import timezone
        now = datetime.now(timezone.utc)
        today_end = now.replace(hour=23, minute=59, second=59)

        overdue = task_service.get_overdue_tasks(db, user_id)
        all_tasks = task_service.get_tasks(db, user_id, status="pending")

        high_priority = [t for t in all_tasks if t.priority in ("high", "urgent")]
        today_due = [t for t in all_tasks if t.due_date and t.due_date <= today_end]

        reply_parts = ["📌 **Here's what I suggest for today:**\n"]
        if overdue:
            reply_parts.append(f"🔴 **Overdue ({len(overdue)}):** {', '.join([t.title for t in overdue[:3]])}")
        if today_due:
            reply_parts.append(f"📅 **Due Today ({len(today_due)}):** {', '.join([t.title for t in today_due[:3]])}")
        if high_priority:
            reply_parts.append(f"⚡ **High Priority:** {', '.join([t.title for t in high_priority[:3]])}")
        if not overdue and not today_due and not high_priority:
            reply_parts.append("✨ You have no urgent tasks. Great time to tackle something new!")

        return {
            "reply": "\n".join(reply_parts),
            "action": "suggestions",
            "tasks": [t.to_dict() for t in (overdue + today_due + high_priority)[:5]],
            "mode": "fallback",
        }

    # ─── OVERDUE CHECK ────────────────────────────────────────────────────────
    if any(p in msg for p in ["overdue", "late tasks", "missed", "behind"]):
        tasks = task_service.get_overdue_tasks(db, user_id)
        if not tasks:
            return {"reply": "✅ No overdue tasks! You're on top of things.", "action": "list_tasks", "tasks": [], "mode": "fallback"}
        task_list = "\n".join([f"• 🔴 {t.title} (due {t.due_date.strftime('%b %d') if t.due_date else 'N/A'})" for t in tasks])
        return {
            "reply": f"⚠️ **Overdue Tasks** ({len(tasks)}):\n{task_list}",
            "action": "list_tasks",
            "tasks": [t.to_dict() for t in tasks],
            "mode": "fallback",
        }

    # ─── STATS ────────────────────────────────────────────────────────────────
    if any(p in msg for p in ["stats", "summary", "progress", "how am i doing", "productivity"]):
        all_tasks = task_service.get_tasks(db, user_id)
        total = len(all_tasks)
        completed = len([t for t in all_tasks if t.status == "completed"])
        pending = len([t for t in all_tasks if t.status == "pending"])
        rate = round((completed / total * 100), 1) if total > 0 else 0
        return {
            "reply": f"📊 **Your Productivity Summary:**\n• Total: {total} tasks\n• ✅ Completed: {completed}\n• ⏳ Pending: {pending}\n• 🏆 Completion rate: {rate}%",
            "action": "stats",
            "mode": "fallback",
        }

    # ─── HELP ────────────────────────────────────────────────────────────────
    if any(p in msg for p in ["help", "commands", "what can you do", "how to", "?"]):
        return {
            "reply": (
                "🤖 **AI Task Assistant — Available Commands:**\n\n"
                "**Add Tasks:**\n"
                "• `add buy milk tomorrow`\n"
                "• `create finish report by friday`\n\n"
                "**View Tasks:**\n"
                "• `show pending tasks`\n"
                "• `show all tasks`\n"
                "• `show completed`\n\n"
                "**Manage Tasks:**\n"
                "• `complete gym` — mark task done\n"
                "• `delete meeting task`\n\n"
                "**Smart Suggestions:**\n"
                "• `what should I do today?`\n"
                "• `show overdue tasks`\n"
                "• `stats` — productivity summary"
            ),
            "action": "help",
            "mode": "fallback",
        }

    # ─── FALLBACK RESPONSE ────────────────────────────────────────────────────
    return {
        "reply": (
            "🤔 I didn't quite understand that. Here are some things I can do:\n\n"
            "• `add [task name]` — create a task\n"
            "• `show pending` — list pending tasks\n"
            "• `complete [task name]` — mark complete\n"
            "• `what should I do today?` — smart suggestions\n"
            "• `help` — see all commands"
        ),
        "action": "unknown",
        "mode": "fallback",
    }


async def openai_response(message: str, db: Session, user_id: str = "demo_user") -> dict:
    """
    Uses OpenAI GPT to interpret and execute task commands.
    Falls back to rule_based_response if API call fails.
    """
    try:
        from openai import AsyncOpenAI
        from app.services import task_service

        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        all_tasks = task_service.get_tasks(db, user_id)
        tasks_context = "\n".join([
            f"- ID:{t.id} | {t.title} | {t.status} | {t.priority} priority"
            for t in all_tasks[:20]
        ])

        system_prompt = f"""You are an intelligent task management assistant called TaskAI.
The user can ask you to create, complete, delete, or list tasks.

Current tasks in the system:
{tasks_context or "No tasks yet."}

When the user wants to:
- CREATE a task: extract title, priority (low/medium/high/urgent), and due date if mentioned
- COMPLETE a task: identify which task by name matching
- DELETE a task: identify which task by name
- LIST tasks: filter by status/priority as requested
- GET SUGGESTIONS: analyze tasks and provide smart recommendations

Respond in a helpful, concise way. Use markdown for formatting.
Be conversational but efficient."""

        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            max_tokens=500,
            temperature=0.7,
        )

        reply = response.choices[0].message.content

        # Still try to execute rule-based actions for the response
        rule_result = rule_based_response(message, db, user_id)
        return {
            "reply": reply,
            "action": rule_result.get("action", "chat"),
            "task": rule_result.get("task"),
            "tasks": rule_result.get("tasks"),
            "mode": "openai",
        }

    except Exception as e:
        # Gracefully fall back to rule-based if OpenAI fails
        result = rule_based_response(message, db, user_id)
        result["reply"] = f"{result['reply']}\n\n*[OpenAI fallback: {str(e)[:50]}]*"
        return result


async def process_chat_message(message: str, db: Session, user_id: str = "demo_user") -> dict:
    """Main entry point — routes to OpenAI or fallback based on API key availability."""
    if OPENAI_API_KEY and OPENAI_API_KEY != "sk-your-key-here":
        return await openai_response(message, db, user_id)
    return rule_based_response(message, db, user_id)
