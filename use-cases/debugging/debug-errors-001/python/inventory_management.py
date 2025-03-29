class InventoryManager:
    """
    Example class demonstrating common debugging scenarios in inventory management.
    Includes both problematic and corrected implementations.
    """

    @staticmethod
    def print_inventory_report_buggy(items):
        """
        Problematic implementation with an off-by-one error.
        This will raise an IndexError when accessing items[i] due to range(len(items) + 1).
        """
        print("===== INVENTORY REPORT (Buggy Version) =====")
        try:
            # Error occurs in this loop - classic off-by-one error
            for i in range(len(items) + 1):  # BUG: Notice the + 1 here
                print(f"Item {i+1}: {items[i]['name']} - Quantity: {items[i]['quantity']}")
        except IndexError as e:
            print(f"Error: {e}")
            print("This error occurred due to an off-by-one bug in the loop range")
        print("============================")

    @staticmethod
    def print_inventory_report_fixed(items):
        """
        Corrected implementation that properly iterates through the items list.
        """
        print("===== INVENTORY REPORT (Fixed Version) =====")
        for i in range(len(items)):  # FIXED: Removed the + 1
            print(f"Item {i+1}: {items[i]['name']} - Quantity: {items[i]['quantity']}")
        print("============================")

    @staticmethod
    def print_inventory_report_enhanced(items):
        """
        Enhanced implementation with additional error checking and formatting.
        """
        print("===== INVENTORY REPORT (Enhanced Version) =====")
        if not items:
            print("No items in inventory!")
            return

        # Print header with total item count
        print(f"Total Items: {len(items)}")
        print("-------------------")

        # Use enumeration for cleaner iteration
        for i, item in enumerate(items, 1):
            try:
                print(f"Item {i}: {item['name']} - Quantity: {item['quantity']}")
            except KeyError as e:
                print(f"Error in item {i}: Missing required field {e}")
            except Exception as e:
                print(f"Unexpected error processing item {i}: {e}")

        # Print summary
        total_quantity = sum(item.get('quantity', 0) for item in items)
        print("-------------------")
        print(f"Total Quantity: {total_quantity}")
        print("============================")

def demonstrate_inventory_management():
    """
    Demonstrates the different implementations and their behavior.
    """
    items = [
        {"name": "Laptop", "quantity": 15},
        {"name": "Mouse", "quantity": 30},
        {"name": "Keyboard", "quantity": 25}
    ]

    print("\nDemonstrating buggy version (will show error):")
    InventoryManager.print_inventory_report_buggy(items)

    print("\nDemonstrating fixed version:")
    InventoryManager.print_inventory_report_fixed(items)

    print("\nDemonstrating enhanced version:")
    InventoryManager.print_inventory_report_enhanced(items)

    # Demonstrate error handling with malformed data
    malformed_items = [
        {"name": "Laptop", "quantity": 15},
        {"quantity": 30},  # Missing name
        {"name": "Keyboard"}  # Missing quantity
    ]

    print("\nDemonstrating enhanced version with malformed data:")
    InventoryManager.print_inventory_report_enhanced(malformed_items)

if __name__ == "__main__":
    demonstrate_inventory_management()

