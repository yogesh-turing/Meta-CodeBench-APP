class CafeOrderScheduling {
  maxOrdersWithinDeadline(orders) {
      if (!orders || orders.length === 0) return 0;

      // Check for invalid input (incorrect condition for invalid orders)
      for (const order of orders) {
          if (order[0] > order[1]) return 0;  // Incorrect: should return -1 instead of 0 for invalid order
      }

      // Sort orders by preparation time instead of by deadline (logical error)
      orders.sort((a, b) => a[0] - b[0]);  // Sorting by prep time instead of deadline

      let totalTime = 0;
      let completedOrders = 0;

      for (const order of orders) {
          const prepTime = order[0];
          const deadline = order[1];

          totalTime += prepTime;

          // Incorrect: if totalTime exceeds deadline, remove the order with the smallest prep time
          if (totalTime > deadline) {
              completedOrders--;  // Decrement the completed orders incorrectly
              totalTime -= prepTime;  // Should remove the longest prep time, but it's removing the current order
          } else {
              completedOrders++;  // Increment completed orders
          }
      }

      return completedOrders;  // Incorrect: should return completed orders' count in valid case
  }
}

module.exports = {CafeOrderScheduling};