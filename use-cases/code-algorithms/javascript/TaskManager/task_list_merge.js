const { TaskStatus } = require("./models");
/** Merges local and remote task lists with conflict resolution.
 * @param {Object} localTasks - Tasks from local source keyed by id
 * @param {Object} remoteTasks - Tasks from remote source keyed by id
 * @returns {Object} mergedTasks, toCreateRemote, toUpdateRemote, toCreateLocal, toUpdateLocal
 */

function mergeTaskLists(localTasks, remoteTasks) {
  const mergedTasks = {};
  const toCreateRemote = {};
  const toUpdateRemote = {};
  const toCreateLocal = {};
  const toUpdateLocal = {};

  // Step 1: Identify all unique task IDs across both sources
  const allTaskIds = new Set([
    ...Object.keys(localTasks),
    ...Object.keys(remoteTasks)
  ]);

  for (const taskId of allTaskIds) {
    const localTask = localTasks[taskId];
    const remoteTask = remoteTasks[taskId];

    // Case 1: Task exists only locally - add to remote
    if (localTask && !remoteTask) {
      mergedTasks[taskId] = localTask;
      toCreateRemote[taskId] = localTask;
    }
    // Case 2: Task exists only in remote - add to local
    else if (!localTask && remoteTask) {
      mergedTasks[taskId] = remoteTask;
      toCreateLocal[taskId] = remoteTask;
    }
    // Case 3: Task exists in both - resolve conflicts
    else {
      const [mergedTask, shouldUpdateLocal, shouldUpdateRemote] =
        resolveTaskConflict(localTask, remoteTask);

      mergedTasks[taskId] = mergedTask;

      if (shouldUpdateLocal) {
        toUpdateLocal[taskId] = mergedTask;
      }

      if (shouldUpdateRemote) {
        toUpdateRemote[taskId] = mergedTask;
      }
    }
  }

  return {
    mergedTasks,
    toCreateRemote,
    toUpdateRemote,
    toCreateLocal,
    toUpdateLocal
  };
}
/** Resolves conflicts between two versions of the same task.
 * Most-recent update wins. Completed status always wins. Tags are merged.
 * @param {Object} localTask - Local version of the task
 * @param {Object} remoteTask - Remote version of the task
 * @returns {Array} [mergedTask, shouldUpdateLocal, shouldUpdateRemote]
 */

function resolveTaskConflict(localTask, remoteTask) {
  
  const mergedTask = {...localTask};

  // Track if we need to update either source
  let shouldUpdateLocal = false;
  let shouldUpdateRemote = false;

  // Most recent update wins for most fields
  const localDate = new Date(localTask.updatedAt);
  const remoteDate = new Date(remoteTask.updatedAt);

  if (remoteDate > localDate) {
    // Remote task is newer, update local fields
    mergedTask.title = remoteTask.title;
    mergedTask.description = remoteTask.description;
    mergedTask.priority = remoteTask.priority;
    mergedTask.dueDate = remoteTask.dueDate;
    shouldUpdateLocal = true;
  } else {
    // Local task is newer or same age, update remote fields
    shouldUpdateRemote = true;
  }

  // Special handling for completed status - completed wins over not completed
  if (remoteTask.status === TaskStatus.DONE && localTask.status !== TaskStatus.DONE) {
    mergedTask.status = TaskStatus.DONE;
    mergedTask.completedAt = remoteTask.completedAt;
    shouldUpdateLocal = true;
  } else if (localTask.status === TaskStatus.DONE && remoteTask.status !== TaskStatus.DONE) {
    // Keep local status (already in mergedTask)
    shouldUpdateRemote = true;
  } else if (remoteTask.status !== localTask.status) {
    // Different non-completed status - most recent wins
    if (remoteDate > localDate) {
      mergedTask.status = remoteTask.status;
      shouldUpdateLocal = true;
    } else {
      // Keep local status (already in mergedTask)
      shouldUpdateRemote = true;
    }
  }

  // Merge tags from both sources (union)
  const allTags = [...new Set([...localTask.tags, ...remoteTask.tags])];
  mergedTask.tags = allTags;

  // If tags changed in either source, update both
  if (!arraysEqual(mergedTask.tags, localTask.tags)) {
    shouldUpdateLocal = true;
  }
  if (!arraysEqual(mergedTask.tags, remoteTask.tags)) {
    shouldUpdateRemote = true;
  }

  // Update the timestamp to latest
  mergedTask.updatedAt = localDate > remoteDate ? localTask.updatedAt : remoteTask.updatedAt;

  return [mergedTask, shouldUpdateLocal, shouldUpdateRemote];
}

// Helper function to compare arrays
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, i) => val === sortedB[i]);
}

// Export functions for testing
module.exports = { mergeTaskLists, resolveTaskConflict, arraysEqual };
