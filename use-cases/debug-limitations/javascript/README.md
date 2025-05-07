# Merge Sort Debugging Exercise

This exercise is designed to help you practice debugging skills with a JavaScript implementation of the merge sort algorithm.

## Overview

The repository contains:
- `merge_sort.js`: An implementation of merge sort with a bug
- `test_merge_sort.js`: Tests that demonstrate the bug

## Requirements

- Node.js (any recent version)

## Running the Code

You can run the merge sort implementation directly:

```bash
node merge_sort.js
```

However, this won't show much output, as the file only defines the functions without executing them.

## Running the Tests

Run the test suite to see the bug in action:

```bash
node test_merge_sort.js
```

The tests will fail or hang due to the bug in the merge sort implementation.

## Exercise Goals

1. Identify the bug in the merge sort implementation
2. Fix the bug
3. Verify your solution by running the tests again - they should all pass

## Hints

- Read the code carefully, looking for any commented hints
- Pay special attention to loop conditions and incrementing variables
- Think about what happens when merging two arrays where elements from one array are exhausted before the other

## Solution

Don't peek at the solution until you've tried to solve it yourself! The bug is related to an incorrect variable being incremented in one of the while loops.