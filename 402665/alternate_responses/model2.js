class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        // Handle edge cases
        if (!orders || orders.length === 0) {
            return 0;
        }

        // Check for invalid input (prep time > deadline)
        for (let order of orders) {
            if (order[0] > order[1]) {
                return -1;
            }
        }

        // Sort orders by deadline
        orders.sort((a, b) => a[1] - b[1]);

        let currentTime = 0;
        let completedOrders = 0;

        // Process each order
        for (let order of orders) {
            const prepTime = order[0];
            const deadline = order[1];

            // If order can be completed before deadline
            if (currentTime + prepTime <= deadline) {
                currentTime += prepTime;
                completedOrders++;
            }
        }

        return completedOrders;
    }
}

module.exports = { CafeOrderScheduling };