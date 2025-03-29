import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class TaskPriorityManager {

    /**
     * Calculate a priority score for a task based on multiple factors.
     */
    public static int calculateTaskScore(Task task) {
        // Base priority weights
        Map<TaskPriority, Integer> priorityWeights = Map.of(
            TaskPriority.LOW, 1,
            TaskPriority.MEDIUM, 2,
            TaskPriority.HIGH, 3,
            TaskPriority.URGENT, 4
        );

        // Calculate base score from priority
        int score = priorityWeights.getOrDefault(task.getPriority(), 0) * 10;

        // Add due date factor (higher score for tasks due sooner)
        if (task.getDueDate() != null) {
            long daysUntilDue = ChronoUnit.DAYS.between(LocalDateTime.now(), task.getDueDate());
            if (daysUntilDue < 0) {  // Overdue tasks
                score += 30;
            } else if (daysUntilDue == 0) {  // Due today
                score += 20;
            } else if (daysUntilDue <= 7) {  // Due within a week
                score += 10;
            }
        }

        return score;
    }

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
    public static Task parseTaskFromText(String text) {
        String title = text.trim();
        TaskPriority priority = TaskPriority.MEDIUM;
        String dueDate = null;
        Set<String> tags = new HashSet<>();

        List<String> words = Arrays.asList(text.split("\\s+"));
        List<String> filteredWords = new ArrayList<>();

        for (String word : words) {
            if (word.startsWith("@")) {
                // Handle tags
                tags.add(word.substring(1));
            } else if (word.startsWith("!")) {
                // Handle priority
                String prio = word.substring(1).toLowerCase();
                if (prio.matches("\\d+")) {
                    int prioNum = Integer.parseInt(prio);
                    switch (prioNum) {
                        case 1: priority = TaskPriority.LOW; break;
                        case 2: priority = TaskPriority.MEDIUM; break;
                        case 3: priority = TaskPriority.HIGH; break;
                        case 4: priority = TaskPriority.URGENT; break;
                    }
                } else {
                    switch (prio) {
                        case "urgent": priority = TaskPriority.URGENT; break;
                        case "high": priority = TaskPriority.HIGH; break;
                        case "medium": priority = TaskPriority.MEDIUM; break;
                        case "low": priority = TaskPriority.LOW; break;
                    }
                }
            } else if (word.startsWith("#")) {
                // Handle due date (simplified - in real app would use date parsing)
                dueDate = word.substring(1);
            } else {
                filteredWords.add(word);
            }
        }

        // Reconstruct title from remaining words
        title = String.join(" ", filteredWords);

        return new Task(title, priority, dueDate, tags);
    }

    /**
     * Merge two task lists with conflict resolution.
     */
    public static MergeResult mergeTaskLists(Map<String, Task> localTasks, Map<String, Task> remoteTasks) {
        Map<String, Task> mergedTasks = new HashMap<>();
        Map<String, Task> toCreateRemote = new HashMap<>();
        Map<String, Task> toUpdateRemote = new HashMap<>();
        Map<String, Task> toCreateLocal = new HashMap<>();
        Map<String, Task> toUpdateLocal = new HashMap<>();

        // Get all unique task IDs
        Set<String> allTaskIds = new HashSet<>();
        allTaskIds.addAll(localTasks.keySet());
        allTaskIds.addAll(remoteTasks.keySet());

        for (String taskId : allTaskIds) {
            Task localTask = localTasks.get(taskId);
            Task remoteTask = remoteTasks.get(taskId);

            if (localTask != null && remoteTask != null) {
                // Task exists in both sources - need to resolve conflict
                if (localTask.getLastModified().isAfter(remoteTask.getLastModified())) {
                    mergedTasks.put(taskId, localTask.clone());
                    toUpdateRemote.put(taskId, localTask.clone());
                } else {
                    mergedTasks.put(taskId, remoteTask.clone());
                    toUpdateLocal.put(taskId, remoteTask.clone());
                }
            } else if (localTask != null) {
                // Task only exists locally
                mergedTasks.put(taskId, localTask.clone());
                toCreateRemote.put(taskId, localTask.clone());
            } else {
                // Task only exists remotely
                mergedTasks.put(taskId, remoteTask.clone());
                toCreateLocal.put(taskId, remoteTask.clone());
            }
        }

        return new MergeResult(mergedTasks, toCreateRemote, toUpdateRemote, toCreateLocal, toUpdateLocal);
    }
}

