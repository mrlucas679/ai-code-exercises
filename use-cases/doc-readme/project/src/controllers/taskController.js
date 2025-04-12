const Task = require('../models/Task');
const Project = require('../models/Project');
const { createActivity } = require('../services/activityService');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assignedTo, tags } = req.body;
    
    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
    }
    
    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      project: projectId,
      assignedTo,
      createdBy: req.user._id,
      tags
    });
    
    await task.save();
    
    // Log activity
    await createActivity({
      type: 'TASK_CREATED',
      user: req.user._id,
      task: task._id,
      project: projectId
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, project, assignedTo, search, sortBy = 'dueDate', sortDir = 'asc' } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (project) query.project = project;
    if (assignedTo) query.assignedTo = assignedTo === 'me' ? req.user._id : assignedTo;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortDir === 'desc' ? -1 : 1;
    
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error getting tasks', error: error.message });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name email');
      
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error getting task', error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assignedTo, tags } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (projectId) task.project = projectId;
    if (assignedTo) task.assignedTo = assignedTo;
    if (tags) task.tags = tags;
    
    await task.save();
    
    // Log activity
    await createActivity({
      type: 'TASK_UPDATED',
      user: req.user._id,
      task: task._id,
      project: task.project
    });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const projectId = task.project;
    
    await task.remove();
    
    // Log activity
    await createActivity({
      type: 'TASK_DELETED',
      user: req.user._id,
      project: projectId,
      metadata: { taskTitle: task.title }
    });
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};