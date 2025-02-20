class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        // Handle empty or null input
        if (!orders || orders.length === 0) {
            return 0;
        }

        // Validate preparation times against deadlines
        for (let order of orders) {
            if (order[0] > order[1]) {
                return -1;  // Invalid case: prep time > deadline
            }
        }

        // Sort orders by deadline (ascending)
        orders.sort((a, b) => a[1] - b[1]);

        let currentTime = 0;
        let completedOrders = 0;

        for (let order of orders) {
            const prepTime = order[0];
            const deadline = order[1];

            // Check if order can be completed before deadline
            if (currentTime + prepTime <= deadline) {
                currentTime += prepTime;
                completedOrders++;
            }
        }

        return completedOrders;
    }
}

module.exports = { CafeOrderScheduling };