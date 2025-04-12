/**
 * This is an example test file for TaskPriorityManager.
 * The tests are intentionally minimal as the exercise involves creating better tests.
 */

const { Task, TaskPriority, TaskStatus } = require('../src/models');
const TaskPriorityManager = require('../src/utils/taskPriorityManager');

describe('TaskPriorityManager', () => {
  describe('calculateTaskScore', () => {
    test('should score high priority tasks higher than low priority tasks', () => {
      // A very basic test that should be improved during the exercise
      const lowPriorityTask = new Task('Low priority task');
      lowPriorityTask.priority = TaskPriority.LOW;
      
      const highPriorityTask = new Task('High priority task');
      highPriorityTask.priority = TaskPriority.HIGH;

      const lowPriorityScore = TaskPriorityManager.calculateTaskScore(lowPriorityTask);
      const highPriorityScore = TaskPriorityManager.calculateTaskScore(highPriorityTask);

      expect(highPriorityScore).toBeGreaterThan(lowPriorityScore);
    });
  });

  describe('sortTasksByImportance', () => {
    test('should sort tasks by importance', () => {
      // A very basic test that should be improved during the exercise
      const task1 = new Task('Task 1');
      task1.priority = TaskPriority.LOW;
      
      const task2 = new Task('Task 2');
      task2.priority = TaskPriority.HIGH;
      
      const tasks = [task1, task2];
      const sortedTasks = TaskPriorityManager.sortTasksByImportance(tasks);
      
      expect(sortedTasks[0]).toBe(task2);
      expect(sortedTasks[1]).toBe(task1);
    });
  });
});