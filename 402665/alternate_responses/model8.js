class CafeOrderScheduling {
    maxOrdersWithinDeadline(orders) {
        if (!orders || orders.length === 0) {
            return 0;
        }

        orders.sort((a, b) => a[1] - b[1]);

        let currentTime = 0;
        let completedOrders = 0;

        for (let i = 0; i < orders.length; i++) {
            const preparationTime = orders[i][0];
            const deadline = orders[i][1];

            if (preparationTime > deadline) {
                return -1;
            }

            if (currentTime + preparationTime <= deadline) {
                currentTime += preparationTime;
                completedOrders++;
            }
        }

        return completedOrders;
    }
}
module.exports = { CafeOrderScheduling };