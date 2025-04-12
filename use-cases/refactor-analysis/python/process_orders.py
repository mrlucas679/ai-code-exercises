def process_orders(orders, inventory, customer_data):
    results = []
    total_revenue = 0
    error_orders = []

    for order in orders:
        # Check if item is in inventory
        item_id = order['item_id']
        quantity = order['quantity']
        customer_id = order['customer_id']

        if item_id not in inventory:
            error_orders.append({'order_id': order['order_id'], 'error': 'Item not in inventory'})
            continue

        # Check if enough quantity available
        if inventory[item_id]['quantity'] < quantity:
            error_orders.append({'order_id': order['order_id'], 'error': 'Insufficient quantity'})
            continue

        # Check if customer exists
        if customer_id not in customer_data:
            error_orders.append({'order_id': order['order_id'], 'error': 'Customer not found'})
            continue

        # Calculate price
        price = inventory[item_id]['price'] * quantity

        # Apply discount if customer is premium
        if customer_data[customer_id]['premium']:
            price = price * 0.9

        # Update inventory
        inventory[item_id]['quantity'] -= quantity

        # Calculate shipping based on customer location
        shipping = 0
        if customer_data[customer_id]['location'] == 'domestic':
            if price < 50:
                shipping = 5.99
        else:
            shipping = 15.99

        # Add tax
        tax = price * 0.08

        # Calculate final price
        final_price = price + shipping + tax

        # Update total revenue
        total_revenue += final_price

        # Create result
        result = {
            'order_id': order['order_id'],
            'item_id': item_id,
            'quantity': quantity,
            'customer_id': customer_id,
            'price': price,
            'shipping': shipping,
            'tax': tax,
            'final_price': final_price
        }

        results.append(result)

    return {
        'processed_orders': results,
        'error_orders': error_orders,
        'total_revenue': total_revenue
    }