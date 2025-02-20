class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        // Handle edge cases
        if (!orders || orders.length === 0) {
            return 0;
        }

        // Validate input
        for (let order of orders) {
            if (order[0] > order[1]) {
                return -1; // Preparation time greater than deadline
            }
        }

        // Sort orders by deadline
        orders.sort((a, b) => a[1] - b[1]);

        let currentTime = 0;
        let maxOrders = 0;
        let priorityQueue = []; // Store preparation times

        for (let order of orders) {
            const prepTime = order[0];
            const deadline = order[1];

            // Add current order's prep time
            priorityQueue.push(prepTime);
            currentTime += prepTime;

            // If current time exceeds deadline, try to remove the longest preparation time
            while (currentTime > deadline && priorityQueue.length > 0) {
                // Find and remove the maximum preparation time
                let maxPrepIndex = 0;
                for (let i = 1; i < priorityQueue.length; i++) {
                    if (priorityQueue[i] > priorityQueue[maxPrepIndex]) {
                        maxPrepIndex = i;
                    }
                }
                currentTime -= priorityQueue[maxPrepIndex];
                priorityQueue.splice(maxPrepIndex, 1);
            }

            // If we can't meet the deadline even after removing orders, return -1
            if (currentTime > deadline) {
                return -1;
            }

            // Update maximum orders if current schedule is valid
            maxOrders = Math.max(maxOrders, priorityQueue.length);
        }

        return maxOrders;
    }
}

module.exports = { CafeOrderScheduling };