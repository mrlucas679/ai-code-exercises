from datetime import datetime
from typing import List, Dict, Any, Optional

from task_manager.models import Task, TaskPriority, TaskStatus


class TaskPriorityManager:
    """Utility class for managing task priorities"""
    
    @staticmethod
    def calculate_task_score(task: Task) -> int:
        """
        Calculate a priority score for a task based on multiple factors.
        
        Args:
            task (Task): The task to calculate score for
            
        Returns:
            int: The calculated priority score
        """
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
            now = datetime.now()
            days_until_due = (task.due_date - now).days
            
            if days_until_due < 0:  # Overdue tasks
                score += 30
            elif days_until_due == 0:  # Due today
                score += 20
            elif days_until_due <= 2:  # Due in next 2 days
                score += 15
            elif days_until_due <= 7:  # Due in next week
                score += 10
        
        # Reduce score for tasks that are completed or in review
        if task.status == TaskStatus.DONE:
            score -= 50
        elif task.status == TaskStatus.REVIEW:
            score -= 15
        
        # Boost score for tasks with certain tags
        important_tags = ["blocker", "critical", "urgent"]
        if any(tag in important_tags for tag in task.tags):
            score += 8
        
        # Boost score for recently updated tasks
        days_since_update = (datetime.now() - task.updated_at).days
        if days_since_update < 1:
            score += 5
            
        return score
    
    @classmethod
    def sort_tasks_by_importance(cls, tasks: List[Task]) -> List[Task]:
        """
        Sort tasks by calculated importance score (highest first).
        
        Args:
            tasks (List[Task]): The list of tasks to sort
            
        Returns:
            List[Task]: Sorted tasks
        """
        return sorted(tasks, key=cls.calculate_task_score, reverse=True)
    
    @classmethod
    def get_top_priority_tasks(cls, tasks: List[Task], limit: int) -> List[Task]:
        """
        Return the top N priority tasks.
        
        Args:
            tasks (List[Task]): The list of tasks
            limit (int): The number of tasks to return
            
        Returns:
            List[Task]: Top priority tasks
        """
        sorted_tasks = cls.sort_tasks_by_importance(tasks)
        return sorted_tasks[:limit]