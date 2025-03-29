# Python Performance Examples

This directory contains two Python examples demonstrating performance optimization techniques:
1. Database Connection Pool Management
2. Inventory Analysis Algorithm

## Prerequisites
- Python 3.7 or higher
- `psutil` for memory monitoring
- `cProfile` for performance profiling

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

## Inventory Analysis Example (inventory_analysis.py)

Demonstrates algorithm optimization for product combination analysis.

### Features
- Product pairing algorithm
- Price range matching
- Performance optimization for large datasets

### Usage
```python
products = [
    {"id": 1, "name": "Product A", "price": 100},
    {"id": 2, "name": "Product B", "price": 150},
    # ...
]

combinations = find_product_combinations(
    products,
    target_price=250,
    price_margin=10
)
```

## Performance Profiling

### Using cProfile
```bash
# Profile connection pool
python -m cProfile -o pool_profile.stats connection_pool.py

# Profile inventory analysis
python -m cProfile -o inventory_profile.stats inventory_analysis.py
```

### Using Memory Profiler
```bash
pip install memory_profiler
python -m memory_profiler connection_pool.py
```

## Performance Optimization Tips

### Connection Pool
1. Optimize pool size based on workload
2. Implement connection timeout handling
3. Monitor connection acquisition times
4. Handle connection leaks

### Inventory Analysis
1. Use appropriate data structures
2. Implement early termination conditions
3. Consider parallel processing for large datasets
4. Optimize memory usage for large product lists

## Monitoring and Debugging

### Connection Pool Metrics
- Active connections count
- Pool utilization
- Connection acquisition time
- Connection lifetime

### Algorithm Performance
- Execution time
- Memory usage
- CPU utilization
- Cache efficiency

## Best Practices
- Implement proper error handling
- Add comprehensive logging
- Monitor resource usage
- Use appropriate timeout values
- Implement circuit breakers for database connections

## Optimization Strategies
1. Connection pooling
   - Reuse connections
   - Implement max lifetime
   - Monitor pool health

2. Algorithm optimization
   - Use efficient data structures
   - Implement caching where appropriate
   - Consider batch processing
   - Optimize search patterns

