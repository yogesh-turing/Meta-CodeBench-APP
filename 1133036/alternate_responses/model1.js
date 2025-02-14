// Constants for validation and configuration
const CONSTANTS = {
    MAX_PRICE: 1000000000,
    MAX_AMOUNT: 1000000,
    MIN_PRICE: 0.01,
    MIN_AMOUNT: 1
  };
  
  function initializeOrderBook() {
    return {
      buy: [],
      sell: [],
      history: []
    };
  }
  
  function validateOrder(order) {
    if (!order || typeof order !== 'object') {
      throw new Error('Order must be a valid object');
    }
  
    if (!order.type || !order.side || typeof order.amount !== 'number' || typeof order.price !== 'number') {
      throw new Error('Order must contain valid type, side, amount, and price');
    }
  
    if (order.side !== 'buy' && order.side !== 'sell') {
      throw new Error('Order side must be either "buy" or "sell"');
    }
  
    if (order.type !== 'market' && order.type !== 'limit') {
      throw new Error('Order type must be either "market" or "limit"');
    }
  
    if (!Number.isInteger(order.amount) || order.amount <= CONSTANTS.MIN_AMOUNT || order.amount > CONSTANTS.MAX_AMOUNT) {
      throw new Error(`Amount must be an integer between ${CONSTANTS.MIN_AMOUNT} and ${CONSTANTS.MAX_AMOUNT}`);
    }
  
    if (order.price < CONSTANTS.MIN_PRICE || order.price > CONSTANTS.MAX_PRICE) {
      throw new Error(`Price must be between ${CONSTANTS.MIN_PRICE} and ${CONSTANTS.MAX_PRICE}`);
    }
  
    return true;
  }
  
  function placeOrder(orderBook, order) {
    if (!orderBook || !Array.isArray(orderBook.buy) || !Array.isArray(orderBook.sell)) {
      throw new Error('Invalid order book structure');
    }
  
    validateOrder(order);
  
    if (order.type === 'market') {
      return executeMarketOrder(orderBook, order);
    } else if (order.type === 'limit') {
      return addLimitOrder(orderBook, order);
    } else {
      return addDeferredOrder(orderBook, order);
    }
  }
  
  function executeMarketOrder(orderBook, order) {
    const oppositeSide = order.side === 'buy' ? 'sell' : 'buy';
    const orderBookSide = orderBook[oppositeSide];
    let remainingAmount = order.amount;
    const trades = [];
  
    for (let i = 0; i < orderBookSide.length && remainingAmount > 0; i++) {
      const bestOrder = orderBookSide[i];
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
        orderBookSide.splice(i, 1);
        i--;
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
    const tradeRecord = {
      timestamp: new Date().toISOString(),
      amount: amount,
      price: seller.price,
      buyerId: buyer.orderId,
      sellerId: seller.orderId
    };
    
    console.log(`Trade executed: ${JSON.stringify(tradeRecord)}`);
    return tradeRecord;
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
    if (typeof newPrice !== 'number' || newPrice < CONSTANTS.MIN_PRICE || newPrice > CONSTANTS.MAX_PRICE) {
      throw new Error(`Invalid price. Must be between ${CONSTANTS.MIN_PRICE} and ${CONSTANTS.MAX_PRICE}`);
    }
  
    const removedOrders = {
      sell: orderBook.sell.filter(order => order.price > newPrice),
      buy: orderBook.buy.filter(order => order.price < newPrice)
    };
  
    orderBook.sell = orderBook.sell.filter(order => order.price <= newPrice);
    orderBook.buy = orderBook.buy.filter(order => order.price >= newPrice);
  
    // Log removed orders to history
    const removedOrdersHistory = [...removedOrders.sell, ...removedOrders.buy].map(order => ({
      ...order,
      status: 'removed_price_change',
      removalTime: new Date().toISOString()
    }));
  
    orderBook.history.push(...removedOrdersHistory);
    return orderBook;
  }
  
  module.exports = {
    initializeOrderBook,
    placeOrder,
    executeMarketOrder,
    addLimitOrder,
    processTrade,
    handlePriceChange,
    validateOrder,
    generateRandomId
  };