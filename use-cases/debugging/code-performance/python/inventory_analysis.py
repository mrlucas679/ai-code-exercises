def find_product_combinations(products, target_price, price_margin=10):
    """
    Find all pairs of products where the combined price is within
    the target_price ± price_margin range.

    Args:
        products: List of dictionaries with 'id', 'name', and 'price' keys
        target_price: The ideal combined price
        price_margin: Acceptable deviation from the target price

    Returns:
        List of dictionaries with product pairs and their combined price
    """
    results = []

    # For each possible pair of products
    for i in range(len(products)):
        for j in range(len(products)):
            if i != j:  # Don't pair a product with itself
                product1 = products[i]
                product2 = products[j]
                combined_price = product1['price'] + product2['price']
                
                # Check if the combined price is within the acceptable range
                if abs(combined_price - target_price) <= price_margin:
                    results.append({
                        'product1': product1,
                        'product2': product2,
                        'combined_price': combined_price
                    })
    
    return results

