// app.js
const { Task, TaskPriority, TaskStatus } = require('./models');
const { TaskStorage } = require('./storage');

class TaskManager {
  constructor(storagePath = 'tasks.json') {
    this.storage = new TaskStorage(storagePath);
  }

/** Creates a new task, persists it, and returns its id. Returns null if date is invalid. */
  createTask(title, description = "", priorityValue = 2, dueDateStr = null, tags = []) {
    const priority = priorityValue;
    let dueDate = null;

    if (dueDateStr) {
      try {
        dueDate = new Date(dueDateStr);
        if (isNaN(dueDate.getTime())) {
          throw new Error("Invalid date");
        }
      } catch (error) {
        console.error("Invalid date format. Use YYYY-MM-DD");
        return null;
      }
    }

    const task = new Task(title, description, priority, dueDate, tags);
    const taskId = this.storage.addTask(task);
    return taskId;
  }

/** Returns tasks filtered by status, priority, or overdue flag. Returns all if no filter set. */
  listTasks(statusFilter = null, priorityFilter = null, showOverdue = false) {
    if (showOverdue) {
      return this.storage.getOverdueTasks();
    }

    if (statusFilter) {
      return this.storage.getTasksByStatus(statusFilter);
    }

    if (priorityFilter) {
      return this.storage.getTasksByPriority(parseInt(priorityFilter));
    }

    return this.storage.getAllTasks();
  }
/** Updates a task's status. Calls markAsDone() when status is DONE to set completedAt. */
  updateTaskStatus(taskId, newStatusValue) {
    if (newStatusValue === TaskStatus.DONE) {
      const task = this.storage.getTask(taskId);
      if (task) {
        task.markAsDone();
        this.storage.save();
        return true;
      }
      return false;
    } else {
      return this.storage.updateTask(taskId, { status: newStatusValue });
    }
  }
  
  /** Updates a task's priority. */ 
  updateTaskPriority(taskId, newPriorityValue) {
    return this.storage.updateTask(taskId, { priority: parseInt(newPriorityValue) });
  }
  
  /** Updates a task's due date. */ 
  updateTaskDueDate(taskId, dueDateStr) {
    try {
      const dueDate = new Date(dueDateStr);
      if (isNaN(dueDate.getTime())) {
        throw new Error("Invalid date");
      }
      return this.storage.updateTask(taskId, { dueDate });
    } catch (error) {
      console.error("Invalid date format. Use YYYY-MM-DD");
      return false;
    }
  }
  
  /** Deletes a task by its ID. */
  deleteTask(taskId) {
    return this.storage.deleteTask(taskId);
  }

  /** Retrieves details of a task by its ID. */ 
  getTaskDetails(taskId) {
    return this.storage.getTask(taskId);
  }
  
  /** Adds a tag to a task by its ID. */
  addTagToTask(taskId, tag) {
    const task = this.storage.getTask(taskId);
    if (task) {
      if (!task.tags.includes(tag)) {
        task.tags.push(tag);
        this.storage.save();
      }
      return true;
    }
    return false;
  }

  /** Removes a tag from a task by its ID. */   
  removeTagFromTask(taskId, tag) {
    const task = this.storage.getTask(taskId);
    if (task && task.tags.includes(tag)) {
      task.tags = task.tags.filter(t => t !== tag);
      this.storage.save();
      return true;
    }
    return false;
  }

  _countByStatus(tasks) {
    return Object.values(TaskStatus).reduce((acc, status) => {
      acc[status] = tasks.filter(t => t.status === status).length;
      return acc;
    }, {});
  }

  _countByPriority(tasks) {
    return Object.values(TaskPriority).reduce((acc, priority) => {
      acc[priority] = tasks.filter(t => t.priority === priority).length;
      return acc;
    }, {});
  }

  _completedLastWeek(tasks) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return tasks.filter(t => t.completedAt && t.completedAt >= sevenDaysAgo).length;
  }

  /** Returns a summary of tasks by status, priority, overdue count, and completions this week. */
  getStatistics() {
    const tasks = this.storage.getAllTasks();
    return {
      total: tasks.length,
      byStatus: this._countByStatus(tasks),
      byPriority: this._countByPriority(tasks),
      overdue: tasks.filter(t => t.isOverdue()).length,
      completedLastWeek: this._completedLastWeek(tasks)
    };
  }
}

module.exports = { TaskManager };
