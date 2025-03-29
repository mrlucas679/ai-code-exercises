from datetime import datetime
from enum import Enum

class TaskPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

def calculate_task_score(task):
    """Calculate a priority score for a task based on multiple factors."""
    # Base priority weights
    priority_weights = {
        TaskPriority.LOW: 1,
        TaskPriority.MEDIUM: 2,
        TaskPriority.HIGH: 3,
        TaskPriority.URGENT: 4
    }

    # Calculate base score from priority
    score = priority_weights.get(task.priority, 0) * 10

    # Add due date factor (higher score for tasks due sooner)
    if task.due_date:
        days_until_due = (task.due_date - datetime.now()).days
        if days_until_due < 0:  # Overdue tasks
            score += 30
        elif days_until_due == 0:  # Due today
            score += 20
        elif days_until_due <= 7:  # Due within a week
            score += 10

    return score

def parse_task_from_text(text):
    """
    Parse free-form text to extract task properties.

    Examples of format it can parse:
    "Buy milk @shopping !2 #tomorrow"
    "Finish report for client XYZ !urgent #friday #work @project"

    Where:
    - Basic text is the task title
    - @tag adds a tag
    - !N sets priority (1=low, 2=medium, 3=high, 4=urgent)
    - !urgent/!high/!medium/!low sets priority by name
    - #date sets a due date
    """
    # Default task properties
    title = text.strip()
    priority = TaskPriority.MEDIUM
    due_date = None
    tags = []

    # Extract components
    words = text.split()
    filtered_words = []

    for word in words:
        if word.startswith('@'):
            # Handle tags
            tags.append(word[1:])
        elif word.startswith('!'):
            # Handle priority
            prio = word[1:].lower()
            if prio.isdigit():
                prio_num = int(prio)
                if prio_num == 1:
                    priority = TaskPriority.LOW
                elif prio_num == 2:
                    priority = TaskPriority.MEDIUM
                elif prio_num == 3:
                    priority = TaskPriority.HIGH
                elif prio_num == 4:
                    priority = TaskPriority.URGENT
            else:
                if prio == 'urgent':
                    priority = TaskPriority.URGENT
                elif prio == 'high':
                    priority = TaskPriority.HIGH
                elif prio == 'medium':
                    priority = TaskPriority.MEDIUM
                elif prio == 'low':
                    priority = TaskPriority.LOW
        elif word.startswith('#'):
            # Handle due date (simplified - in real app would use date parsing)
            due_date = word[1:]
        else:
            filtered_words.append(word)

    # Reconstruct title from remaining words
    title = ' '.join(filtered_words)

    return {
        'title': title,
        'priority': priority,
        'due_date': due_date,
        'tags': tags
    }

def merge_task_lists(local_tasks, remote_tasks):
    """
    Merge two task lists with conflict resolution.

    Args:
        local_tasks: Dictionary of tasks from local source {task_id: task}
        remote_tasks: Dictionary of tasks from remote source {task_id: task}

    Returns:
        tuple: (
            merged tasks dictionary,
            tasks to be created in remote,
            tasks to be updated in remote,
            tasks to be created in local,
            tasks to be updated in local
        )
    """
    merged_tasks = {}
    to_create_remote = {}
    to_update_remote = {}
    to_create_local = {}
    to_update_local = {}

    # Process all task IDs from both sources
    all_task_ids = set(local_tasks.keys()) | set(remote_tasks.keys())

    for task_id in all_task_ids:
        local_task = local_tasks.get(task_id)
        remote_task = remote_tasks.get(task_id)

        if local_task and remote_task:
            # Task exists in both sources - need to resolve conflict
            if local_task.last_modified > remote_task.last_modified:
                merged_tasks[task_id] = copy.deepcopy(local_task)
                to_update_remote[task_id] = copy.deepcopy(local_task)
            else:
                merged_tasks[task_id] = copy.deepcopy(remote_task)
                to_update_local[task_id] = copy.deepcopy(remote_task)
        elif local_task:
            # Task only exists locally
            merged_tasks[task_id] = copy.deepcopy(local_task)
            to_create_remote[task_id] = copy.deepcopy(local_task)
        else:
            # Task only exists remotely
            merged_tasks[task_id] = copy.deepcopy(remote_task)
            to_create_local[task_id] = copy.deepcopy(remote_task)

    return (
        merged_tasks,
        to_create_remote,
        to_update_remote,
        to_create_local,
        to_update_local
    )

