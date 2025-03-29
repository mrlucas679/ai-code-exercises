# Task Manager Implementation Study

This directory contains implementations of a task management system in three different programming languages (Java, JavaScript, and Python). The code demonstrates various programming concepts and patterns while maintaining similar functionality across all implementations.

## Application Structure

Each implementation follows a similar structure:

```
language/
├── app/        # Core application logic
├── cli/        # Command-line interface
├── models/     # Data models
└── storage/    # Data persistence
```

## Core Features

### Task Management
- Create new tasks with title, description, priority, due date, and tags
- List tasks with various filters (status, priority, overdue)
- Update task properties (status, priority, due date)
- Delete tasks
- Tag management (add/remove tags)

### Task Properties
- Title and description
- Priority levels (1-4)
- Status (TODO, IN_PROGRESS, DONE)
- Due date
- Tags
- Completion tracking

### Statistics
- Total task count
- Tasks by status
- Tasks by priority
- Overdue tasks
- Recently completed tasks

## Language-Specific Implementations

### Java Implementation
- Strong type system with enums for status and priority
- Object-oriented design with clear class hierarchy
- Immutable objects where appropriate
- Date handling with java.time package

### JavaScript Implementation
- Class-based design
- ES6+ features
- JSON-based storage
- Date handling with native Date object

### Python Implementation
- Pythonic code style
- Enum-based status and priority
- Type hints (optional)
- DateTime for temporal operations

## Common Design Patterns

### Storage Abstraction
All implementations use a storage class that:
- Handles data persistence
- Provides CRUD operations
- Manages task collections
- Implements filtering capabilities

### Task States
```
States:
- TODO: Initial state
- IN_PROGRESS: Active tasks
- DONE: Completed tasks

Priorities:
1: Low
2: Medium
3: High
4: Urgent
```

### Error Handling
- Input validation
- Date format checking
- Storage operation error handling
- Status and priority validation

## Code Organization

### Models
- Task: Core data structure
- TaskStatus: Status enumeration
- TaskPriority: Priority enumeration

### Application Logic
- TaskManager: Main application class
- Task creation and management
- Filter implementations
- Statistics calculation

### Storage Layer
- File-based persistence
- Task retrieval and updates
- Query operations
- Data consistency

## Usage Examples

### Creating a Task
```python
# Python example
manager.create_task(
    title="Complete project",
    priority_value=3,
    due_date_str="2024-01-01",
    tags=["work", "important"]
)
```

### Updating Task Status
```java
// Java example
manager.updateTaskStatus(taskId, "IN_PROGRESS");
```

### Getting Statistics
```javascript
// JavaScript example
const stats = manager.getStatistics();
console.log(`Total tasks: ${stats.total}`);
```

## Implementation Comparison

### Type Safety
- Java: Compile-time type checking
- TypeScript/JavaScript: Runtime type checking
- Python: Dynamic typing with optional hints

### Data Structures
- Java: ArrayList, HashMap
- JavaScript: Arrays, Objects
- Python: Lists, Dictionaries

### Date Handling
- Java: LocalDateTime
- JavaScript: Date
- Python: datetime

## Notes
- Error handling approaches vary by language
- Storage implementations are simplified
- Date handling formats are standardized
- Statistics calculation is consistent across implementations

