# Task Manager Priority Algorithm - Python Implementation

## Overview
This is the Python implementation of the TaskMaster task prioritization algorithm. The algorithm calculates task priority scores based on multiple factors including explicit priority, due date, status, tags, and recency of updates.

## Project Structure
```
├── task_manager/
│   ├── models/
│   │   └── __init__.py     # Task, TaskPriority, TaskStatus classes
│   ├── utils/
│   │   ├── __init__.py     # Package exports
│   │   └── task_priority_manager.py  # Priority algorithm
│   ├── tests/
│   │   ├── __init__.py     # Package marker
│   │   └── test_task_priority_manager.py  # Tests
│   └── __init__.py         # Package exports
├── conftest.py             # Pytest configuration
├── requirements.txt        # Project dependencies
└── setup.py               # Package setup script
```

## How the Algorithm Works
The priority algorithm in `task_priority_manager.py` calculates a score for each task based on:

1. **Base Priority**: LOW=10, MEDIUM=20, HIGH=30, URGENT=40
2. **Due Date Proximity**: 
   - Overdue: +30 points
   - Due today: +20 points
   - Due in next 2 days: +15 points
   - Due in next week: +10 points
3. **Status Adjustment**:
   - DONE: -50 points
   - REVIEW: -15 points
4. **Tag Boosting**:
   - Tasks with tags like "blocker", "critical", "urgent": +8 points
5. **Recency Boost**:
   - Updated in the last 24 hours: +5 points

## Testing Exercise

### Current State of Tests
The current tests in `test_task_priority_manager.py` are intentionally minimal and incomplete. They only test very basic functionality:

- Verifying that high priority tasks score higher than low priority tasks
- Confirming that tasks are sorted correctly by importance

### Your Task
Improve the test coverage by:

1. Writing comprehensive unit tests for `calculate_task_score()` that test all factors:
   - Priority weights
   - Due date factors
   - Status adjustments
   - Tag boosting
   - Recency boosting

2. Creating proper tests for `sort_tasks_by_importance()` with multiple tasks and varied priority factors

3. Adding tests for `get_top_priority_tasks()` that verify the correct number and order of tasks are returned

4. Adding edge case tests such as:
   - Empty task lists
   - Tasks with null or undefined values 
   - Tasks with same scores

### Running Tests
```
# Install the package in development mode
pip install -e .

# Run tests
pytest

# Run tests with coverage report
pytest --cov=task_manager
```