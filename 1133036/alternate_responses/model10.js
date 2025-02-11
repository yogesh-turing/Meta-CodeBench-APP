class TradingPlatform {
    constructor() {
      this.orderBook = this.initializeOrderBook();
      this.tradeIdCounter = 0;
    }
  
    validateRefactorOutput(originalOutput, refactoredOutput) {
      if (!this.deepEqual(originalOutput, refactoredOutput)) {
        throw new Error("Refactored version does not match expected output");
      }
    }
  
    deepEqual(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
  
    initializeOrderBook() {
      return { buy: [], sell: [], history: [] };
    }
  
    placeOrder(order) {
      if (!this.validateOrder(order)) {
        throw new Error("Invalid order");
      }
  
      if (order.type === "market") {
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
  
        this.processTrade(order, bestOrder, tradeAmount);
        trades.push({
          price: bestOrder.price,
          amount: tradeAmount,
          time: new Date().toISOString(),
          tradeId: this.generateTradeId(),
        });
  
        bestOrder.amount -= tradeAmount;
        remainingAmount -= tradeAmount;
  
        if (bestOrder.amount === 0) orderBookSide.shift();
      }
  
      if (remainingAmount > 0) {
        console.warn(`Market order partially filled: ${remainingAmount} units remaining`);
      }
  
      this.orderBook.history.push(...trades);
      return { orderBook: this.orderBook, trades };
    }
  
    addLimitOrder(order) {
      this.orderBook[order.side].push({ ...order, timestamp: Date.now(), orderId: this.generateOrderId() });
      this.orderBook[order.side].sort((a, b) => {
        if (a.price === b.price) {
          return a.timestamp - b.timestamp;
        }
        return order.side === "buy" ? b.price - a.price : a.price - b.price;
      });
      return this.orderBook;
    }
  
    processTrade(buyer, seller, amount) {
      console.log(`[${new Date().toISOString()}] Trade executed: ${amount} units at ${seller.price}`);
    }
  
    handlePriceChange(newPrice) {
      this.orderBook.sell = this.orderBook.sell.filter(order => order.price <= newPrice);
      this.orderBook.buy = this.orderBook.buy.filter(order => order.price >= newPrice);
      return this.orderBook;
    }
  
    validateOrder(order) {
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
  
    generateTradeId() {
      return `trade-${this.tradeIdCounter++}`;
    }
  
    generateOrderId() {
      return `order-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
  }
  
  module.exports = TradingPlatform;