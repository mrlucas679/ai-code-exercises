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
            # Skip comparing a product with itself
            if i != j:
                product1 = products[i]
                product2 = products[j]

                # Calculate combined price
                combined_price = product1['price'] + product2['price']

                # Check if the combined price is within the target range
                if (target_price - price_margin) <= combined_price <= (target_price + price_margin):
                    # Avoid duplicates like (product1, product2) and (product2, product1)
                    if not any(r['product1']['id'] == product2['id'] and
                               r['product2']['id'] == product1['id'] for r in results):

                        pair = {
                            'product1': product1,
                            'product2': product2,
                            'combined_price': combined_price,
                            'price_difference': abs(target_price - combined_price)
                        }
                        results.append(pair)

    # Sort by price difference from target
    results.sort(key=lambda x: x['price_difference'])
    return results