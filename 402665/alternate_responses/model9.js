/**
 * CafeOrderScheduling class to find the maximum number of orders that can be completed within their deadlines.
 */
class CafeOrderScheduling {
    /**
     * maxOrdersWithinDeadline function to find the maximum number of orders that can be successfully delivered on time.
     * @param {number} n - The number of orders.
     * @param {number[][]} orders - A 2D array of size n x 2, where each order is given as [preparation time, delivery deadline].
     * @returns {number} The maximum number of orders that can be successfully delivered on time.
     */
    maxOrdersWithinDeadline(orders) {
        // Check if the input is empty or null
        if (!orders || orders.length === 0) {
            return 0;
        }

        // Sort the orders based on their deadlines
        orders.sort((a, b) => a[1] - b[1]);

        // Initialize the current time and the count of delivered orders
        let currentTime = 0;
        let deliveredOrders = 0;

        // Iterate over the sorted orders
        for (let i = 0; i < orders.length; i++) {
            // If the preparation time of the current order is greater than its delivery deadline, return -1 as invalid input
            if (orders[i][0] > orders[i][1]) {
                return -1;
            }

            // If the current time plus the preparation time of the current order does not exceed its delivery deadline, prepare and deliver the order
            if (currentTime + orders[i][0] <= orders[i][1]) {
                currentTime += orders[i][0];
                deliveredOrders++;
            }
        }

        // Return the maximum number of orders that can be successfully delivered on time
        return deliveredOrders;
    }
}

module.exports = { CafeOrderScheduling };