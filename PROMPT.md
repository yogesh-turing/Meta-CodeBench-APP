Base Code:
```javascript
const fs = require('fs');
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

function processOrder(orderId, callback) {
  console.log(`Processing order: ${orderId}`);
  
  // Step 1: Fetch order details
  fetchData(`https://api.example.com/orders/${orderId}`)
    .then(response => response.data)
    .then(order => {
      console.log('Order details fetched:', order);

      // Step 2: Validate order
      setTimeout(() => {
        if (!order || !order.items || order.items.length === 0) {
          return callback(new Error('Invalid order data.'));
        }
        console.log('Order validated.');

        // Step 3: Fetch customer details
        fetchData(`https://api.example.com/customers/${order.customerId}`)
          .then(response => response.data)
          .then(customer => {
            console.log('Customer details fetched:', customer);

            // Step 4: Check customer credit
            setTimeout(() => {
              if (customer.credit < order.totalPrice) {
                return callback(new Error('Insufficient credit.'));
              }
              console.log('Customer has sufficient credit.');

              // Step 5: Reserve inventory
              setTimeout(() => {
                console.log('Inventory reserved.');

                // Step 6: Save order to file
                fs.writeFile(`order_${orderId}.json`, JSON.stringify(order), (err) => {
                  if (err) {
                    return callback(err);
                  }
                  console.log('Order saved to file.');

                  // Final Step: Mark order as completed
                  fetchData(`https://api.example.com/orders/${orderId}/complete`, { method: 'POST' })
                    .then(() => {
                      console.log('Order marked as completed.');
                      callback(null, 'Order processing completed successfully!');
                    })
                    .catch(callback);
                });
              }, 1000);
            }, 1000);
          })
          .catch(callback);
      }, 1000);
    })
    .catch(callback);
}


module.exports = {
    processOrder
};
```

Prompt:

Please help to refactor the function `processOrder`:
- Refactor the processOrder function to improve readability and remove the nested callback structure.
- Use modern JavaScript features like Promises and async/await.
- Add proper error handling at each step.
- Make sure that the refactored function/module produces the same output as the original.
- The refactored code should be understandable and maintainable.
