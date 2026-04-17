# Algorithm Reflection Questions

## Exercise 3 — Algorithm Deconstruction

---

## Algorithm 1: `task_priority.js`

### How did using AI change your understanding of this algorithm?

Initially I read `calculateTaskScore()` as one large function doing several unrelated things — multiplying a priority weight, then doing date math, then applying penalties. The function felt tangled because the due-date logic was an inline chain of `if/else` inside an outer `if (task.dueDate)` block.

After working through the algorithm with AI prompts, I understood that it is actually a **composite scoring function** — a well-known pattern where a single numeric score is assembled from independent sub-scores. Each block (base priority, due date, status penalty, tag boost, recency boost) is an independent concern. Extracting `getDueDateBonus()` as a helper made this structure visible and made the function's intent immediately clear.

AI also helped me see a subtle invariant: the algorithm assumes `TaskPriority` values are integers (1–4), not strings. The weight lookup `priorityWeights[task.priority]` would silently return `undefined` for an unexpected priority value, falling back to `0 * 10 = 0`. This is a silent failure mode that is easy to miss when reading alone.

### What was still difficult to understand even with AI assistance?

The interaction between the due-date bonus and the status penalty was the hardest part. A task that is `DONE` can still be overdue (e.g., completed late), so it could receive both a `+30` due-date bonus and a `−50` DONE penalty, netting at `−20`. It took time to reason through whether this is intentional — and I concluded it is, because the net negative score ensures done tasks sort to the bottom regardless of their due date.

### How would you explain this algorithm to a junior developer?

Think of it like a sports leaderboard. Every task starts with a base score based on how important it was labelled (1–4 stars). Then the algorithm adds or subtracts points based on three questions: How urgent is the deadline? (closer = more points, already overdue = most points.) Is the task already finished? (subtract a lot if done, subtract a little if in review.) Does the task have a critical label? (add a small bonus.) Sort everyone by total score, highest first — that is your prioritised list.

### What would you improve or refactor?

Two things:

1. **Introduce a weighting constant object** at the top of the file (e.g. `const WEIGHTS = { PRIORITY_MULTIPLIER: 10, TAG_BOOST: 8, ... }`). Magic numbers like `10`, `8`, and `5` are scattered through the scoring logic. Named constants make it obvious what each number represents and make it easy to tune the scoring formula later.

2. **Return `0` explicitly for an unknown priority** rather than relying on `undefined * 10 = 0`. A one-line guard at the top of the scoring block (`if (!priorityWeights[task.priority]) return 0`) would make the fallback intentional and visible.

---

## Algorithm 2: `task_parser.js`

### How did using AI change your understanding of this algorithm?

My first read of `parseTaskFromText()` suggested it was a simple regex-find-and-replace function. AI helped me see it is actually a **pipeline**: the raw text is passed through four sequential extraction stages (priority → tags → dates → title cleanup), with each stage both extracting structured data *and* removing the extracted markers from the title string. The order matters — if you cleaned up the title first, the regex for tags and dates would have nothing to match.

I also learned the name for the pattern used: **natural language parsing with inline marker extraction**, similar to how tools like Todoist or Linear parse shorthand like `!high` or `@tag`.

### What was still difficult to understand even with AI assistance?

The `getNextWeekday()` helper took the most time. The formula `(targetDay + 7 - currentDate.getDay()) % 7` is a classic modular arithmetic trick, but its correctness is not obvious. You have to mentally trace it for edge cases (e.g., asking for "monday" on a Monday) to confirm the `+ 7` prevents a negative modulo. Even after understanding it, I needed to trace through several examples before trusting it.

The second tricky part was why the tag regex iterates using `exec()` with a `while` loop rather than `matchAll()`. This is a legacy JavaScript pattern — `matchAll()` is available in Node.js 12+, which is the minimum version for this project. Using `exec()` with a stateful regex is technically equivalent but less readable to a modern JS developer.

### How would you explain this algorithm to a junior developer?

Imagine scanning a sticky note left on a desk: "Buy milk !high @shopping #friday". The algorithm reads the note and picks it apart marker by marker. Any word starting with `!` is a priority. Any word starting with `@` is a tag. Any word starting with `#` is a date. Everything left over after pulling out those markers becomes the task title. Then it converts each extracted marker into a structured value — `!high` becomes `TaskPriority.HIGH`, `#friday` becomes next Friday's `Date` object. Finally, it builds a real `Task` object from those parts.

### What would you improve or refactor?

Two things:

1. **Replace the `while (exec())` loops with `matchAll()`**. The current loops are a pre-ES2020 pattern. `text.matchAll(/\s@(\w+)/g)` returns an iterator and is clearer about intent. Since the project requires Node.js 12+ and `matchAll` is available from Node 12, this is a safe improvement.

2. **Add a fallback for unrecognised `#date` values**. Currently, if the user types `#2025-13-45` (invalid date), the code silently skips it and `dueDate` remains `null`. A warning log (e.g., `console.warn('Unrecognised date: ' + dateStr)`) would make the parsing failure visible to the user without breaking the operation.

---

## Algorithm 3: `task_list_merge.js`

### How did using AI change your understanding of this algorithm?

I initially thought this was a simple "newer wins" merge — last-write-wins across all fields. AI helped me see it is a **three-way merge strategy** with a special carve-out: the `DONE` status has a permanent victory condition (once a task is done in either source, it stays done in the merged result), regardless of timestamps. This mirrors the approach used by distributed systems like Git — where certain transitions (deletion, completion) are treated as irreversible.

The return structure also took time to understand. `mergeTaskLists()` returns not just the merged result but also four separate diff objects (`toCreateRemote`, `toUpdateRemote`, `toCreateLocal`, `toUpdateLocal`). AI helped me see this as a **change set** pattern — the caller can use these to sync each source without re-running the full merge.

### What was still difficult to understand even with AI assistance?

The tag merge logic was subtler than it appeared. Tags from both sources are unioned with `new Set([...localTask.tags, ...remoteTask.tags])`. This means a tag deleted locally will reappear after a merge if it still exists remotely — because the union operation has no concept of a "deleted" tag, only presence. Resolving intentional tag deletions would require a tombstone mechanism (storing what was deleted, not just what exists), which is a known hard problem in distributed state reconciliation. Understanding *why* this limitation exists — not just *that* it exists — took several iterations with AI.

### How would you explain this algorithm to a junior developer?

Picture two people editing the same task on different devices while offline. When they reconnect, we need to decide which version to keep. The algorithm checks three things: First, does a task exist on only one side? If so, create it on the other side too. Second, if it exists on both sides with different content, whoever saved it most recently wins (except for status — if either side says "done", the task is done, full stop). Third, for tags, keep all tags from both sides — you never delete a tag during a merge.

### What would you improve or refactor?

Two things:

1. **Document the "DONE always wins" rule as a named constant or comment**. The special handling of `TaskStatus.DONE` in `resolveTaskConflict()` is a domain invariant, but it looks like an ordinary `if/else` branch. A comment like `// DONE is a terminal state — once completed anywhere, it cannot be un-done by a merge` would make the intent explicit to future maintainers.

2. **Make tag deletion possible**. The current union of tags means deletions are silently ignored during merges. A practical improvement would be to track deleted tags per-task as a `deletedTags` array (alongside `tags`). During a merge, any tag in the remote's `deletedTags` would be removed from the merged tag list, even if it appears in the local `tags`. This is the standard CRDT approach to set deletions.
