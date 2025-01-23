const fs = require('fs');
const util = require('util');
const axios = require('axios');

const writeFileAsync = util.promisify(fs.writeFile);

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response;
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

async function checkCustomerCredit(customer, orderTotal) {
    if (customer.credit < orderTotal) {
        throw new Error('Insufficient credit.');
    }
    console.log('Customer has sufficient credit.');
}

async function reserveInventory() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Inventory reserved.');
}

async function saveOrderToFile(orderId, order) {
    await writeFileAsync(`order_${orderId}.json`, JSON.stringify(order));
    console.log('Order saved to file.');
}

async function markOrderComplete(orderId) {
    await fetchData(`https://api.example.com/orders/${orderId}/complete`, { method: 'POST' });
    console.log('Order marked as completed.');
}

async function processOrder(orderId) {
    try {
        console.log(`Processing order: ${orderId}`);

        // Step 1: Fetch order details
        const orderResponse = await fetchData(`https://api.example.com/orders/${orderId}`);
        const order = orderResponse.data;
        console.log('Order details fetched:', order);

        // Step 2: Validate order
        await new Promise(resolve => setTimeout(resolve, 1000));
        await validateOrder(order);

        // Step 3: Fetch customer details
        const customerResponse = await fetchData(`https://api.example.com/customers/${order.customerId}`);
        const customer = customerResponse.data;
        console.log('Customer details fetched:', customer);

        // Step 4: Check customer credit
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkCustomerCredit(customer, order.totalPrice);

        // Step 5: Reserve inventory
        await reserveInventory();

        // Step 6: Save order to file
        await saveOrderToFile(orderId, order);

        // Final Step: Mark order as completed
        await markOrderComplete(orderId);

        return 'Order processing completed successfully!';
    } catch (error) {
        console.error('Error processing order:', error);
        throw error;
    }
}

module.exports = { processOrder };