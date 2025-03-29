import java.util.Map;

public class MergeResult {
    private final Map<String, Task> mergedTasks;
    private final Map<String, Task> toCreateRemote;
    private final Map<String, Task> toUpdateRemote;
    private final Map<String, Task> toCreateLocal;
    private final Map<String, Task> toUpdateLocal;

    public MergeResult(
        Map<String, Task> mergedTasks,
        Map<String, Task> toCreateRemote,
        Map<String, Task> toUpdateRemote,
        Map<String, Task> toCreateLocal,
        Map<String, Task> toUpdateLocal
    ) {
        this.mergedTasks = mergedTasks;
        this.toCreateRemote = toCreateRemote;
        this.toUpdateRemote = toUpdateRemote;
        this.toCreateLocal = toCreateLocal;
        this.toUpdateLocal = toUpdateLocal;
    }

    public Map<String, Task> getMergedTasks() {
        return mergedTasks;
    }

    public Map<String, Task> getToCreateRemote() {
        return toCreateRemote;
    }

    public Map<String, Task> getToUpdateRemote() {
        return toUpdateRemote;
    }

    public Map<String, Task> getToCreateLocal() {
        return toCreateLocal;
    }

    public Map<String, Task> getToUpdateLocal() {
        return toUpdateLocal;
    }

    @Override
    public String toString() {
        return String.format(
            "MergeResult{mergedTasks=%d, toCreateRemote=%d, toUpdateRemote=%d, toCreateLocal=%d, toUpdateLocal=%d}",
            mergedTasks.size(), toCreateRemote.size(), toUpdateRemote.size(),
            toCreateLocal.size(), toUpdateLocal.size()
        );
    }
}

