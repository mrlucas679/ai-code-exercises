import unittest
from task_manager.models import Task, TaskPriority, TaskStatus
from task_manager.utils import TaskPriorityManager


class TestTaskPriorityManager(unittest.TestCase):
    """
    This is an example test class for TaskPriorityManager.
    The tests are intentionally minimal as the exercise involves creating better tests.
    """
    
    def test_calculate_task_score_should_score_high_priority_tasks_higher(self):
        """Test that high priority tasks have a higher score than low priority tasks"""
        # A very basic test that should be improved during the exercise
        low_priority_task = Task("Low priority task")
        low_priority_task.priority = TaskPriority.LOW
        
        high_priority_task = Task("High priority task")
        high_priority_task.priority = TaskPriority.HIGH
        
        low_priority_score = TaskPriorityManager.calculate_task_score(low_priority_task)
        high_priority_score = TaskPriorityManager.calculate_task_score(high_priority_task)
        
        self.assertGreater(high_priority_score, low_priority_score)
    
    def test_sort_tasks_by_importance_should_sort_correctly(self):
        """Test that tasks are sorted correctly by importance"""
        # A very basic test that should be improved during the exercise
        task1 = Task("Task 1")
        task1.priority = TaskPriority.LOW
        
        task2 = Task("Task 2")
        task2.priority = TaskPriority.HIGH
        
        tasks = [task1, task2]
        sorted_tasks = TaskPriorityManager.sort_tasks_by_importance(tasks)
        
        self.assertEqual(task2, sorted_tasks[0])
        self.assertEqual(task1, sorted_tasks[1])


if __name__ == "__main__":
    unittest.main()