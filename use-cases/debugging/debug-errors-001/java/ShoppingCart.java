package ai.use.cases.debugging.examples;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Example class demonstrating common debugging scenarios in shopping cart implementation.
 * Includes both problematic and properly implemented versions.
 */
public class ShoppingCart {
    private static final Logger logger = Logger.getLogger(ShoppingCart.class.getName());

    // Product class for demonstration
    public static class Product {
        private String name;
        private double price;
        private int quantity;

        public Product(String name, double price) {
            this.name = name;
            this.price = price;
            this.quantity = 1;
        }

        public String getName() { return name; }
        public double getPrice() { return price; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    /**
     * Problematic implementation that can cause NullPointerException.
     */
    public static class BuggyCart {
        private List<Product> items;

        // BUG: No initialization of items list
        public BuggyCart() {
            // Missing: items = new ArrayList<>();
        }

        public void addItem(Product product) {
            // Will throw NullPointerException since items is null
            items.add(product);
        }

        public double calculateTotal() {
            double total = 0;
            // Will throw NullPointerException since items is null
            for (Product item : items) {
                total += item.getPrice() * item.getQuantity();
            }
            return total;
        }
    }

    /**
     * Fixed implementation with proper initialization.
     */
    public static class FixedCart {
        private final List<Product> items;

        public FixedCart() {
            // FIXED: Initialize the items list
            this.items = new ArrayList<>();
        }

        public void addItem(Product product) {
            items.add(product);
        }

        public double calculateTotal() {
            return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        }
    }

    /**
     * Enhanced implementation with validation, error handling, and thread safety.
     */
    public static class EnhancedCart {
        private final List<Product> items;
        private static final int MAX_ITEMS = 50;

        public EnhancedCart() {
            // Use synchronized list for thread safety
            this.items = Collections.synchronizedList(new ArrayList<>());
        }

        public void addItem(Product product) {
            validateProduct(product);
            
            synchronized (items) {
                if (items.size() >= MAX_ITEMS) {
                    throw new IllegalStateException("Cart is full (max " + MAX_ITEMS + " items)");
                }

                // Check if product already exists
                Optional<Product> existingProduct = items.stream()
                    .filter(p -> p.getName().equals(product.getName()))
                    .findFirst();

                if (existingProduct.isPresent()) {
                    // Update quantity instead of adding new item
                    Product existing = existingProduct.get();
                    existing.setQuantity(existing.getQuantity() + product.getQuantity());
                    logger.info("Updated quantity for product: " + product.getName());
                } else {
                    items.add(product);
                    logger.info("Added new product to cart: " + product.getName());
                }
            }
        }

        private void validateProduct(Product product) {
            if (product == null) {
                throw new IllegalArgumentException("Product cannot be null");
            }
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Product must have a name");
            }
            if (product.getPrice() < 0) {
                throw new IllegalArgumentException("Product price cannot be negative");
            }
            if (product.getQuantity() < 1) {
                throw new IllegalArgumentException("Product quantity must be at least 1");
            }
        }

        public void removeItem(String productName) {
            if (productName == null || productName.trim().isEmpty()) {
                throw new IllegalArgumentException("Product name cannot be null or empty");
            }

            synchronized (items) {
                boolean removed = items.removeIf(p -> p.getName().equals(productName));
                if (removed) {
                    logger.info("Removed product from cart: " + productName);
                } else {
                    logger.warning("Product not found in cart: " + productName);
                }
            }
        }

        public void updateQuantity(String productName, int newQuantity) {
            if (newQuantity < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }

            synchronized (items) {
                items.stream()
                    .filter(p -> p.getName().equals(productName))
                    .findFirst()
                    .ifPresentOrElse(
                        product -> {
                            product.setQuantity(newQuantity);
                            logger.info("Updated quantity for product: " + productName);
                        },
                        () -> {
                            logger.warning("Product not found: " + productName);
                            throw new IllegalArgumentException("Product not found in cart");
                        }
                    );
            }
        }

        public double calculateTotal() {
            synchronized (items) {
                return items.stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
            }
        }

        public List<Product> getItems() {
            // Return unmodifiable copy of the items list
            synchronized (items) {
                return Collections.unmodifiableList(new ArrayList<>(items));
            }
        }

        public void clear() {
            synchronized (items) {
                items.clear();
                logger.info("Cart cleared");
            }
        }
    }

    public static void demonstrateShoppingCart() {
        System.out.println("\nDemonstrating Shopping Cart Implementations\n");

        // Test data
        Product laptop = new Product("Laptop", 999.99);
        Product mouse = new Product("Mouse", 29.99);

        // Test buggy version
        System.out.println("Testing buggy version (will throw NullPointerException):");
        try {
            BuggyCart buggyCart = new BuggyCart();
            buggyCart.addItem(laptop);
            System.out.println("Total: $" + buggyCart.calculateTotal());
        } catch (Exception e) {
            System.out.println("Error in buggy version: " + e.getMessage());
        }

        // Test fixed version
        System.out.println("\nTesting fixed version:");
        try {
            FixedCart fixedCart = new FixedCart();
            fixedCart.addItem(laptop);
            fixedCart.addItem(mouse);
            System.out.println("Total: $" + fixedCart.calculateTotal());
        } catch (Exception e) {
            System.out.println("Error in fixed version: " + e.getMessage());
        }

        // Test enhanced version
        System.out.println("\nTesting enhanced version:");
        try {
            EnhancedCart enhancedCart = new EnhancedCart();
            
            // Add items
            enhancedCart.addItem(laptop);
            enhancedCart.addItem(mouse);
            System.out.println("Initial total: $" + enhancedCart.calculateTotal());

            // Update quantity
            enhancedCart.updateQuantity("Laptop", 2);
            System.out.println("Total after quantity update: $" + enhancedCart.calculateTotal());

            // Remove item
            enhancedCart.removeItem("Mouse");
            System.out.println("Total after removing mouse: $" + enhancedCart.calculateTotal());

            // Test validation
            try {
                enhancedCart.addItem(null);
            } catch (IllegalArgumentException e) {
                System.out.println("Validation caught null product: " + e.getMessage());
            }

            // Clear cart
            enhancedCart.clear();
            System.out.println("Total after clearing cart: $" + enhancedCart.calculateTotal());

        } catch (Exception e) {
            System.out.println("Error in enhanced version: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        demonstrateShoppingCart();
    }
}

