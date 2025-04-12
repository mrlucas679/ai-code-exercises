# Task Priority Algorithm Project

## Project Context
TaskMaster is a task management application used by teams to track work items, set priorities, and manage deadlines. As the development team for TaskMaster, you've been tasked with implementing the core algorithm that determines which tasks should be displayed first in users' dashboards.

## Feature Context
The Task Priority Algorithm is a critical component that:
- Powers the "Smart Dashboard" feature, showing users their most important tasks first
- Helps teams focus on high-impact work during busy periods
- Adapts to changing circumstances by considering multiple factors (deadlines, status changes, priority flags)
- Integrates with reminder systems to escalate overdue high-priority items

## Technical Context
- The algorithm processes thousands of tasks in real-time across the application
- Performance is critical as this runs on every dashboard load
- User feedback indicates that task prioritization must be intuitive and predictable
- The system needs to handle various edge cases, such as tasks with missing due dates

## User Stories
1. As a team lead, I want to see which critical tasks are due within the next 48 hours
2. As a developer, I want recently updated tasks to appear higher in my list
3. As a project manager, I want tasks marked as "blocker" to be highlighted
4. As a user, I want completed tasks to fall to the bottom of my list

## System Requirements
- Java 11+
- Gradle 7.0+ or Maven 3.6+
- JUnit 5 for testing