# Feature List — AI Task Manager Assistant

## Core Features

### Authentication
- [x] Login page with email/password
- [x] Demo credentials pre-filled
- [x] Protected dashboard route (redirects to login if not authenticated)
- [x] Persistent session via localStorage
- [x] Logout functionality in sidebar

### Task Management
- [x] Create task (title, description, priority, status, category, tags, due date)
- [x] Edit task (full field editing via modal form)
- [x] Delete task (with confirmation)
- [x] Mark task complete (toggle with visual feedback)
- [x] Priority levels: Low, Medium, High, Urgent
- [x] Status tracking: Pending, In Progress, Completed
- [x] Category assignment (free text)
- [x] Tags (up to 5, displayed as pills)
- [x] Due date with datetime picker
- [x] Search tasks (by title, description, tags)
- [x] Filter by status (tab-based UI)
- [x] Filter by priority (dropdown)
- [x] Filter by category

### AI Chatbot Panel
- [x] Persistent chat interface in dashboard
- [x] Collapsible panel
- [x] OpenAI GPT integration (when API key present)
- [x] Smart rule-based fallback (always works without API key)
- [x] Example quick-commands bar (clickable)
- [x] Markdown rendering in chat messages
- [x] Chatbot commands:
  - `add [task] [tomorrow/today]` — create task
  - `show pending` — list pending tasks
  - `show all tasks` — list all tasks
  - `complete [task name]` — mark task done
  - `delete [task name]` — delete task
  - `what should I do today?` — smart suggestions
  - `show overdue` — overdue tasks
  - `stats` — productivity summary
  - `help` — command list
- [x] Task changes via chatbot refresh the dashboard

### Smart Suggestions
- [x] Overdue task warnings
- [x] Due-today alerts
- [x] High priority task highlights
- [x] Productivity summary (completion rate)
- [x] "Recommended next task" when nothing urgent
- [x] All-clear message when no suggestions needed

### Dashboard
- [x] Total tasks count
- [x] Completed tasks count
- [x] Pending tasks count
- [x] Overdue tasks count
- [x] Completion rate percentage with progress bar
- [x] Weekly completions count
- [x] Tasks by priority breakdown (badges)
- [x] Pending tasks preview list
- [x] Quick "Add Task" shortcut

### Activity History
- [x] All create/update/delete/complete events logged
- [x] Timeline view (newest first)
- [x] Action summary cards (created/completed/updated/deleted counts)
- [x] Clickable filter by action type
- [x] Relative time display ("2 minutes ago")
- [x] Configurable limit (20, 50, 100, 200 events)

### Backend API
- [x] `GET /api/tasks/` — list with filters
- [x] `POST /api/tasks/` — create task
- [x] `GET /api/tasks/{id}` — get single task
- [x] `PUT /api/tasks/{id}` — update task
- [x] `PATCH /api/tasks/{id}/complete` — mark complete
- [x] `DELETE /api/tasks/{id}` — delete task
- [x] `POST /api/chat/` — process chat message
- [x] `GET /api/stats/dashboard` — dashboard stats
- [x] `GET /api/stats/suggestions` — smart suggestions
- [x] `GET /api/history/` — activity log
- [x] Interactive API docs at `/docs`

### UI/UX
- [x] Professional dark theme (near-black background, indigo accent)
- [x] Left sidebar with collapsible state
- [x] Sticky top header with live clock and API status indicator
- [x] Responsive layout (mobile + desktop)
- [x] Smooth animations (fade-in, slide-up)
- [x] Loading skeletons
- [x] Error state handling with clear messages
- [x] Custom scrollbar styling
- [x] Hover card effects
- [x] Priority color coding throughout

## Future Improvements
- [ ] Real authentication (NextAuth.js / Clerk)
- [ ] PostgreSQL database
- [ ] Task recurring/repeat functionality
- [ ] Drag-and-drop task reordering
- [ ] Kanban board view
- [ ] Email reminders for overdue tasks
- [ ] Multi-user support
- [ ] Export tasks to CSV/PDF
- [ ] Dark/light theme toggle
- [ ] Mobile app (React Native)
- [ ] Real-time updates via WebSockets
- [ ] Task comments/notes
- [ ] File attachments
- [ ] Integrations (Google Calendar, Slack)
