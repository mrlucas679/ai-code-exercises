// Task Status enum
const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE'
};

// Task Priority enum
const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// Task class
class Task {
  constructor(title) {
    this.id = Date.now().toString();
    this.title = title;
    this.description = '';
    this.priority = TaskPriority.MEDIUM;
    this.status = TaskStatus.TODO;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.dueDate = null;
    this.completedAt = null;
    this.tags = [];
  }
}

module.exports = {
  Task,
  TaskStatus,
  TaskPriority
};