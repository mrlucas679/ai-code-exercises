# Task Manager Priority Algorithm - JavaScript Implementation

## Overview
This is the JavaScript implementation of the TaskMaster task prioritization algorithm. The algorithm calculates task priority scores based on multiple factors including explicit priority, due date, status, tags, and recency of updates.

## Project Structure
```
├── src/
│   ├── models/        # Task model definitions
│   │   └── index.js   # Task, TaskPriority, TaskStatus
│   ├── utils/         # Utility classes
│   │   └── taskPriorityManager.js # Priority algorithm
│   └── index.js       # Main entry point
├── test/
│   └── taskPriorityManager.test.js # Tests for priority algorithm
├── jest.config.js     # Jest configuration
└── package.json       # Project dependencies
```

## How the Algorithm Works
The priority algorithm in `taskPriorityManager.js` calculates a score for each task based on:

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
The current tests in `taskPriorityManager.test.js` are intentionally minimal and incomplete. They only test very basic functionality:

- Verifying that high priority tasks score higher than low priority tasks
- Confirming that tasks are sorted correctly by importance

### Your Task
Improve the test coverage by:

1. Writing comprehensive unit tests for `calculateTaskScore()` that test all factors:
   - Priority weights
   - Due date factors
   - Status adjustments
   - Tag boosting
   - Recency boosting

2. Creating proper tests for `sortTasksByImportance()` with multiple tasks and varied priority factors

3. Adding tests for `getTopPriorityTasks()` that verify the correct number and order of tasks are returned

4. Adding edge case tests such as:
   - Empty task lists
   - Tasks with null or undefined values
   - Tasks with same scores

### Running Tests
```
npm test
npm run test:coverage  # To see coverage report
```