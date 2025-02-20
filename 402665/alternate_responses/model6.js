class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        // Check for invalid or empty input
        if (!orders || orders.length === 0) {
            return 0;
        }

        // Sort orders by their deadlines
        orders.sort((a, b) => a[1] - b[1]);

        // Initialize variables to track time and completed orders
        let currentTime = 0;
        let completedOrders = 0;

        // Iterate through sorted orders
        for (let i = 0; i < orders.length; i++) {
            // If the current order's preparation time exceeds its deadline, return -1
            if (orders[i][0] > orders[i][1]) {
                return -1;
            }

            // If preparing the current order doesn't exceed its deadline, prepare it
            if (currentTime + orders[i][0] <= orders[i][1]) {
                currentTime += orders[i][0];
                completedOrders++;
            }
        }

        // Return the maximum number of orders that can be completed within their deadlines
        return completedOrders;
    }
}
module.exports = { CafeOrderScheduling };