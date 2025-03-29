import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class Task implements Cloneable {
    private String title;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private Set<String> tags;
    private LocalDateTime lastModified;

    public Task(String title, TaskPriority priority, String dueDate, Set<String> tags) {
        this.title = title;
        this.priority = priority;
        // Simplified date handling - in a real app would use proper date parsing
        this.dueDate = dueDate != null ? LocalDateTime.now().plusDays(1) : null;
        this.tags = new HashSet<>(tags);
        this.lastModified = LocalDateTime.now();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        this.lastModified = LocalDateTime.now();
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
        this.lastModified = LocalDateTime.now();
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
        this.lastModified = LocalDateTime.now();
    }

    public Set<String> getTags() {
        return new HashSet<>(tags);
    }

    public void setTags(Set<String> tags) {
        this.tags = new HashSet<>(tags);
        this.lastModified = LocalDateTime.now();
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    @Override
    public Task clone() {
        Task clone = new Task(this.title, this.priority, null, this.tags);
        clone.dueDate = this.dueDate;
        clone.lastModified = this.lastModified;
        return clone;
    }

    @Override
    public String toString() {
        return String.format("Task{title='%s', priority=%s, dueDate=%s, tags=%s, lastModified=%s}",
            title, priority, dueDate, tags, lastModified);
    }
}

