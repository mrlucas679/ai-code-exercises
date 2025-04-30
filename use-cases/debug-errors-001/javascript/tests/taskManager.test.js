// taskManager.test.js
const { 
  initApp, 
  addTask, 
  displayTasks,
  toggleTaskStatus, 
  deleteTask, 
  getAllTasks, 
  resetTasks 
} = require('../taskManager');

describe('Task Manager', () => {
  beforeEach(() => {
    // Setup a mock DOM environment
    document.body.innerHTML = '<div id="task-list"></div>';
    // Reset tasks before each test
    resetTasks();
  });

  test('calling addTask followed by displayTasks should throw TypeError', () => {
    // Reset tasks to ensure clean state
    resetTasks();

    // Call addTask which will overwrite the global tasks variable with a single element
    // This causes the global 'tasks' variable to be undefined when displayTasks tries to use it
    addTask('Test task');

    // Expect displayTasks to throw a TypeError
    // The exact error message might be "Cannot read properties of undefined (reading 'forEach')"
    // or "Cannot read properties of undefined (reading 'map')" depending on which line triggers the error
    expect(() => {
      displayTasks();
    }).toThrow(TypeError);
  });

  test('toggleTaskStatus should toggle the completed status of a task', () => {
    // Initialize with default tasks
    initApp();

    // Get the initial state of the first task
    const initialTasks = getAllTasks();
    const initialStatus = initialTasks[0].completed;
    const taskId = initialTasks[0].id;

    // Toggle the status
    const updatedTasks = toggleTaskStatus(taskId);

    // Verify the results
    expect(updatedTasks[0].completed).toBe(!initialStatus);
  });

  test('initApp should initialize with default tasks', () => {
    // Call the function
    const tasks = initApp();

    // Verify the results
    expect(tasks.length).toBe(2);
    expect(tasks[0].name).toBe('Complete project proposal');
    expect(tasks[0].completed).toBe(false);
    expect(tasks[1].name).toBe('Meeting with team');
    expect(tasks[1].completed).toBe(true);
  });

  test('addTask should add a new task to the list', () => {
    // Initialize with default tasks
    initApp();

    // Add a new task
    const tasks = addTask('New test task');

    // Verify the results
    expect(tasks.length).toBe(3);
    expect(tasks[2].name).toBe('New test task');
    expect(tasks[2].completed).toBe(false);
  });

  test('deleteTask should remove a task from the list', () => {
    // Initialize with default tasks
    initApp();

    // Get the initial tasks
    const initialTasks = getAllTasks();
    const taskId = initialTasks[0].id;

    // Delete the first task
    const updatedTasks = deleteTask(taskId);

    // Verify the results
    expect(updatedTasks.length).toBe(1);
    expect(updatedTasks[0].id).not.toBe(taskId);
  });

});
