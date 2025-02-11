function validateRefactorOutput(originalOutput, refactoredOutput) {
    if (!deepEqual(originalOutput, refactoredOutput)) {
      throw new Error("Refactored version does not match expected output");
    }
  }
  
  function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  
  class OrderBook {
    constructor() {
      this.buy = [];
      this.sell = [];
      this.history = [];
      this.deferredOrders = [];
    }
  
    placeOrder(order) {
      if (!validateOrder(order)) {
        throw new Error("Invalid order");
      }
  
      if (order.type === "market") {
        return this.executeMarketOrder(order);
      } else if (order.type === "limit") {
        return this.addLimitOrder(order);
      } else {
        this.deferredOrders.push(order);
        this.history.push({ ...order, status: "deferred" });
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
        trades.push({
          price: bestOrder.price,
          amount: tradeAmount,
          time: new Date().toISOString(),
          tradeId: generateRandomId(),
        });
  
        bestOrder.amount -= tradeAmount;
        remainingAmount -= tradeAmount;
  
        if (bestOrder.amount === 0) orderBookSide.shift();
      }
  
      if (remainingAmount > 0) {
        console.warn(`Market order partially filled: ${remainingAmount} units remaining`);
      }
  
      this.history.push(...trades);
      return { orderBook: this, trades };
    }
  
    addLimitOrder(order) {
      this[order.side].push({ ...order, timestamp: Date.now(), orderId: generateRandomId() });
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
  
    executeDeferredOrders() {
      while (this.deferredOrders.length > 0) {
        const order = this.deferredOrders.shift();
        this.placeOrder(order);
      }
    }
  }
  
  function validateOrder(order) {
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
  
  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }
  
  module.exports = {
    validateRefactorOutput,
    OrderBook,
    validateOrder,
    generateRandomId,
  };