class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        // Handle edge cases
        if (!orders || orders.length === 0) return 0;
        
        // Validate preparation times against deadlines
        for (let order of orders) {
            if (order[0] > order[1]) return -1;
        }

        // Sort orders by deadline
        orders.sort((a, b) => a[1] - b[1]);
        
        let currentTime = 0;
        let completedOrders = 0;
        let scheduledOrders = [];

        for (let i = 0; i < orders.length; i++) {
            const prepTime = orders[i][0];
            const deadline = orders[i][1];
            
            // Add current order
            scheduledOrders.push(prepTime);
            currentTime += prepTime;
            
            // Sort scheduled orders by preparation time (descending)
            scheduledOrders.sort((a, b) => b - a);
            
            // If current time exceeds deadline, remove the order with longest prep time
            while (currentTime > deadline && scheduledOrders.length > 0) {
                const longestPrepTime = scheduledOrders.shift();
                currentTime -= longestPrepTime;
            }
            
            // If we can't meet the deadline even after removals
            if (currentTime > deadline) {
                return completedOrders;
            }
            
            completedOrders = Math.max(completedOrders, scheduledOrders.length);
        }
        
        return completedOrders;
    }
}

module.exports = { CafeOrderScheduling };