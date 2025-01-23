const fs = require('fs').promises;
const axios = require('axios');

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function processOrder(orderId) {
    console.log(`Processing order: ${orderId}`);
    
    try {
        // Step 1: Fetch order details
        const orderResponse = await fetchData(`https://api.example.com/orders/${orderId}`);
        const order = orderResponse.data;
        console.log('Order details fetched:', order);

        // Step 2: Validate order
        if (!order || !order.items || order.items.length === 0) {
            throw new Error('Invalid order data.');
        }
        console.log('Order validated.');

        // Step 3: Fetch customer details
        const customerResponse = await fetchData(`https://api.example.com/customers/${order.customerId}`);
        const customer = customerResponse.data;
        console.log('Customer details fetched:', customer);

        // Step 4: Check customer credit
        if (customer.credit < order.totalPrice) {
            throw new Error('Insufficient credit.');
        }
        console.log('Customer has sufficient credit.');

        // Step 5: Reserve inventory
        console.log('Inventory reserved.');

        // Step 6: Save order to file
        await fs.writeFile(`order_${orderId}.json`, JSON.stringify(order));
        console.log('Order saved to file.');

        // Final Step: Mark order as completed
        await axios.post(`https://api.example.com/orders/${orderId}/complete`);
        console.log('Order marked as completed.');
        return 'Order processing completed successfully!';
    } catch (error) {
        console.error('Error processing order:', error);
        throw error;
    }
}

module.exports = {
    processOrder
};