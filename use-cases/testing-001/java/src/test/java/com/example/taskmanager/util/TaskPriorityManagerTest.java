package com.example.taskmanager.util;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskPriority;
import com.example.taskmanager.model.TaskStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * This is an example test class for TaskPriorityManager.
 * The tests are intentionally minimal as the exercise involves creating better tests.
 */
class TaskPriorityManagerTest {

    @Test
    void calculateTaskScore_shouldScoreHighPriorityTasksHigher() {
        // A very basic test that should be improved during the exercise
        Task lowPriorityTask = new Task("Low priority task");
        lowPriorityTask.setPriority(TaskPriority.LOW);
        
        Task highPriorityTask = new Task("High priority task");
        highPriorityTask.setPriority(TaskPriority.HIGH);

        int lowPriorityScore = TaskPriorityManager.calculateTaskScore(lowPriorityTask);
        int highPriorityScore = TaskPriorityManager.calculateTaskScore(highPriorityTask);

        assertTrue(highPriorityScore > lowPriorityScore);
    }

    @Test
    void sortTasksByImportance_shouldSortCorrectly() {
        // A very basic test that should be improved during the exercise
        Task task1 = new Task("Task 1");
        task1.setPriority(TaskPriority.LOW);
        
        Task task2 = new Task("Task 2");
        task2.setPriority(TaskPriority.HIGH);
        
        List<Task> tasks = Arrays.asList(task1, task2);
        List<Task> sortedTasks = TaskPriorityManager.sortTasksByImportance(tasks);
        
        assertEquals(task2, sortedTasks.get(0));
        assertEquals(task1, sortedTasks.get(1));
    }
}