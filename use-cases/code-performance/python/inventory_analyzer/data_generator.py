import random

def generate_product_list(count=5000, min_price=5, max_price=500, seed=None):
    """
    Generate a list of sample products for testing
    
    Args:
        count: Number of products to generate
        min_price: Minimum price for products
        max_price: Maximum price for products
        seed: Random seed for reproducible results
        
    Returns:
        List of product dictionaries
    """
    if seed is not None:
        random.seed(seed)
        
    product_list = []
    for i in range(count):
        product_list.append({
            'id': i,
            'name': f'Product {i}',
            'price': random.randint(min_price, max_price),
            'category': random.choice(['Electronics', 'Clothing', 'Home', 'Books', 'Toys']),
            'in_stock': random.choice([True, True, True, False])  # 75% in stock
        })
    
    return product_list