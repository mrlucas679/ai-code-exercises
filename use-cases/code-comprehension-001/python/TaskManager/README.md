# Task Management System: A Command-Line Task Organizer with Priority and Status Tracking

A Python-based task management system that helps users organize and track tasks through a command-line interface. The system provides comprehensive task management features including priority levels, status tracking, due dates, and statistical insights about task completion and overdue status.

The system is designed to help users maintain organized task lists with rich metadata and tracking capabilities. It supports multiple task states, priority levels, and tagging for better organization. The system persists task data to JSON storage, making it reliable and maintainable across sessions.

Key features include:
- Task creation with title, description, priority, and due dates
- Status tracking (todo, in progress, review, done)
- Priority levels (low, medium, high, urgent)
- Task tagging system for better organization
- Statistical insights about task completion and status
- Overdue task tracking
- JSON-based persistent storage

## Repository Structure
```
.
├── cli.py                 # Command-line interface implementation
├── models.py             # Core data models for Task, TaskStatus, and TaskPriority
├── storage.py           # JSON storage implementation with custom encoders/decoders
├── task_manager.py      # Core business logic for task management
└── tests               # Test suite directory
    ├── __init__.py
    └── test_task_manager.py  # Comprehensive test coverage for TaskManager
```

## Usage Instructions
### Prerequisites
- Python 3.11 or higher
- No additional external dependencies required

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. No additional installation steps required as the project uses Python standard library.

### Run the CLI

The CLI provides various commands to manage tasks:

1. Create a new task:
```bash
python cli.py create "Task Title" --description "Task description" --priority 2 --due "2024-01-31" --tags "tag1,tag2"
```

2. List tasks:
```bash
# List all tasks
python cli.py list

# List by status (todo, in_progress, review, done)
python cli.py list --status todo

# List by priority (1=LOW, 2=MEDIUM, 3=HIGH, 4=URGENT)
python cli.py list --priority 3

# List overdue tasks
python cli.py list --overdue
```

3. Update tasks:
```bash
# Update task status
python cli.py update-status <task_id> <new_status>

# Update task priority
python cli.py update-priority <task_id> <new_priority>

# Update due date
python cli.py update-due-date <task_id> "2024-02-15"
```

4. Manage tags:
```bash
# Add a tag
python cli.py add-tag <task_id> "new-tag"

# Remove a tag
python cli.py remove-tag <task_id> "tag-to-remove"
```

5. View task details and statistics:
```bash
# Show task details
python cli.py show <task_id>

# Show task statistics
python cli.py stats
```

### Run the Tests
Run the unit tests using Python's unittest framework:

```bash
# Run tests with basic output
python -m unittest discover tests

# Run tests with verbose output
python -m unittest discover -v tests
```