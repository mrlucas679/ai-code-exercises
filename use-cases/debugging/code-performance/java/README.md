# Java Performance Example - Image Processing

This example demonstrates performance optimization techniques in Java using image processing operations.

## Prerequisites
- Java Development Kit (JDK) 11 or higher
- Knowledge of Java memory management
- Basic understanding of image processing concepts

## Building and Running

```bash
# Compile the code
javac ImageProcessor.java

# Run with default heap size
java ImageProcessor

# Run with specific heap size
java -Xmx512m ImageProcessor
```

## Performance Monitoring

### Using JVM Arguments
```bash
# Enable detailed GC logging
java -XX:+PrintGCDetails -XX:+PrintGCTimeStamps ImageProcessor

# Enable JFR (Java Flight Recorder)
java -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=recording.jfr ImageProcessor
```

### Using Visual VM
1. Start VisualVM (included in JDK)
2. Run the application
3. Monitor:
   - Heap memory usage
   - GC activity
   - CPU usage
   - Thread states

## Performance Considerations

### Memory Management
- The application processes images sequentially to manage memory usage
- OutOfMemoryError handling is implemented for large images
- Consider implementing batch processing for large directories

### Optimization Opportunities
1. Implement image resizing for large images
2. Add parallel processing using ExecutorService
3. Implement memory-efficient buffered processing
4. Add image caching for repeated operations

### Best Practices
- Always close resources using try-with-resources
- Monitor heap usage with large image sets
- Implement proper error handling and logging
- Consider using NIO for file operations

## Profiling

Use Java profiling tools to identify bottlenecks:

```bash
# Using Java Mission Control
java -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=recording.jfr ImageProcessor

# Using async-profiler
./profiler.sh -d 30 -f profile.html $(pgrep -f ImageProcessor)
```

## Memory Tuning

Adjust JVM parameters based on your requirements:
```bash
java -Xmx2g -Xms1g -XX:+UseG1GC ImageProcessor
```

Key parameters:
- `-Xmx`: Maximum heap size
- `-Xms`: Initial heap size
- `-XX:+UseG1GC`: Use G1 Garbage Collector

## Monitoring Tools
- JConsole
- VisualVM
- Java Mission Control
- async-profiler
- JFR (Java Flight Recorder)

