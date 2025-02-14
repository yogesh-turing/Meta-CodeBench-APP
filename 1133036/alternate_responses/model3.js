// Constants for validation and configuration
const CONSTANTS = {
    MAX_PRICE: 1000000,
    MAX_AMOUNT: 1000000,
    VALID_TYPES: ['market', 'limit'],
    VALID_SIDES: ['buy', 'sell']
  };
  
  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  function initializeOrderBook() {
    return {
      buy: [],
      sell: [],
      history: []
    };
  }
  
  function validateOrder(order) {
    if (!order || typeof order !== 'object') {
      throw new ValidationError('Order must be a valid object');
    }
  
    // Check required fields
    if (!order.type || !order.side || !order.amount || (order.type === 'limit' && !order.price)) {
      throw new ValidationError('Missing required order fields');
    }
  
    // Validate order type
    if (!CONSTANTS.VALID_TYPES.includes(order.type)) {
      throw new ValidationError(`Invalid order type. Must be one of: ${CONSTANTS.VALID_TYPES.join(', ')}`);
    }
  
    // Validate order side
    if (!CONSTANTS.VALID_SIDES.includes(order.side)) {
      throw new ValidationError(`Invalid order side. Must be one of: ${CONSTANTS.VALID_SIDES.join(', ')}`);
    }
  
    // Validate amount
    if (!Number.isInteger(order.amount) || order.amount <= 0 || order.amount > CONSTANTS.MAX_AMOUNT) {
      throw new ValidationError(`Amount must be a positive integer not exceeding ${CONSTANTS.MAX_AMOUNT}`);
    }
  
    // Validate price for limit orders
    if (order.type === 'limit') {
      if (typeof order.price !== 'number' || order.price <= 0 || order.price > CONSTANTS.MAX_PRICE) {
        throw new ValidationError(`Price must be a positive number not exceeding ${CONSTANTS.MAX_PRICE}`);
      }
    }
  
    return true;
  }
  
  function placeOrder(orderBook, order) {
    validateOrder(order);
  
    switch (order.type) {
      case 'market':
        return executeMarketOrder(orderBook, order);
      case 'limit':
        return addLimitOrder(orderBook, order);
      default:
        return addDeferredOrder(orderBook, order);
    }
  }
  
  function executeMarketOrder(orderBook, order) {
    const oppositeSide = order.side === 'buy' ? 'sell' : 'buy';
    const orderBookSide = orderBook[oppositeSide];
    let remainingAmount = order.amount;
    const trades = [];
  
    while (orderBookSide.length > 0 && remainingAmount > 0) {
      const bestOrder = orderBookSide[0];
      const tradeAmount = Math.min(bestOrder.amount, remainingAmount);
  
      const trade = {
        price: bestOrder.price,
        amount: tradeAmount,
        time: new Date().toISOString(),
        tradeId: generateRandomId(),
        buyOrderId: order.side === 'buy' ? order.orderId : bestOrder.orderId,
        sellOrderId: order.side === 'sell' ? order.orderId : bestOrder.orderId
      };
  
      processTrade(order, bestOrder, tradeAmount);
      trades.push(trade);
  
      bestOrder.amount -= tradeAmount;
      remainingAmount -= tradeAmount;
  
      if (bestOrder.amount === 0) {
        orderBookSide.shift();
      }
    }
  
    if (remainingAmount > 0) {
      const unfilled = {
        ...order,
        amount: remainingAmount,
        status: 'partially_filled',
        time: new Date().toISOString()
      };
      orderBook.history.push(unfilled);
    }
  
    orderBook.history.push(...trades);
    return { orderBook, trades };
  }
  
  function addLimitOrder(orderBook, order) {
    const newOrder = {
      ...order,
      timestamp: Date.now(),
      orderId: generateRandomId()
    };
  
    orderBook[order.side].push(newOrder);
    sortLimitOrders(orderBook[order.side], order.side);
    return orderBook;
  }
  
  function sortLimitOrders(orders, side) {
    orders.sort((a, b) => {
      const priceDiff = side === 'buy' ? b.price - a.price : a.price - b.price;
      return priceDiff === 0 ? a.timestamp - b.timestamp : priceDiff;
    });
  }
  
  function processTrade(buyer, seller, amount) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Trade executed: ${amount} units at ${seller.price}`);
  }
  
  function addDeferredOrder(orderBook, order) {
    const deferredOrder = {
      ...order,
      status: 'deferred',
      time: new Date().toISOString(),
      orderId: generateRandomId()
    };
    orderBook.history.push(deferredOrder);
    return orderBook;
  }
  
  function generateRandomId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  function handlePriceChange(orderBook, newPrice) {
    if (typeof newPrice !== 'number' || newPrice <= 0 || newPrice > CONSTANTS.MAX_PRICE) {
      throw new ValidationError('Invalid price value');
    }
  
    orderBook.sell = orderBook.sell.filter(order => order.price <= newPrice);
    orderBook.buy = orderBook.buy.filter(order => order.price >= newPrice);
    
    const removedOrders = {
      sell: orderBook.sell.filter(order => order.price > newPrice),
      buy: orderBook.buy.filter(order => order.price < newPrice)
    };
  
    removedOrders.sell.concat(removedOrders.buy).forEach(order => {
      orderBook.history.push({
        ...order,
        status: 'cancelled_price_change',
        time: new Date().toISOString()
      });
    });
  
    return orderBook;
  }
  
  module.exports = {
    validateRefactorOutput: true,
    initializeOrderBook,
    placeOrder,
    executeMarketOrder,
    addLimitOrder,
    processTrade,
    handlePriceChange,
    validateOrder,
    generateRandomId,
  };