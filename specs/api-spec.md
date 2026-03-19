# API Specification — AI Task Manager Backend

**Base URL:** `http://127.0.0.1:8000`
**Interactive Docs:** `http://127.0.0.1:8000/docs`
**All task endpoints prefixed with:** `/api`

---

## Tasks

### List Tasks
```
GET /api/tasks/
```
**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter: pending, in_progress, completed |
| priority | string | Filter: low, medium, high, urgent |
| category | string | Filter by category name |
| search | string | Search in title, description, tags |
| skip | int | Pagination offset (default: 0) |
| limit | int | Max results (default: 100, max: 500) |

**Response:** `200 OK` — Array of Task objects

---

### Create Task
```
POST /api/tasks/
```
**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "status": "pending",
  "category": "Personal",
  "tags": ["shopping", "errands"],
  "due_date": "2024-12-31T18:00:00Z"
}
```
**Response:** `201 Created` — Task object

---

### Get Task
```
GET /api/tasks/{task_id}
```
**Response:** `200 OK` — Task object | `404 Not Found`

---

### Update Task
```
PUT /api/tasks/{task_id}
```
**Request Body:** Any subset of Task fields (all optional)
**Response:** `200 OK` — Updated Task object | `404 Not Found`

---

### Complete Task
```
PATCH /api/tasks/{task_id}/complete
```
**Response:** `200 OK` — Task with status=completed and completed_at timestamp

---

### Delete Task
```
DELETE /api/tasks/{task_id}
```
**Response:** `204 No Content` | `404 Not Found`

---

## Chatbot

### Send Message
```
POST /api/chat/
```
**Request Body:**
```json
{
  "message": "add buy milk tomorrow",
  "user_id": "demo_user"
}
```
**Response:**
```json
{
  "reply": "✅ Task created: **Buy Milk** (due Dec 20) — Priority: Medium",
  "action": "task_created",
  "task": { ... },
  "tasks": null,
  "mode": "fallback"
}
```

**Supported Commands (rule-based fallback):**
| Command Pattern | Action |
|----------------|--------|
| `add [title] [tomorrow/today]` | Create task |
| `create [title]` | Create task |
| `show pending` | List pending tasks |
| `show all tasks` | List all tasks |
| `show completed` | List completed tasks |
| `complete [name]` | Mark task complete |
| `delete [name]` | Delete task |
| `what should I do today?` | Smart suggestions |
| `show overdue` | List overdue tasks |
| `stats` | Productivity summary |
| `help` | Command list |

---

## Statistics

### Dashboard Stats
```
GET /api/stats/dashboard
```
**Response:**
```json
{
  "total_tasks": 24,
  "completed_tasks": 18,
  "pending_tasks": 5,
  "in_progress_tasks": 1,
  "overdue_tasks": 2,
  "completion_rate": 75.0,
  "tasks_by_priority": { "high": 3, "medium": 8, "low": 5 },
  "tasks_by_category": { "Work": 10, "Personal": 6 },
  "recent_completions": 7
}
```

### Smart Suggestions
```
GET /api/stats/suggestions
```
**Response:** Array of suggestion objects
```json
[
  {
    "type": "overdue",
    "title": "⚠️ 2 Overdue Tasks",
    "message": "You have 2 overdue tasks. Address them immediately.",
    "tasks": [...]
  }
]
```

---

## History

### Get Activity Log
```
GET /api/history/
```
**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| skip | int | Offset (default: 0) |
| limit | int | Max entries (default: 50, max: 200) |

**Response:** Array of ActivityLog objects
```json
[
  {
    "id": 42,
    "action": "completed",
    "task_id": 7,
    "task_title": "Buy groceries",
    "details": "Task 'Buy groceries' was completed",
    "user_id": "demo_user",
    "created_at": "2024-12-19T10:30:00"
  }
]
```

---

## Data Models

### Task Object
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "status": "pending",
  "category": "Personal",
  "tags": ["shopping"],
  "due_date": "2024-12-31T18:00:00",
  "created_at": "2024-12-19T09:00:00",
  "updated_at": "2024-12-19T09:00:00",
  "completed_at": null,
  "user_id": "demo_user"
}
```

### Priority Values
`low` | `medium` | `high` | `urgent`

### Status Values
`pending` | `in_progress` | `completed`

### Action Values
`created` | `updated` | `deleted` | `completed`
