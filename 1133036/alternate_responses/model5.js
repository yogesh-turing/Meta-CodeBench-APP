// Constants for validation
const MAX_PRICE = 1000000;
const MAX_AMOUNT = 1000000;
const VALID_ORDER_TYPES = ['market', 'limit'];
const VALID_ORDER_SIDES = ['buy', 'sell'];

function initializeOrderBook() {
  return {
    buy: [],
    sell: [],
    history: [],
    lastTradeId: 0
  };
}

function validateOrder(order) {
  if (!order || typeof order !== 'object') {
    throw new Error('Order must be a valid object');
  }

  // Check required fields
  if (!order.type || !order.side || !order.price || !order.amount) {
    throw new Error('Order must contain type, side, price, and amount');
  }

  // Validate order type
  if (!VALID_ORDER_TYPES.includes(order.type)) {
    throw new Error(`Invalid order type. Must be one of: ${VALID_ORDER_TYPES.join(', ')}`);
  }

  // Validate order side
  if (!VALID_ORDER_SIDES.includes(order.side)) {
    throw new Error(`Invalid order side. Must be one of: ${VALID_ORDER_SIDES.join(', ')}`);
  }

  // Validate price
  if (typeof order.price !== 'number' || order.price <= 0 || order.price > MAX_PRICE) {
    throw new Error(`Price must be a positive number less than ${MAX_PRICE}`);
  }

  // Validate amount
  if (!Number.isInteger(order.amount) || order.amount <= 0 || order.amount > MAX_AMOUNT) {
    throw new Error(`Amount must be a positive integer less than ${MAX_AMOUNT}`);
  }

  return true;
}

function placeOrder(orderBook, order) {
  try {
    validateOrder(order);

    switch (order.type) {
      case 'market':
        return executeMarketOrder(orderBook, order);
      case 'limit':
        return addLimitOrder(orderBook, order);
      default:
        return addDeferredOrder(orderBook, order);
    }
  } catch (error) {
    console.error(`Error placing order: ${error.message}`);
    throw error;
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
      tradeId: generateTradeId(orderBook),
      buyOrderId: order.side === 'buy' ? order.orderId : bestOrder.orderId,
      sellOrderId: order.side === 'sell' ? order.orderId : bestOrder.orderId
    };

    processTrade(trade);
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

function processTrade(trade) {
  console.log(`[${trade.time}] Trade executed: ${trade.amount} units at ${trade.price}`);
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

function generateTradeId(orderBook) {
  orderBook.lastTradeId += 1;
  return `T${orderBook.lastTradeId}`;
}

function handlePriceChange(orderBook, newPrice) {
  if (typeof newPrice !== 'number' || newPrice <= 0 || newPrice > MAX_PRICE) {
    throw new Error(`Invalid price. Must be a positive number less than ${MAX_PRICE}`);
  }

  orderBook.sell = orderBook.sell.filter(order => order.price <= newPrice);
  orderBook.buy = orderBook.buy.filter(order => order.price >= newPrice);
  
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