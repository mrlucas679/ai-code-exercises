// Task priority enum
const TaskPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

function calculateTaskScore(task) {
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
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilDue < 0) {  // Overdue tasks
            score += 30;
        } else if (daysUntilDue === 0) {  // Due today
            score += 20;
        } else if (daysUntilDue <= 7) {  // Due within a week
            score += 10;
        }
    }

    return score;
}

function parseTaskFromText(text) {
    /**
     * Parse free-form text to extract task properties.
     *
     * Examples of format it can parse:
     * "Buy milk @shopping !2 #tomorrow"
     * "Finish report for client XYZ !urgent #friday #work @project"
     *
     * Where:
     * - Basic text is the task title
     * - @tag adds a tag
     * - !N sets priority (1=low, 2=medium, 3=high, 4=urgent)
     * - !urgent/!high/!medium/!low sets priority by name
     * - #date sets a due date
     */

    // Default task properties
    let title = text.trim();
    let priority = TaskPriority.MEDIUM;
    let dueDate = null;
    const tags = [];

    // Extract components
    const words = text.split(' ');
    const filteredWords = [];

    words.forEach(word => {
        if (word.startsWith('@')) {
            // Handle tags
            tags.push(word.substring(1));
        } else if (word.startsWith('!')) {
            // Handle priority
            const prio = word.substring(1).toLowerCase();
            if (/^\d+$/.test(prio)) {
                const prioNum = parseInt(prio);
                switch (prioNum) {
                    case 1: priority = TaskPriority.LOW; break;
                    case 2: priority = TaskPriority.MEDIUM; break;
                    case 3: priority = TaskPriority.HIGH; break;
                    case 4: priority = TaskPriority.URGENT; break;
                }
            } else {
                switch (prio) {
                    case 'urgent': priority = TaskPriority.URGENT; break;
                    case 'high': priority = TaskPriority.HIGH; break;
                    case 'medium': priority = TaskPriority.MEDIUM; break;
                    case 'low': priority = TaskPriority.LOW; break;
                }
            }
        } else if (word.startsWith('#')) {
            // Handle due date (simplified - in real app would use date parsing)
            dueDate = word.substring(1);
        } else {
            filteredWords.push(word);
        }
    });

    // Reconstruct title from remaining words
    title = filteredWords.join(' ');

    return {
        title,
        priority,
        dueDate,
        tags
    };
}

function mergeTaskLists(localTasks, remoteTasks) {
    /**
     * Merge two task lists with conflict resolution.
     *
     * Args:
     *   localTasks: Object of tasks from local source {task_id: task}
     *   remoteTasks: Object of tasks from remote source {task_id: task}
     *
     * Returns:
     *   Object with:
     *     - mergedTasks: Combined tasks
     *     - toCreateRemote: Tasks to be created in remote
     *     - toUpdateRemote: Tasks to be updated in remote
     *     - toCreateLocal: Tasks to be created in local
     *     - toUpdateLocal: Tasks to be updated in local
     */
    const mergedTasks = {};
    const toCreateRemote = {};
    const toUpdateRemote = {};
    const toCreateLocal = {};
    const toUpdateLocal = {};

    // Get all unique task IDs
    const allTaskIds = new Set([
        ...Object.keys(localTasks),
        ...Object.keys(remoteTasks)
    ]);

    allTaskIds.forEach(taskId => {
        const localTask = localTasks[taskId];
        const remoteTask = remoteTasks[taskId];

        if (localTask && remoteTask) {
            // Task exists in both sources - need to resolve conflict
            if (localTask.lastModified > remoteTask.lastModified) {
                mergedTasks[taskId] = { ...localTask };
                toUpdateRemote[taskId] = { ...localTask };
            } else {
                mergedTasks[taskId] = { ...remoteTask };
                toUpdateLocal[taskId] = { ...remoteTask };
            }
        } else if (localTask) {
            // Task only exists locally
            mergedTasks[taskId] = { ...localTask };
            toCreateRemote[taskId] = { ...localTask };
        } else {
            // Task only exists remotely
            mergedTasks[taskId] = { ...remoteTask };
            toCreateLocal[taskId] = { ...remoteTask };
        }
    });

    return {
        mergedTasks,
        toCreateRemote,
        toUpdateRemote,
        toCreateLocal,
        toUpdateLocal
    };
}

module.exports = {
    TaskPriority,
    calculateTaskScore,
    parseTaskFromText,
    mergeTaskLists
};

