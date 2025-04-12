# Inventory Analyzer - Performance Optimization Challenge

## Project Context
ShopSmart is an e-commerce platform that helps small retailers manage their inventory and create product bundles for their customers. The platform allows retailers to create product pairs that match specific price points for promotional campaigns.

## Feature Context
The Product Combination Finder is a feature that:
- Identifies pairs of products that can be bundled at specific price points
- Helps retailers create "Complete the Look" suggestions based on customer selections
- Supports seasonal promotion planning by finding complementary product pairs
- Assists inventory managers in identifying upselling opportunities

## Technical Context
- The system processes over 5,000 inventory items on average
- Performance is becoming an issue as retailer catalogs grow
- The algorithm currently takes 20-30 seconds to complete for larger inventories
- Users expect the combination finder to return results in under 3 seconds
- The algorithm is used both in the admin interface and in real-time on customer-facing pages

## User Stories
1. As a marketing manager, I want to quickly find product pairs that add up to a target price point for my "Bundle & Save" promotion
2. As a merchandiser, I want to identify complementary products within a price range to show "Frequently Bought Together" recommendations
3. As an inventory manager, I want to find product combinations that help clear slow-moving stock
4. As a customer, I want to see product pairing suggestions when viewing items on the website

## System Requirements
- Python 3.8+
- Required libraries: time, random
- For testing improvements: pytest

## Connection Pool Example (connection_pool.py)

Demonstrates efficient database connection management with performance monitoring.

### Features
- Configurable pool size and timeout settings
- Connection reuse and management
- Performance monitoring and logging
- Support for multiple database types

### Usage
```python
pool = DatabaseConnectionPool(
    db_type='postgresql',
    host='localhost',
    port=5432,
    username='user',
    password='password',
    database='app_db',
    pool_size=10
)

# Get connection
connection = pool.get_connection()

# Release connection
pool.release_connection(connection)
```
