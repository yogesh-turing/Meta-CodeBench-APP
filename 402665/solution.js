class CafeOrderScheduling {
  maxOrdersWithinDeadline(orders) {
      if (!orders || orders.length === 0) return 0;

      // Check for invalid input: mismatched row lengths
      const rowLength = orders[0].length;
      for (const order of orders) {
          if (order.length !== rowLength) return -1; // Return -1 if any row length differs
      }

      // Check for invalid orders (prep time greater than deadline)
      for (const order of orders) {
          if (order[0] > order[1]) return -1;  // Invalid order (prep time > deadline)
      }

      // Sort orders by deadline
      orders.sort((a, b) => a[1] - b[1]);  // Sort by deadline, not by prep time

      let totalTime = 0;
      let completedOrders = 0;

      for (const order of orders) {
          const prepTime = order[0];
          const deadline = order[1];

          // Check if the total time + the current preparation time is within the deadline
          if (totalTime + prepTime <= deadline) {
              totalTime += prepTime;
              completedOrders++;  // Increment if the total time doesn't exceed the deadline
          }
      }

      return completedOrders;
  }
}

module.exports = {CafeOrderScheduling};