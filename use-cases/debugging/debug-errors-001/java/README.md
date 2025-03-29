# Debugging Examples - Error Cases

This directory contains Java examples demonstrating common debugging scenarios with FactorialCalculator and ShoppingCart implementations.

## Prerequisites
- Java Development Kit (JDK) 11 or higher
- A Java IDE with debugging capabilities (optional, but recommended)

## Building and Running

### Compiling the Code
```bash
javac FactorialCalculator.java ShoppingCart.java
```

### Running the Examples
```bash
# Run Factorial Calculator
java FactorialCalculator

# Run Shopping Cart
java ShoppingCart
```

## Debugging Instructions

This example contains intentional errors for debugging practice. Here's how to approach debugging these examples:

### Using IDE Debugger
1. Set breakpoints in the code where you suspect issues
2. Run the program in debug mode
3. Step through the code to observe variable values and program flow

### Using Command Line
Run the programs with additional debugging flags:
```bash
java -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005 FactorialCalculator
```

## Expected Issues to Debug
- FactorialCalculator: Watch for edge cases and negative numbers
- ShoppingCart: Check for price calculations and item quantity management

## Code Structure
- `FactorialCalculator.java`: Demonstrates numeric computation debugging
- `ShoppingCart.java`: Demonstrates object state and calculation debugging

