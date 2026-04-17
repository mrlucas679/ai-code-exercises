// models.js
const { v4: uuidv4 } = require('uuid');

const TaskPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4
};

const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
  ABANDONED: 'abandoned'
};

class Task {
  constructor(title, description = '', priority = TaskPriority.MEDIUM, dueDate = null, tags = []) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = TaskStatus.TODO;
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
    this.dueDate = dueDate;
    this.completedAt = null;
    this.tags = tags;
  }

  update(updates) {
    const UPDATABLE_FIELDS = new Set(['title', 'description', 'priority', 'status', 'dueDate', 'completedAt', 'tags']);
    Object.keys(updates).forEach(key => {
      if (UPDATABLE_FIELDS.has(key)) {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date();
  }

  markAsDone() {
    this.status = TaskStatus.DONE;
    this.completedAt = new Date();
    this.updatedAt = this.completedAt;
  }

  isOverdue() {
    if (!this.dueDate) {
      return false;
    }
    return this.dueDate < new Date() && this.status !== TaskStatus.DONE;
  }

  /** Marks task as ABANDONED and records the timestamp. */
  markAsAbandoned() {
    this.status = TaskStatus.ABANDONED;
    this.updatedAt = new Date();
  }
}

module.exports = { Task, TaskPriority, TaskStatus };

