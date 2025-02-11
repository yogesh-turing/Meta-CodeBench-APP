class Order {
    constructor(type, side, price, amount) {
        this.type = type;
        this.side = side;
        this.price = price;
        this.amount = amount;
        this.timestamp = Date.now();
        this.orderId = this.generateRandomId();
    }

    generateRandomId() {
        return Math.random().toString(36).substring(2, 15);
    }

    validate() {
        if (!this.type || !this.side || typeof this.price !== "number" || this.amount <= 0) {
            return false;
        }
        if (this.side !== "buy" && this.side !== "sell") {
            return false;
        }
        if (this.type !== "market" && this.type !== "limit") {
            return false;
        }
        return true;
    }
}

class Trade {
    constructor(price, amount, buyOrder, sellOrder) {
        this.price = price;
        this.amount = amount;
        this.time = new Date().toISOString();
        this.tradeId = Math.random().toString(36).substring(2, 15);
        this.buyOrderId = buyOrder.orderId;
        this.sellOrderId = sellOrder.orderId;
    }
}

class TradingPlatform {
    constructor() {
        this.orderBook = this.initializeOrderBook();
    }

    initializeOrderBook() {
        return {
            buy: [],
            sell: [],
            history: []
        };
    }

    placeOrder(orderData) {
        const order = new Order(orderData.type, orderData.side, orderData.price, orderData.amount);
        
        if (!order.validate()) {
            throw new Error("Invalid order");
        }

        const randomExecutionChance = Math.random();
        if (order.type === "market" && randomExecutionChance > 0.5) {
            return this.executeMarketOrder(order);
        } else if (order.type === "limit") {
            return this.addLimitOrder(order);
        } else {
            this.orderBook.history.push({ ...order, status: "deferred" });
        }
        return this.orderBook;
    }

    executeMarketOrder(order) {
        const oppositeSide = order.side === "buy" ? "sell" : "buy";
        const orderBookSide = this.orderBook[oppositeSide];
        let remainingAmount = order.amount;
        let trades = [];

        while (orderBookSide.length > 0 && remainingAmount > 0) {
            const bestOrder = orderBookSide[0];
            const tradeAmount = Math.min(bestOrder.amount, remainingAmount);

            const trade = new Trade(bestOrder.price, tradeAmount, 
                order.side === "buy" ? order : bestOrder,
                order.side === "sell" ? order : bestOrder
            );

            this.processTrade(trade);
            trades.push(trade);

            bestOrder.amount -= tradeAmount;
            remainingAmount -= tradeAmount;

            if (bestOrder.amount === 0) {
                orderBookSide.shift();
            }
        }

        if (remainingAmount > 0) {
            console.warn(`Market order partially filled: ${remainingAmount} units remaining`);
        }

        this.orderBook.history.push(...trades);
        return { orderBook: this.orderBook, trades };
    }

    addLimitOrder(order) {
        this.orderBook[order.side].push(order);
        this.orderBook[order.side].sort((a, b) => {
            if (a.price === b.price) {
                return a.timestamp - b.timestamp;
            }
            return order.side === "buy" ? b.price - a.price : a.price - b.price;
        });
        return this.orderBook;
    }

    processTrade(trade) {
        console.log(`[${trade.time}] Trade executed: ${trade.amount} units at ${trade.price}`);
    }

    handlePriceChange(newPrice) {
        this.orderBook.sell = this.orderBook.sell.filter(order => order.price <= newPrice);
        this.orderBook.buy = this.orderBook.buy.filter(order => order.price >= newPrice);
        return this.orderBook;
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

module.exports = {
    validateRefactorOutput,
    TradingPlatform,
    Order,
    Trade
};