# Factorial Calculator - Stack Overflow Debugging Challenge

## Project Context
MathUtils is a Java library that provides mathematical utility functions for educational software. The library includes various mathematical operations for use in computer science and math education applications.

## Feature Context
The Factorial Calculator is a key component that:
- Calculates the factorial of a given number (n!)
- Is used in probability and statistics lessons
- Demonstrates the concept of recursion in programming
- Serves as an educational example for students learning Java

## Technical Context
- Java 11 application
- Uses recursion to calculate factorial values
- Called by various parts of the educational software
- Expected to work with positive integers within the range of Java's int type

## Error Context
- Application crashes with StackOverflowError
- The error doesn't occur immediately but after many recursive calls
- Stacktrace shows repeated calls to the same method
- The recursive function appears to have no base case or termination condition

## User Stories
1. As a math teacher, I need a reliable factorial calculator for classroom examples
2. As a student, I want to see how recursion works in practice
3. As an educational software developer, I need robust utility functions that won't crash
4. As a learner, I want to understand common programming errors like infinite recursion

## System Requirements
- Java 11+
- JUnit 5 for testing