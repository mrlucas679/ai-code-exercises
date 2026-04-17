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
  DONE: 'done'
};

class Task {
    /** Creates a new Task with default status of TODO and a generated UUID. */
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
  
   /** Updates allowed fields on the task and refreshes updatedAt. */ 
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date();
  }

   /** Sets status to DONE and records the completion timestamp. */
  markAsDone() {
    this.status = TaskStatus.DONE;
    this.completedAt = new Date();
    this.updatedAt = this.completedAt;
  }

  /** Returns true if task has a past due date and is not yet DONE. */
  isOverdue() {
    if (!this.dueDate) {
      return false;
    }
    return this.dueDate < new Date() && this.status !== TaskStatus.DONE;
  }
}

module.exports = { Task, TaskPriority, TaskStatus };

