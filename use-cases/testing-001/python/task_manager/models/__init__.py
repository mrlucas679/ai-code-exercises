from enum import Enum
from datetime import datetime
import uuid
from typing import List, Optional


class TaskPriority(Enum):
    """Task priority levels"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class TaskStatus(Enum):
    """Task status values"""
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    REVIEW = "REVIEW"
    BLOCKED = "BLOCKED"
    DONE = "DONE"


class Task:
    """Task model representing a single task in the task manager"""
    
    def __init__(self, title: str):
        """
        Initialize a new task
        
        Args:
            title (str): The title of the task
        """
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = ""
        self.priority = TaskPriority.MEDIUM
        self.status = TaskStatus.TODO
        self.due_date = None
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.completed_at = None
        self.tags = []
    
    def add_tag(self, tag: str) -> None:
        """
        Add a tag to the task if it doesn't already exist
        
        Args:
            tag (str): The tag to add
        """
        if tag not in self.tags:
            self.tags.append(tag)
            self.updated_at = datetime.now()
    
    def set_status(self, status: TaskStatus) -> None:
        """
        Update the task status
        
        Args:
            status (TaskStatus): The new status
        """
        self.status = status
        self.updated_at = datetime.now()
        
        if status == TaskStatus.DONE:
            self.completed_at = datetime.now()