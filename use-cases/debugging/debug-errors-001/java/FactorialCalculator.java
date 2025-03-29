package ai.use.cases.debugging.examples;

/**
 * Example class demonstrating common debugging scenarios in recursive functions.
 * Includes both problematic and corrected implementations of factorial calculation.
 */
public class FactorialCalculator {

    /**
     * Problematic implementation with missing base case.
     * This will cause a StackOverflowError due to infinite recursion.
     */
    public static int calculateFactorialBuggy(int num) {
        // BUG: Missing base case
        return num * calculateFactorialBuggy(num - 1);
    }

    /**
     * Fixed implementation with proper base case.
     */
    public static int calculateFactorialFixed(int num) {
        // FIXED: Added base case
        if (num == 0 || num == 1) {
            return 1;
        }
        return num * calculateFactorialFixed(num - 1);
    }

    /**
     * Enhanced implementation with input validation and overflow checking.
     */
    public static long calculateFactorialEnhanced(int num) {
        // Input validation
        if (num < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        }
        if (num > 20) {
            throw new IllegalArgumentException("Input too large, would cause overflow");
        }

        // Base case
        if (num == 0 || num == 1) {
            return 1;
        }

        // Recursive case with overflow checking
        long result = num * calculateFactorialEnhanced(num - 1);
        if (result < 0) {
            throw new ArithmeticException("Factorial calculation caused overflow");
        }

        return result;
    }

    /**
     * Iterative implementation as an alternative to recursion.
     * Demonstrates an alternative approach that avoids stack overflow.
     */
    public static long calculateFactorialIterative(int num) {
        if (num < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        }
        if (num > 20) {
            throw new IllegalArgumentException("Input too large, would cause overflow");
        }

        long result = 1;
        for (int i = 2; i <= num; i++) {
            result *= i;
            if (result < 0) {
                throw new ArithmeticException("Factorial calculation caused overflow");
            }
        }
        return result;
    }

    public static void demonstrateFactorialCalculations() {
        System.out.println("Demonstrating Factorial Calculations\n");

        // Test cases
        int[] testNumbers = {5, 0, 10, 20};

        for (int num : testNumbers) {
            System.out.println("Testing factorial of " + num + ":");

            // Try buggy version
            System.out.println("  Buggy version:");
            try {
                int resultBuggy = calculateFactorialBuggy(num);
                System.out.println("    Result: " + resultBuggy);
            } catch (StackOverflowError e) {
                System.out.println("    Error: Stack overflow due to infinite recursion");
            }

            // Try fixed version
            System.out.println("  Fixed version:");
            try {
                int resultFixed = calculateFactorialFixed(num);
                System.out.println("    Result: " + resultFixed);
            } catch (Exception e) {
                System.out.println("    Error: " + e.getMessage());
            }

            // Try enhanced version
            System.out.println("  Enhanced version:");
            try {
                long resultEnhanced = calculateFactorialEnhanced(num);
                System.out.println("    Result: " + resultEnhanced);
            } catch (Exception e) {
                System.out.println("    Error: " + e.getMessage());
            }

            // Try iterative version
            System.out.println("  Iterative version:");
            try {
                long resultIterative = calculateFactorialIterative(num);
                System.out.println("    Result: " + resultIterative);
            } catch (Exception e) {
                System.out.println("    Error: " + e.getMessage());
            }

            System.out.println();
        }

        // Test error cases
        System.out.println("Testing error cases:");
        
        // Test negative number
        try {
            calculateFactorialEnhanced(-1);
        } catch (Exception e) {
            System.out.println("  Negative number: " + e.getMessage());
        }

        // Test overflow
        try {
            calculateFactorialEnhanced(21);
        } catch (Exception e) {
            System.out.println("  Large number: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        demonstrateFactorialCalculations();
    }
}

