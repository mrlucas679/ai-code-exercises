# Task Management Algorithms

This directory contains implementations of core task management algorithms in multiple programming languages (Java, JavaScript, and Python). The implementations showcase key algorithmic concepts in task management systems.

## Core Algorithms

### 1. Task Priority Scoring
Calculates a priority score for tasks based on multiple factors:
- Base priority level (LOW, MEDIUM, HIGH, URGENT)
- Due date proximity
- Overdue status

### 2. Task Text Parsing
Parses free-form text to extract task properties using a simple markup language:
- `@tag` - Adds a tag to the task
- `!priority` - Sets task priority (1-4 or low/medium/high/urgent)
- `#date` - Sets due date
- Remaining text becomes the task title

Example:
```
"Finish report for client XYZ !urgent #friday #work @project"
```

### 3. Task List Merging
Implements a merge algorithm for synchronizing task lists between local and remote sources:
- Conflict resolution based on last modified timestamp
- Tracks changes needed in both local and remote sources
- Maintains data consistency

## Language-Specific Implementations

### Java
- Strongly typed implementation with clear class structure
- Uses enums for priority levels
- Implements cloneable pattern for task copying
- File: `TaskPriorityManager.java`

### JavaScript
- Functional approach to algorithms
- Flexible object structure
- File: `taskAlgorithms.js`

### Python
- Pythonic implementation of algorithms
- Simplified data structures
- File: `task_algorithms.py`

## Core Classes/Types

### Task
Properties:
- title: String
- priority: TaskPriority
- dueDate: DateTime
- tags: Set<String>
- lastModified: DateTime

### MergeResult
Contains:
- mergedTasks: Combined task list
- toCreateRemote: Tasks to create in remote
- toUpdateRemote: Tasks to update in remote
- toCreateLocal: Tasks to create locally
- toUpdateLocal: Tasks to update locally

## Algorithm Details

### Priority Scoring Formula
```
Base Score = Priority Weight * 10
Due Date Modifiers:
- Overdue: +30 points
- Due Today: +20 points
- Due within week: +10 points
```

### Merge Resolution Rules
1. Task exists in both sources:
   - Most recent modification wins
   - Update older version
2. Task exists only locally:
   - Create in remote
3. Task exists only remotely:
   - Create locally

## Usage Examples

### Task Parsing
```
Input: "Buy milk @shopping !2 #tomorrow"
Output: Task {
    title: "Buy milk",
    priority: MEDIUM,
    tags: ["shopping"],
    dueDate: <tomorrow's date>
}
```

### Priority Calculation
```
Task: {
    priority: HIGH,
    dueDate: <today>
}
Score = (3 * 10) + 20 = 50
```

## Implementation Notes
- Date handling is simplified for demonstration
- Error handling varies by language
- Actual database integration is not included

