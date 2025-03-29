// orders-service.js
const { Pool } = require('pg');

// Database connection configuration should be loaded from environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function getCustomerOrderDetails(customerId, startDate, endDate) {
  console.time('orderQueryTime');

  try {
    // Query to get all order details for a customer with performance optimization
    const result = await pool.query(`
      SELECT 
        o.order_id,
        o.order_date,
        oi.product_id,
        p.product_name,
        oi.quantity,
        oi.unit_price
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      INNER JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_id = $1
      AND o.order_date BETWEEN $2 AND $3
      -- Add index on customer_id and order_date for better performance
    `, [customerId, startDate, endDate]);

    console.timeEnd('orderQueryTime');
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

module.exports = {
  getCustomerOrderDetails
};

