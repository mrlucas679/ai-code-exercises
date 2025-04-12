/**
 * Task Priority Enum
 * @readonly
 * @enum {string}
 */
const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

/**
 * Task Status Enum
 * @readonly
 * @enum {string}
 */
const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE'
};

/**
 * Class representing a Task
 */
class Task {
  /**
   * Create a new task
   * @param {string} title - The title of the task
   */
  constructor(title) {
    this.id = this._generateId();
    this.title = title;
    this.description = '';
    this.priority = TaskPriority.MEDIUM;
    this.status = TaskStatus.TODO;
    this.dueDate = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.completedAt = null;
    this.tags = [];
  }

  /**
   * Generate a unique ID for the task
   * @private
   * @returns {string} A unique ID
   */
  _generateId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Add a tag to the task if it doesn't already exist
   * @param {string} tag - The tag to add
   */
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  /**
   * Set the task status
   * @param {TaskStatus} status - The new status
   */
  setStatus(status) {
    this.status = status;
    this.updatedAt = new Date();
    
    if (status === TaskStatus.DONE) {
      this.completedAt = new Date();
    }
  }
}

module.exports = {
  Task,
  TaskPriority,
  TaskStatus
};