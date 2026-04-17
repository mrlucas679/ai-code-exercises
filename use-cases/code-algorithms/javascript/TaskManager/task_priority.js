const {TaskPriority, TaskStatus} = require("./models");

/** Returns a score bonus based on how many days until the due date.
 * @param {number} daysUntilDue
 * @returns {number} Score bonus
 */
function getDueDateBonus(daysUntilDue) {
  if (daysUntilDue < 0) return 30;
  if (daysUntilDue === 0) return 20;
  if (daysUntilDue <= 2) return 15;
  if (daysUntilDue <= 7) return 10;
  return 0;
}

/** Calculates a priority score for a task. Higher score = higher importance.
 * @param {Object} task - The task to score
 * @returns {number} Priority score
 */

function calculateTaskScore(task) {
  const now = new Date();

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
    const daysUntilDue = Math.ceil((new Date(task.dueDate) - now) / (1000 * 60 * 60 * 24));
    score += getDueDateBonus(daysUntilDue);
  }

  // Reduce score for tasks that are completed or in review
  if (task.status === TaskStatus.DONE) {
    score -= 50;
  } else if (task.status === TaskStatus.REVIEW) {
    score -= 15;
  }

  // Boost score for tasks with certain tags
  if (task.tags.some(tag => ["blocker", "critical", "urgent"].includes(tag))) {
    score += 8;
  }

  // Boost score for recently updated tasks
  const updatedAt = new Date(task.updatedAt);
  const daysSinceUpdate = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
  if (daysSinceUpdate < 1) {
    score += 5;
  }

  return score;
}

/** Sorts tasks by priority score, highest first. Returns a new array.
 * @param {Object[]} tasks - Tasks to sort
 * @returns {Object[]} Sorted copy of the tasks array
 */

function sortTasksByImportance(tasks) {
  // Create a copy of the tasks array to avoid modifying the original
  return [...tasks].sort((a, b) => {
    return calculateTaskScore(b) - calculateTaskScore(a);
  });
}

/** Returns the top N tasks by priority score.
 * @param {Object[]} tasks - Tasks to filter
 * @param {number} [limit=5] - Max tasks to return
 * @returns {Object[]} Top priority tasks
 */

function getTopPriorityTasks(tasks, limit = 5) {
  const sortedTasks = sortTasksByImportance(tasks);
  return sortedTasks.slice(0, limit);
}

// Export functions for testing
module.exports = { calculateTaskScore, sortTasksByImportance, getTopPriorityTasks };
