/**
 * Returns the maximum number of orders that can be successfully delivered on time.
 * 
 * @param {number} n - The number of orders.
 * @param {number[][]} orders - A 2D array of size n x 2, where each order is given as:
 *                              orders[i][0]: Time required to prepare the i-th order (in minutes).
 *                              orders[i][1]: Latest time by which the i-th order must be delivered (in minutes since the cafe opens).
 * @returns {number} The maximum number of orders that can be successfully delivered on time.
 *                   Returns -1 if any order has a preparation time greater than its delivery deadline.
 *                   Returns 0 if the input is empty or null.
 */
class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        // Check if the input is empty or null
        if (!orders || orders.length === 0) {
            return 0;
        }

        // Sort the orders based on their deadlines
        orders.sort((a, b) => a[1] - b[1]);

        // Initialize a variable to store the current time
        let currentTime = 0;

        // Initialize a variable to store the maximum number of orders that can be delivered on time
        let maxOrders = 0;

        // Iterate over the sorted orders
        for (let i = 0; i < orders.length; i++) {
            // If the preparation time of the current order is greater than its deadline, return -1 as invalid input
            if (orders[i][0] > orders[i][1]) {
                return -1;
            }

            // If the current time plus the preparation time of the current order is less than or equal to its deadline,
            // increment the current time by the preparation time and increment the maximum number of orders
            if (currentTime + orders[i][0] <= orders[i][1]) {
                currentTime += orders[i][0];
                maxOrders++;
            }
        }

        // Return the maximum number of orders that can be delivered on time
        return maxOrders;
    }
}
module.exports={ CafeOrderScheduling };