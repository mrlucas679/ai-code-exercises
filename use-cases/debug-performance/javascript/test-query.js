// test-query.js
// Script to test the getCustomerOrderDetails function from orders-service.js
const { getCustomerOrderDetails } = require('./orders-service');

async function testQuery() {
  try {
    console.log('Testing getCustomerOrderDetails function...');
    console.log('Fetching orders for customer ID 1 from 2023-01-01 to 2023-12-31...');
    
    // Call the getCustomerOrderDetails function with sample parameters
    const orders = await getCustomerOrderDetails(1, '2023-01-01', '2023-12-31');
    
    // Display the results
    console.log('\nQuery Results:');
    console.log(`Found ${orders.length} orders for customer ID 1`);
    
    // Format and display each order
    orders.forEach((order, index) => {
      console.log(`\n----- Order ${index + 1} -----`);
      console.log(`Order ID: ${order.order_id}`);
      console.log(`Date: ${order.order_date}`);
      console.log(`Total Amount: $${order.total_amount}`);
      console.log(`Status: ${order.status}`);
      console.log(`Customer: ${order.customer_name} (${order.email})`);
      
      console.log('\nShipping Address:');
      console.log(`${order.street}`);
      console.log(`${order.city}, ${order.state} ${order.postal_code}`);
      console.log(`${order.country}`);
      
      console.log('\nItems:');
      if (order.items) {
        order.items.forEach(item => {
          console.log(`- ${item.product_name} (ID: ${item.product_id})`);
          console.log(`  Quantity: ${item.quantity}, Unit Price: $${item.unit_price}, Subtotal: $${item.subtotal}`);
        });
      } else {
        console.log('No items found for this order');
      }
      
      console.log('\nStatus History:');
      if (order.status_history) {
        order.status_history.forEach(status => {
          console.log(`- ${status.status} (${status.date})`);
          if (status.notes) console.log(`  Notes: ${status.notes}`);
        });
      } else {
        console.log('No status history found for this order');
      }
    });
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Close the connection pool to allow the script to exit
    process.exit(0);
  }
}

// Run the test function
testQuery();