const fs = require('fs').promises;
const axios = require('axios');

async function fetchData(url, method = 'GET') {
  try {
    const response = await axios({ method, url });
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
  console.log('Order validated.');
}

async function checkCustomerCredit(customer, order) {
  if (customer.credit < order.totalPrice) {
    throw new Error('Insufficient credit.');
  }
  console.log('Customer has sufficient credit.');
}

async function reserveInventory() {
  console.log('Inventory reserved.');
}

async function saveOrderToFile(order, orderId) {
  try {
    await fs.writeFile(`order_${orderId}.json`, JSON.stringify(order));
    console.log('Order saved to file.');
  } catch (error) {
    throw new Error('Failed to save order to file:', error);
  }
}

async function markOrderAsCompleted(orderId) {
  try {
    await fetchData(`https://api.example.com/orders/${orderId}/complete`, 'POST');
    console.log('Order marked as completed.');
  } catch (error) {
    throw new Error('Failed to mark order as completed:', error);
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

    // Step 3: Fetch customer details
    const customer = await fetchData(`https://api.example.com/customers/${order.customerId}`);
    console.log('Customer details fetched:', customer);

    // Step 4: Check customer credit
    await checkCustomerCredit(customer, order);

    // Step 5: Reserve inventory
    await reserveInventory();

    // Step 6: Save order to file
    await saveOrderToFile(order, orderId);

    // Final Step: Mark order as completed
    await markOrderAsCompleted(orderId);

    return 'Order processing completed successfully!';
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

module.exports = {
  processOrder
};