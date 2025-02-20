class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        // Check for empty or null input
        if (!orders || orders.length === 0) {
            return 0;
        }

        // Sort orders by deadline
        orders.sort((a, b) => a[1] - b[1]);

        // Initialize current time and completed orders count
        let currentTime = 0;
        let completedOrders = 0;

        // Iterate through sorted orders
        for (let i = 0; i < orders.length; i++) {
            // Check if the order can be completed within its deadline
            if (currentTime + orders[i][0] <= orders[i][1]) {
                // Increment current time by preparation time
                currentTime += orders[i][0];
                // Increment completed orders count
                completedOrders++;
            } else {
                // If any order has a preparation time greater than its delivery deadline, return -1
                if (orders[i][0] > orders[i][1]) {
                    return -1;
                }
            }
        }

        // Return the maximum number of orders that can be completed within their deadlines
        return completedOrders;
    }
}
module.exports = { CafeOrderScheduling };