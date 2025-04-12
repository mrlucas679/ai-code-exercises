const { TaskPriority, TaskStatus } = require('../models');

/**
 * Utility class for managing task priorities
 */
class TaskPriorityManager {
  /**
   * Calculate a priority score for a task based on multiple factors.
   * @param {import('../models').Task} task - The task to calculate score for
   * @returns {number} The calculated priority score
   */
  static calculateTaskScore(task) {
    // Base priority weights
    const priorityWeights = {
      [TaskPriority.LOW]: 1,
      [TaskPriority.MEDIUM]: 2,
      [TaskPriority.HIGH]: 3,
      [TaskPriority.URGENT]: 4
    };

    // Calculate base score from priority
    let score = (priorityWeights[task.priority] || 0) * 10;

    // Add due date factor (higher score for tasks due sooner)
    if (task.dueDate) {
      const now = new Date();
      const daysUntilDue = Math.floor((task.dueDate - now) / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) {  // Overdue tasks
        score += 30;
      } else if (daysUntilDue === 0) {  // Due today
        score += 20;
      } else if (daysUntilDue <= 2) {  // Due in next 2 days
        score += 15;
      } else if (daysUntilDue <= 7) {  // Due in next week
        score += 10;
      }
    }

    // Reduce score for tasks that are completed or in review
    if (task.status === TaskStatus.DONE) {
      score -= 50;
    } else if (task.status === TaskStatus.REVIEW) {
      score -= 15;
    }

    // Boost score for tasks with certain tags
    const importantTags = ['blocker', 'critical', 'urgent'];
    if (task.tags.some(tag => importantTags.includes(tag))) {
      score += 8;
    }

    // Boost score for recently updated tasks
    const daysSinceUpdate = Math.floor((new Date() - task.updatedAt) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate < 1) {
      score += 5;
    }

    return score;
  }

  /**
   * Sort tasks by calculated importance score (highest first).
   * @param {Array<import('../models').Task>} tasks - The list of tasks to sort
   * @returns {Array<import('../models').Task>} Sorted tasks
   */
  static sortTasksByImportance(tasks) {
    return [...tasks].sort((a, b) => {
      const scoreA = this.calculateTaskScore(a);
      const scoreB = this.calculateTaskScore(b);
      return scoreB - scoreA;  // Descending order
    });
  }

  /**
   * Return the top N priority tasks.
   * @param {Array<import('../models').Task>} tasks - The list of tasks
   * @param {number} limit - The number of tasks to return
   * @returns {Array<import('../models').Task>} Top priority tasks
   */
  static getTopPriorityTasks(tasks, limit) {
    const sortedTasks = this.sortTasksByImportance(tasks);
    return sortedTasks.slice(0, limit);
  }
}

module.exports = TaskPriorityManager;