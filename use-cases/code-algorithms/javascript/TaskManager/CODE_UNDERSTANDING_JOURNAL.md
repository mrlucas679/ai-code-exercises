# Code Understanding Journal

## Exercise 2 — Codebase Exploration Challenge

---

## How Task Creation and Status Updates Work

### Task Creation

Task creation starts in `cli.js`. When the user runs `node cli.js create "Buy milk" -p 3 -u 2025-05-01`, the `commander` library parses the arguments and calls `taskManager.createTask(title, description, priority, dueDate, tags)`.

Inside `TaskManager.createTask()` (`taskManager.js:11`), three things happen before the task is persisted:

1. **Date validation** — if a due date string was provided, it is parsed with `new Date()`. If the result is `NaN`, the method logs an error and returns `null` early. This is the only input validation in the creation path.
2. **Task construction** — a `new Task(...)` is created (`models.js:20`). The constructor auto-assigns a UUID via `uuidv4()`, sets `status` to `TaskStatus.TODO`, sets `createdAt` and `updatedAt` to `new Date()`, and initialises `completedAt` to `null`.
3. **Persistence** — `storage.addTask(task)` stores the task object in an in-memory map keyed by `task.id`, then immediately calls `save()` to write `tasks.json` to disk. It returns the new task's ID.

The `TaskManager` method returns that ID to `cli.js`, which prints `Created task with ID: <id>`.

### Status Updates

Status updates use a slightly different path depending on the target status.

For any status other than `DONE`, `updateTaskStatus()` (`taskManager.js:49`) calls `storage.updateTask(taskId, { status: newStatusValue })` directly. `TaskStorage.updateTask()` fetches the task by ID, calls `task.update({ status })`, saves to disk, and returns `true`.

For the `DONE` status specifically, the method first retrieves the full task object and calls `task.markAsDone()` (`models.js:43`). This sets `status`, records `completedAt = new Date()`, and syncs `updatedAt`. Then `storage.save()` is called manually. The reason for this special path is that `markAsDone()` needs to set `completedAt` — a field that is not set when using the generic `update()` path.

---

## How the Task Prioritisation System Works

Prioritisation is handled by the standalone `task_priority.js` module. It is not imported by `taskManager.js`; it is a separate algorithmic module.

### Priority Scores

`calculateTaskScore(task)` (`task_priority.js:20`) computes a numeric score for any task. The score is the sum of several weighted factors:

| Factor | Logic | Score impact |
|---|---|---|
| Base priority | `priorityWeights[task.priority] * 10` | LOW=10, MEDIUM=20, HIGH=30, URGENT=40 |
| Due date proximity | `getDueDateBonus(daysUntilDue)` | Overdue=+30, today=+20, ≤2 days=+15, ≤7 days=+10, otherwise=0 |
| Status penalty | DONE tasks are deprioritised | DONE=−50, REVIEW=−15 |
| Tag boost | Tags "blocker", "critical", or "urgent" | +8 |
| Recent activity | Updated within the last day | +5 |

`getDueDateBonus()` (`task_priority.js:7`) is a pure helper extracted from `calculateTaskScore` to isolate the due-date logic and make the guard clauses readable.

### Sorting and Selection

`sortTasksByImportance(tasks)` (`task_priority.js:67`) takes an array of tasks, creates a copy with the spread operator to avoid mutating the original, and sorts descending by score: `calculateTaskScore(b) - calculateTaskScore(a)`.

`getTopPriorityTasks(tasks, limit = 5)` (`task_priority.js:80`) is a thin wrapper that sorts then slices to the requested limit.

The numeric representation of `TaskPriority` (LOW=1, MEDIUM=2, HIGH=3, URGENT=4) is what makes the weight lookup table work — the values map directly to priority weight multipliers.

---

## Data Flow When a Task Is Marked Complete

This is the most layered operation in the application. Here is the exact sequence when a user runs `node cli.js status <id> done`:

1. **`cli.js` (presentation layer)** — `commander` matches the `status` command, extracts `taskId` and `status = "done"`, and calls `taskManager.updateTaskStatus(taskId, 'done')`.

2. **`taskManager.js` (business logic layer)** — `updateTaskStatus()` detects `newStatusValue === TaskStatus.DONE` (`'done'`). It calls `this.storage.getTask(taskId)` to retrieve the live task object from the in-memory map.

3. **`models.js` (domain layer)** — `task.markAsDone()` is called on the retrieved object. The method sets:
   - `this.status = TaskStatus.DONE`
   - `this.completedAt = new Date()`
   - `this.updatedAt = this.completedAt`

   The object is modified in-place. Because `TaskStorage` holds a reference to this same object in its `this.tasks` map, the change is immediately visible to the storage layer without any explicit write-back.

4. **`storage.js` (persistence layer)** — `taskManager.js` calls `this.storage.save()`. `TaskStorage.save()` converts `this.tasks` (the in-memory map) to an array with `Object.values()` and writes it to `tasks.json` using `fs.writeFileSync`.

5. **`cli.js` (presentation layer again)** — `updateTaskStatus` returns `true`, and `cli.js` prints `Updated task status to done`.

The key architectural insight in this flow is that `TaskStorage` holds live object references — not plain data copies. This means a change made via `task.markAsDone()` is automatically reflected in the storage layer's in-memory state without needing to call `updateTask()`. A separate `save()` call is still required to persist to disk.
