const fs = require('fs').promises;
const axios = require('axios');

async function fetchData(url, method = 'GET') {
  try {
    const response = await axios({
      method,
      url,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function validateOrder(order) {
  if (!order || !order.items || order.items.length === 0) {
    throw new Error('Invalid order data.');
  }
}

async function checkCustomerCredit(customer, order) {
  if (customer.credit < order.totalPrice) {
    throw new Error('Insufficient credit.');
  }
}

async function processOrder(orderId) {
  try {
    console.log(`Processing order: ${orderId}`);

    // Step 1: Fetch order details
    const order = await fetchData(`https://api.example.com/orders/${orderId}`);
    console.log('Order details fetched:', order);

    // Step 2: Validate order
    await validateOrder(order);
    console.log('Order validated.');

    // Step 3: Fetch customer details
    const customer = await fetchData(`https://api.example.com/customers/${order.customerId}`);
    console.log('Customer details fetched:', customer);

    // Step 4: Check customer credit
    await checkCustomerCredit(customer, order);
    console.log('Customer has sufficient credit.');

    // Step 5: Reserve inventory
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Inventory reserved.');

    // Step 6: Save order to file
    await fs.writeFile(`order_${orderId}.json`, JSON.stringify(order));
    console.log('Order saved to file.');

    // Final Step: Mark order as completed
    await fetchData(`https://api.example.com/orders/${orderId}/complete`, 'POST');
    console.log('Order marked as completed.');

    return 'Order processing completed successfully!';
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

module.exports = {
  processOrder,
};