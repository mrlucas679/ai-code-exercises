const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', authenticate, taskController.createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (with optional filters)
 * @access  Private
 */
router.get('/', authenticate, taskController.getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a task by ID
 * @access  Private
 */
router.get('/:id', authenticate, taskController.getTaskById);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', authenticate, taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', authenticate, taskController.deleteTask);

module.exports = router;