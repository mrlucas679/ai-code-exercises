# Inventory Report Generator - Debugging Challenge

## Project Context
InventTrack is a simple inventory management system used by small businesses to track their product stock. The system generates inventory reports that show the current quantity of products in stock.

## Feature Context
The Inventory Report Generator is a command-line tool that:
- Takes a collection of inventory items
- Produces a formatted text report showing each item and its quantity
- Is used by warehouse staff to verify stock levels
- Prints reference numbers for each item to make stocktaking easier

## Technical Context
- Simple Python script without external dependencies
- Used in a production environment by multiple users
- Reports should correctly list all items without errors
- System requirements include Python 3.6 or higher

## Error Context
- The application is crashing with an IndexError
- Specifically, the error message shows: "list index out of range"
- The error occurs in the report printing loop
- The stacktrace shows that the error happens in the print_inventory_report function

## User Stories
1. As a warehouse manager, I want to generate accurate inventory reports
2. As a stocktaker, I need numbered items on the report to check off items as I count them
3. As an inventory clerk, I need to trust that the report shows all items without errors
4. As a business owner, I want the system to be reliable and error-free

## System Requirements
- Python 3.6+
- No additional dependencies