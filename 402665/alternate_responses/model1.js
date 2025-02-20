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

        // Array to store selected orders' preparation times
        let selectedOrders = [];
        let currentTime = 0;

        for (let order of orders) {
            const prepTime = order[0];
            const deadline = order[1];

            // If we can add this order within deadline
            if (currentTime + prepTime <= deadline) {
                selectedOrders.push(prepTime);
                currentTime += prepTime;
            } else if (selectedOrders.length > 0) {
                // Find the maximum preparation time among selected orders
                let maxPrepIndex = 0;
                for (let i = 1; i < selectedOrders.length; i++) {
                    if (selectedOrders[i] > selectedOrders[maxPrepIndex]) {
                        maxPrepIndex = i;
                    }
                }

                // If current order has less prep time than the maximum selected
                if (prepTime < selectedOrders[maxPrepIndex]) {
                    // Replace the order with maximum prep time
                    currentTime = currentTime - selectedOrders[maxPrepIndex] + prepTime;
                    selectedOrders[maxPrepIndex] = prepTime;
                }
            }
        }

        return selectedOrders.length;
    }
}

module.exports = { CafeOrderScheduling };