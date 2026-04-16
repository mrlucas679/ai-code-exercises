// tests/taskManager.test.js
const { TaskManager } = require('../app');
const path = require('path');
const fs = require('fs');

// Use a separate test storage file to avoid affecting real data
const TEST_STORAGE = path.join(__dirname, 'test_tasks.json');

describe('TaskManager', () => {
  let manager;

  beforeEach(() => {
    // Remove test storage file before each test for a clean state
    if (fs.existsSync(TEST_STORAGE)) {
      fs.unlinkSync(TEST_STORAGE);
    }
    manager = new TaskManager(TEST_STORAGE);
  });

  afterAll(() => {
    // Clean up the test storage file after all tests are done
    if (fs.existsSync(TEST_STORAGE)) {
      fs.unlinkSync(TEST_STORAGE);
    }
  });

  describe('createTask', () => {
    test('should return a task ID when a task is created', () => {
      // Create a new task
      const id = manager.createTask('Test task');

      // Verify a valid ID is returned
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });
  });

  describe('listTasks', () => {
    test('should return all created tasks', () => {
      // Create two tasks
      manager.createTask('Task one');
      manager.createTask('Task two');

      // Verify both tasks are listed
      const tasks = manager.listTasks();
      expect(tasks.length).toBe(2);
    });
  });

  describe('deleteTask', () => {
    test('should remove the task from the list', () => {
      // Create a task then delete it
      const id = manager.createTask('To be deleted');
      manager.deleteTask(id);

      // Verify the task no longer exists
      const tasks = manager.listTasks();
      expect(tasks.find(t => t.id === id)).toBeUndefined();
    });
  });

  describe('updateTaskStatus', () => {
    test('should change the task status', () => {
      // Create a task and update its status
      const id = manager.createTask('Status test');
      manager.updateTaskStatus(id, 'in_progress');

      // Verify the status was updated
      const task = manager.getTaskDetails(id);
      expect(task.status).toBe('in_progress');
    });

    test('should set completedAt when status is updated to done', () => {
      // Create a task and mark it as done
      const id = manager.createTask('Complete me');
      manager.updateTaskStatus(id, 'done');

      // Verify status is done and completedAt is recorded
      const task = manager.getTaskDetails(id);
      expect(task.status).toBe('done');
      expect(task.completedAt).not.toBeNull();
    });
  });

  describe('addTagToTask', () => {
    test('should add a tag to the task', () => {
      // Create a task and add a tag to it
      const id = manager.createTask('Tag test');
      manager.addTagToTask(id, 'urgent');

      // Verify the tag was added
      const task = manager.getTaskDetails(id);
      expect(task.tags).toContain('urgent');
    });
  });

});
