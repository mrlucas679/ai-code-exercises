# Task Prioritization Algorithm - Testing Exercise

## Project Context
TaskMaster is a task management application used by teams to track work items and priorities. The Task Prioritization Algorithm is a critical component that determines which tasks should be displayed first on users' dashboards.

## Feature Context
The testing exercise focuses on the task prioritization system that:
- Powers the "Smart Dashboard" feature showing users their most important tasks first
- Adapts to changing circumstances by considering multiple factors (deadlines, status changes, priority flags)
- Integrates with reminder systems to escalate overdue high-priority items
- Must be thoroughly tested to ensure reliable functionality

## Technical Context
- The algorithm processes thousands of tasks in real-time across the application
- Testing needs to cover unit tests for individual functions and integration tests for the entire workflow
- Edge cases must be identified and tested to ensure reliable sorting in all situations
- Tests should be maintainable and provide clear feedback when issues occur

## Exercise Objectives
- Practice using AI tools to develop effective testing strategies
- Learn to identify key behaviors and edge cases in algorithms
- Apply Test-Driven Development principles to add features and fix bugs
- Create integration tests that verify end-to-end functionality

## Testing Approach
The exercise guides you through:
1. Understanding what behaviors to test in the algorithm
2. Improving individual tests for better clarity and coverage
3. Using TDD to add new features and fix bugs
4. Creating integration tests for the entire task prioritization workflow

## System Requirements
- Language-specific testing frameworks:
  - Java: JUnit 5
  - JavaScript: Jest
  - Python: pytest