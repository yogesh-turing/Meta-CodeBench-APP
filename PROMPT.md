

Base Code:

```javascript
const moment = require('moment');
const _ = require('lodash');

function processOrders(orders) {
  let results = [];
  orders.forEach(order => {
    let totalAmount = 0;
    let deliveryDates = [];
    order.items.forEach(item => {
      totalAmount += item.price;
      deliveryDates.push(item.deliveryDate);
    });
    let earliestDate = moment.min(deliveryDates.map(date => moment(date)));
    let status = 'Processing';

    if (totalAmount > 1000) {
      status = 'Priority';
    }

    results.push({
      orderId: order.id,
      totalAmount,
      earliestDeliveryDate: earliestDate.format('YYYY-MM-DD'),
      status
    });
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(results);
    }, 1000);
  });
}

module.exports = {
    processOrders
};

```

Prompt:
The function `getWeatherAndNews` fetches weather data and news headlines for a given city. Fetches weather data from https://api.weather.com. Fetches news headlines for the same city from https://api.news.com. Processes the responses and returns an object containing the weather and news data. The function suffers from poor structure, over-reliance on promises, and lack of code reuse.

Please help to refactor the function while maintaining its functionality. 

Consider the following while refactoring the function:
- The function should maintain the same functionality but be cleaner, more maintainable, and efficient.
- Use async/await effectively to handle asynchronous operations.
- Ensure code reuse by abstracting repetitive tasks (e.g., fetching and error handling).
- Make the function testable with Jest.
