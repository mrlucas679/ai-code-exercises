# Submission: Using AI to Comprehend Existing Codebases

## Initial vs. Final Understanding of the Task Manager Codebase

### Initial Understanding

When first approaching the Task Manager codebase, my initial understanding was limited to the surface level. I could see it was a CLI application that managed tasks, and that it used Node.js. I identified `cli.js` as the entry point and could see there were separate files for models, storage, and the main application logic. However, I was unclear on how all the pieces connected — specifically how data flowed from the CLI command down to the file system, and how the algorithm modules (task_priority, task_parser, task_list_merge) related to the rest of the app.

### Final Understanding

After applying the AI comprehension prompts, my understanding deepened significantly:

- **Entry point**: `cli.js` parses CLI commands using the `commander` library and delegates to `TaskManager`
- **Business logic layer**: `taskManager.js` (formerly `app.js`) contains all business rules — validation, status transitions, and the new auto-abandon rule
- **Persistence layer**: `storage.js` implements the Repository pattern, abstracting all file I/O behind a consistent interface
- **Domain model**: `models.js` defines `Task`, `TaskPriority`, and `TaskStatus` — the core entities of the system
- **Algorithm modules**: `task_priority.js`, `task_parser.js`, and `task_list_merge.js` are standalone modules used for sorting, parsing, and merging tasks

## Most Valuable Insights from Each Prompt

### Prompt 1 — Project Structure
The most valuable insight was identifying the Repository pattern in `storage.js`. Before using this prompt, I saw it as just a file-reading utility. Understanding it as a pattern helped me see why the rest of the app never reads `tasks.json` directly — all persistence is abstracted behind `TaskStorage`.

### Prompt 2 — Finding Feature Implementation
When exploring where to add the auto-abandon business rule, the prompt helped me trace that it belongs in `taskManager.js` (business logic layer), not in `models.js` (domain layer) or `storage.js` (persistence layer). This distinction between layers was the key insight.

### Prompt 3 — Domain Model
Understanding that `TaskPriority` uses numeric values (1-4) while `TaskStatus` uses string values was a subtle but important domain detail. It affects how filtering and comparisons work throughout the app — for example, `priority >= TaskPriority.HIGH` works because priorities are numbers.

## Approach to Implementing the New Business Rule

The business rule was: *"Tasks overdue for more than 7 days should be automatically marked as abandoned unless they are marked as high priority."*

Files modified:
1. **models.js** — Added `ABANDONED` status to `TaskStatus` and a `markAsAbandoned()` method to the `Task` class
2. **taskManager.js** — Added `autoAbandonOverdueTasks()` method that checks all tasks and abandons eligible ones
3. **cli.js** — Added `[✗]` symbol for abandoned status in `formatTask`
4. **tests/taskManager.test.js** — Added three tests covering low/medium priority tasks, high priority tasks, and recently overdue tasks

The key decision was to check `priority >= TaskPriority.HIGH` rather than `=== TaskPriority.HIGH`, so that both HIGH (3) and URGENT (4) tasks are protected from auto-abandonment.

## Strategies for Approaching Unfamiliar Code

1. **Start with the entry point** — Find where execution begins (`cli.js`) and trace outward rather than trying to read every file
2. **Identify the layers** — Most applications have a presentation layer, business logic layer, and data layer. Locating these quickly creates a mental map
3. **Use the domain model as an anchor** — Understanding the core entities (`Task`, `TaskStatus`, `TaskPriority`) first makes all other code easier to interpret
4. **Read tests before source code** — Test files describe expected behaviour in plain language and reveal how functions are supposed to be used
5. **Ask AI to validate your understanding** — Rather than asking AI to explain everything, share your current understanding first and ask it to correct misconceptions
