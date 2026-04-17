// storage.js
const fs = require('fs');
const path = require('path');
const { Task, TaskPriority, TaskStatus } = require('./models');

// TaskStorage implements the Repository pattern: it abstracts all task
// persistence behind a consistent interface, so the rest of the app never
// reads or writes tasks.json directly.
class TaskStorage {
  constructor(storagePath = 'tasks.json') {
    this.storagePath = storagePath;
    this.tasks = {};
    this.load();
  }
/** Reads tasks from the JSON file and reconstructs Task instances into this.tasks. */
  load() {
    if (fs.existsSync(this.storagePath)) {
      try {
        const rawData = fs.readFileSync(this.storagePath, 'utf8');
        const tasksData = JSON.parse(rawData);

        tasksData.forEach(taskData => {
          const task = new Task(taskData.title, taskData.description);
          // Restore all properties from saved data
          task.id = taskData.id;
          task.priority = taskData.priority;
          task.status = taskData.status;
          task.createdAt = new Date(taskData.createdAt);
          task.updatedAt = new Date(taskData.updatedAt);

          if (taskData.dueDate) {
            task.dueDate = new Date(taskData.dueDate);
          }

          if (taskData.completedAt) {
            task.completedAt = new Date(taskData.completedAt);
          }

          task.tags = taskData.tags || [];

          this.tasks[task.id] = task;
        });
      } catch (error) {
        console.error(`Error loading tasks: ${error.message}`);
      }
    }
  }

/** Writes the current tasks map to the JSON file. */
  save() {
    try {
      const tasksArray = Object.values(this.tasks);
      fs.writeFileSync(this.storagePath, JSON.stringify(tasksArray, null, 2));
    } catch (error) {
      console.error(`Error saving tasks: ${error.message}`);
    }
  }
  
  /** Adds a new task to the storage and saves it. */
  addTask(task) {
    this.tasks[task.id] = task;
    this.save();
    return task.id;
  }

  /** Retrieves a task by its ID. */
  getTask(taskId) {
    return this.tasks[taskId];
  }
  
  /** Updates a task by its ID with the provided updates. */
  updateTask(taskId, updates) {
    const task = this.getTask(taskId);
    if (task) {
      task.update(updates);
      this.save();
      return true;
    }
    return false;
  }

  /** Deletes a task by its ID. */      
  deleteTask(taskId) {
    if (this.tasks[taskId]) {
      delete this.tasks[taskId];
      this.save();
      return true;
    }
    return false;
  }
  
  /** Retrieves all tasks. */
  getAllTasks() {
    return Object.values(this.tasks);
  }

  /** Retrieves tasks by their status. */     
  getTasksByStatus(status) {
    return Object.values(this.tasks).filter(task => task.status === status);
  }
  
  /** Retrieves tasks by their priority. */
  getTasksByPriority(priority) {
    return Object.values(this.tasks).filter(task => task.priority === priority);
  }

  /** Retrieves overdue tasks. */
  getOverdueTasks() {
    return Object.values(this.tasks).filter(task => task.isOverdue());
  }
}

module.exports = { TaskStorage };

