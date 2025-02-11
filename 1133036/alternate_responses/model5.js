class RandomGenerator {
    static generateId() {
        return Math.random().toString(36).substring(2, 15);
    }

    static executionChance() {
        return Math.random();
    }
}

class Trade {
    constructor(price, amount) {
        this.price = price;
        this.amount = amount;
        this.time = new Date().toISOString();
        this.tradeId = RandomGenerator.generateId();
    }
}

class Order {
    constructor(type, side, price, amount) {
        this.type = type;
        this.side = side;
        this.price = price;
        this.amount = amount;
        this.timestamp = Date.now();
        this.orderId = RandomGenerator.generateId();
    }

    static validate(order) {
        if (!order.type || !order.side || typeof order.price !== "number" || order.amount <= 0) {
            return false;
        }
        if (order.side !== "buy" && order.side !== "sell") {
            return false;
        }
        if (order.type !== "market" && order.type !== "limit") {
            return false;
        }
        return true;
    }
}

class TradeHistory {
    constructor() {
        this.trades = [];
    }

    addTrade(trade) {
        this.trades.push(trade);
    }

    addDeferredOrder(order) {
        this.trades.push({ ...order, status: "deferred" });
    }
}

class OrderBook {
    constructor() {
        this.buy = [];
        this.sell = [];
        this.history = new TradeHistory();
    }

    placeOrder(orderData) {
        if (!Order.validate(orderData)) {
            throw new Error("Invalid order");
        }

        const order = new Order(orderData.type, orderData.side, orderData.price, orderData.amount);
        
        if (order.type === "market" && RandomGenerator.executionChance() > 0.5) {
            return this.executeMarketOrder(order);
        } else if (order.type === "limit") {
            return this.addLimitOrder(order);
        } else {
            this.history.addDeferredOrder(order);
        }
        return this;
    }

    executeMarketOrder(order) {
        const oppositeSide = order.side === "buy" ? "sell" : "buy";
        const orderBookSide = this[oppositeSide];
        let remainingAmount = order.amount;
        let trades = [];

        while (orderBookSide.length > 0 && remainingAmount > 0) {
            const bestOrder = orderBookSide[0];
            const tradeAmount = Math.min(bestOrder.amount, remainingAmount);

            this.processTrade(order, bestOrder, tradeAmount);
            const trade = new Trade(bestOrder.price, tradeAmount);
            trades.push(trade);

            bestOrder.amount -= tradeAmount;
            remainingAmount -= tradeAmount;

            if (bestOrder.amount === 0) orderBookSide.shift();
        }

        if (remainingAmount > 0) {
            console.warn(`Market order partially filled: ${remainingAmount} units remaining`);
        }

        trades.forEach(trade => this.history.addTrade(trade));
        return { orderBook: this, trades };
    }

    addLimitOrder(order) {
        this[order.side].push(order);
        this[order.side].sort((a, b) => {
            if (a.price === b.price) {
                return a.timestamp - b.timestamp;
            }
            return order.side === "buy" ? b.price - a.price : a.price - b.price;
        });
        return this;
    }

    processTrade(buyer, seller, amount) {
        console.log(`[${new Date().toISOString()}] Trade executed: ${amount} units at ${seller.price}`);
    }

    handlePriceChange(newPrice) {
        this.sell = this.sell.filter(order => order.price <= newPrice);
        this.buy = this.buy.filter(order => order.price >= newPrice);
        return this;
    }
}

function validateRefactorOutput(originalOutput, refactoredOutput) {
    if (!deepEqual(originalOutput, refactoredOutput)) {
        throw new Error("Refactored version does not match expected output");
    }
}

function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function initializeOrderBook() {
    return new OrderBook();
}

module.exports = {
    validateRefactorOutput,
    initializeOrderBook,
    placeOrder: (orderBook, order) => orderBook.placeOrder(order),
    executeMarketOrder: (orderBook, order) => orderBook.executeMarketOrder(order),
    addLimitOrder: (orderBook, order) => orderBook.addLimitOrder(order),
    processTrade: (buyer, seller, amount) => orderBook.processTrade(buyer, seller, amount),
    handlePriceChange: (orderBook, newPrice) => orderBook.handlePriceChange(newPrice),
    validateOrder: Order.validate,
    generateRandomId: RandomGenerator.generateId,
};