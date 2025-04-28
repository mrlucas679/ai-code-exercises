// tests/task_priority.test.js
const { Task, TaskPriority, TaskStatus } = require('../models');
const { calculateTaskScore, sortTasksByImportance, getTopPriorityTasks } = require('../task_priority');

describe('Task Priority', () => {
  describe('calculateTaskScore', () => {
    test('should calculate score based on priority', () => {
      const lowPriorityTask = new Task('Low Priority Task');
      lowPriorityTask.priority = TaskPriority.LOW;
      
      const mediumPriorityTask = new Task('Medium Priority Task');
      mediumPriorityTask.priority = TaskPriority.MEDIUM;
      
      const highPriorityTask = new Task('High Priority Task');
      highPriorityTask.priority = TaskPriority.HIGH;
      
      const urgentPriorityTask = new Task('Urgent Priority Task');
      urgentPriorityTask.priority = TaskPriority.URGENT;
      
      const lowScore = calculateTaskScore(lowPriorityTask);
      const mediumScore = calculateTaskScore(mediumPriorityTask);
      const highScore = calculateTaskScore(highPriorityTask);
      const urgentScore = calculateTaskScore(urgentPriorityTask);
      
      expect(lowScore).toBeLessThan(mediumScore);
      expect(mediumScore).toBeLessThan(highScore);
      expect(highScore).toBeLessThan(urgentScore);
    });
    
    test('should increase score for tasks due soon', () => {
      // Mock the current date
      const mockNow = new Date('2023-06-15');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow);
      
      const taskDueToday = new Task('Due Today');
      taskDueToday.dueDate = new Date('2023-06-15');
      
      const taskDueTomorrow = new Task('Due Tomorrow');
      taskDueTomorrow.dueDate = new Date('2023-06-16');
      
      const taskDueNextWeek = new Task('Due Next Week');
      taskDueNextWeek.dueDate = new Date('2023-06-22');
      
      const taskDueNextMonth = new Task('Due Next Month');
      taskDueNextMonth.dueDate = new Date('2023-07-15');
      
      const taskOverdue = new Task('Overdue');
      taskOverdue.dueDate = new Date('2023-06-14');
      
      const todayScore = calculateTaskScore(taskDueToday);
      const tomorrowScore = calculateTaskScore(taskDueTomorrow);
      const nextWeekScore = calculateTaskScore(taskDueNextWeek);
      const nextMonthScore = calculateTaskScore(taskDueNextMonth);
      const overdueScore = calculateTaskScore(taskOverdue);
      
      expect(overdueScore).toBeGreaterThan(todayScore);
      expect(todayScore).toBeGreaterThan(tomorrowScore);
      expect(tomorrowScore).toBeGreaterThan(nextWeekScore);
      expect(nextWeekScore).toBeGreaterThan(nextMonthScore);
      
      // Restore the original Date implementation
      jest.restoreAllMocks();
    });
    
    test('should reduce score for completed tasks', () => {
      const todoTask = new Task('Todo Task');
      todoTask.status = TaskStatus.TODO;
      
      const inProgressTask = new Task('In Progress Task');
      inProgressTask.status = TaskStatus.IN_PROGRESS;
      
      const reviewTask = new Task('Review Task');
      reviewTask.status = TaskStatus.REVIEW;
      
      const doneTask = new Task('Done Task');
      doneTask.status = TaskStatus.DONE;
      
      const todoScore = calculateTaskScore(todoTask);
      const inProgressScore = calculateTaskScore(inProgressTask);
      const reviewScore = calculateTaskScore(reviewTask);
      const doneScore = calculateTaskScore(doneTask);
      
      expect(doneScore).toBeLessThan(reviewScore);
      expect(reviewScore).toBeLessThan(todoScore);
      expect(reviewScore).toBeLessThan(inProgressScore);
    });
    
    test('should boost score for tasks with critical tags', () => {
      const regularTask = new Task('Regular Task');
      
      const criticalTask = new Task('Critical Task');
      criticalTask.tags = ['critical'];
      
      const blockerTask = new Task('Blocker Task');
      blockerTask.tags = ['blocker'];
      
      const urgentTask = new Task('Urgent Tagged Task');
      urgentTask.tags = ['urgent'];
      
      const regularScore = calculateTaskScore(regularTask);
      const criticalScore = calculateTaskScore(criticalTask);
      const blockerScore = calculateTaskScore(blockerTask);
      const urgentScore = calculateTaskScore(urgentTask);
      
      expect(criticalScore).toBeGreaterThan(regularScore);
      expect(blockerScore).toBeGreaterThan(regularScore);
      expect(urgentScore).toBeGreaterThan(regularScore);
    });
    
    test('should boost score for recently updated tasks', () => {
      // Mock the current date
      const mockNow = new Date('2023-06-15');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow);
      
      const recentlyUpdatedTask = new Task('Recently Updated');
      recentlyUpdatedTask.updatedAt = new Date('2023-06-15'); // Today
      
      const olderTask = new Task('Older Task');
      olderTask.updatedAt = new Date('2023-06-10'); // 5 days ago
      
      const recentScore = calculateTaskScore(recentlyUpdatedTask);
      const olderScore = calculateTaskScore(olderTask);
      
      expect(recentScore).toBeGreaterThan(olderScore);
      
      // Restore the original Date implementation
      jest.restoreAllMocks();
    });
  });
  
  describe('sortTasksByImportance', () => {
    test('should sort tasks by their calculated score', () => {
      // Create tasks with different priorities
      const lowPriorityTask = new Task('Low Priority');
      lowPriorityTask.priority = TaskPriority.LOW;
      
      const highPriorityTask = new Task('High Priority');
      highPriorityTask.priority = TaskPriority.HIGH;
      
      const urgentPriorityTask = new Task('Urgent Priority');
      urgentPriorityTask.priority = TaskPriority.URGENT;
      
      const tasks = [lowPriorityTask, highPriorityTask, urgentPriorityTask];
      const sortedTasks = sortTasksByImportance(tasks);
      
      expect(sortedTasks[0]).toBe(urgentPriorityTask);
      expect(sortedTasks[1]).toBe(highPriorityTask);
      expect(sortedTasks[2]).toBe(lowPriorityTask);
    });
    
    test('should not modify the original array', () => {
      const task1 = new Task('Task 1');
      const task2 = new Task('Task 2');
      const task3 = new Task('Task 3');
      
      const originalTasks = [task1, task2, task3];
      const originalTasksCopy = [...originalTasks];
      
      sortTasksByImportance(originalTasks);
      
      expect(originalTasks).toEqual(originalTasksCopy);
    });
  });
  
  describe('getTopPriorityTasks', () => {
    test('should return the top N tasks by importance', () => {
      // Create tasks with different priorities
      const lowPriorityTask = new Task('Low Priority');
      lowPriorityTask.priority = TaskPriority.LOW;
      
      const mediumPriorityTask = new Task('Medium Priority');
      mediumPriorityTask.priority = TaskPriority.MEDIUM;
      
      const highPriorityTask = new Task('High Priority');
      highPriorityTask.priority = TaskPriority.HIGH;
      
      const urgentPriorityTask = new Task('Urgent Priority');
      urgentPriorityTask.priority = TaskPriority.URGENT;
      
      const tasks = [
        lowPriorityTask, 
        mediumPriorityTask, 
        highPriorityTask, 
        urgentPriorityTask
      ];
      
      const topTasks = getTopPriorityTasks(tasks, 2);
      
      expect(topTasks.length).toBe(2);
      expect(topTasks[0]).toBe(urgentPriorityTask);
      expect(topTasks[1]).toBe(highPriorityTask);
    });
    
    test('should use default limit of 5 if not specified', () => {
      const tasks = Array.from({ length: 10 }, (_, i) => new Task(`Task ${i + 1}`));
      const topTasks = getTopPriorityTasks(tasks);
      
      expect(topTasks.length).toBe(5);
    });
    
    test('should return all tasks if limit is greater than number of tasks', () => {
      const tasks = Array.from({ length: 3 }, (_, i) => new Task(`Task ${i + 1}`));
      const topTasks = getTopPriorityTasks(tasks, 10);
      
      expect(topTasks.length).toBe(3);
    });
  });
});