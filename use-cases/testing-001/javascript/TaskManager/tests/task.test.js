// tests/task.test.js
const { Task, TaskPriority, TaskStatus } = require('../models');

describe('Task', () => {

  describe('constructor', () => {
    test('should create a task with default values', () => {
      // Create a basic task with only a title
      const task = new Task('Buy milk');

      // Verify the default values are set correctly
      expect(task.title).toBe('Buy milk');
      expect(task.description).toBe('');
      expect(task.priority).toBe(TaskPriority.MEDIUM);
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.tags).toEqual([]);
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
      expect(task.id).toBeDefined();
    });

    test('should create a task with custom values', () => {
      // Create a task with all fields specified
      const task = new Task('Write report', 'Monthly report', TaskPriority.HIGH, null, ['work']);

      // Verify the custom values are set correctly
      expect(task.title).toBe('Write report');
      expect(task.description).toBe('Monthly report');
      expect(task.priority).toBe(TaskPriority.HIGH);
      expect(task.tags).toContain('work');
    });
  });

  describe('markAsDone', () => {
    test('should set status to DONE and record completedAt', () => {
      // Create a task and mark it as done
      const task = new Task('Finish assignment');
      task.markAsDone();

      // Verify the status and completedAt are updated
      expect(task.status).toBe(TaskStatus.DONE);
      expect(task.completedAt).not.toBeNull();
    });
  });

  describe('isOverdue', () => {
    test('should return false when no due date is set', () => {
      // Create a task with no due date
      const task = new Task('No deadline task');

      // Verify it is not overdue
      expect(task.isOverdue()).toBe(false);
    });

    test('should return true for a past due date on an incomplete task', () => {
      // Create a task with a due date in the past
      const overdueTask = new Task('Old task');
      overdueTask.dueDate = new Date('2020-01-01');

      // Verify it is overdue
      expect(overdueTask.isOverdue()).toBe(true);
    });

    test('should return false for a done task even if past due date', () => {
      // Create a task that is done but had a past due date
      const completedTask = new Task('Late but done task');
      completedTask.dueDate = new Date('2020-01-01');
      completedTask.markAsDone();

      // Verify a completed task is never overdue
      expect(completedTask.isOverdue()).toBe(false);
    });
  });

  describe('update', () => {
    test('should change the correct fields and update updatedAt', () => {
      // Create a task and record the original updatedAt time
      const task = new Task('Original title');
      const originalUpdatedAt = task.updatedAt;

      // Update the task with new values
      task.update({ title: 'Updated title', priority: TaskPriority.URGENT });

      // Verify the fields are updated and updatedAt has changed
      expect(task.title).toBe('Updated title');
      expect(task.priority).toBe(TaskPriority.URGENT);
      expect(task.updatedAt).not.toBe(originalUpdatedAt);
    });
  });

});
