# Python Debugging Examples

This directory contains two Python examples demonstrating common debugging scenarios:
1. Image Processing with Memory Management
2. Inventory Management with Data Structure Handling

## Prerequisites
- Python 3.7 or higher
- Required packages:
  ```
  numpy
  Pillow
  psutil
  ```

## Setup
```bash
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install numpy Pillow psutil
```

## Image Processing Example (image_processor.py)

Demonstrates debugging scenarios related to memory management and resource handling.

### Features
- Multiple implementations (buggy, fixed, enhanced)
- Memory usage monitoring
- Batch processing capabilities
- Resource cleanup and garbage collection

### Running the Example
```bash
python image_processor.py
```

### Debugging Scenarios
- Memory leaks and management
- Resource handling
- Batch processing errors
- File handling exceptions

## Inventory Management Example (inventory_management.py)

Demonstrates common programming errors and their solutions.

### Features
- Different implementation versions (buggy, fixed, enhanced)
- Error handling patterns
- Data validation

### Running the Example
```bash
python inventory_management.py
```

### Debugging Scenarios
- Off-by-one errors
- Data structure access errors
- Input validation
- Error handling patterns

## Using the Python Debugger (pdb)

To debug these examples using pdb:
```bash
# Start with debugger
python -m pdb image_processor.py
python -m pdb inventory_management.py

# Common pdb commands:
# n (next line)
# s (step into)
# c (continue)
# p variable_name (print variable)
# l (list source code)
# b line_number (set breakpoint)
```

## Memory Profiling

For the image processing example, you can use memory_profiler:
```bash
pip install memory_profiler
python -m memory_profiler image_processor.py
```

