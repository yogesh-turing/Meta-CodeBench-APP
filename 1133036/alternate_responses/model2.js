const MAX_ORDER_AMOUNT = 1000000;
const MAX_ORDER_PRICE = 1000000;

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

  if (!order.type || !order.side || typeof order.price !== 'number' || !Number.isFinite(order.amount)) {
    throw new Error('Order must contain valid type, side, price, and amount');
  }

  if (order.side !== 'buy' && order.side !== 'sell') {
    throw new Error('Order side must be either "buy" or "sell"');
  }

  if (order.type !== 'market' && order.type !== 'limit') {
    throw new Error('Order type must be either "market" or "limit"');
  }

  if (order.amount <= 0 || !Number.isInteger(order.amount)) {
    throw new Error('Order amount must be a positive integer');
  }

  if (order.price < 0) {
    throw new Error('Order price cannot be negative');
  }

  if (order.amount > MAX_ORDER_AMOUNT) {
    throw new Error(`Order amount cannot exceed ${MAX_ORDER_AMOUNT}`);
  }

  if (order.price > MAX_ORDER_PRICE) {
    throw new Error(`Order price cannot exceed ${MAX_ORDER_PRICE}`);
  }

  return true;
}

function placeOrder(orderBook, order) {
  if (!orderBook || typeof orderBook !== 'object') {
    throw new Error('Invalid order book');
  }

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
      orderBookSide.splice(i--, 1);
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
  const trade = {
    timestamp: new Date().toISOString(),
    amount,
    price: seller.price,
    buyerId: buyer.orderId,
    sellerId: seller.orderId
  };
  console.log(`Trade executed: ${JSON.stringify(trade)}`);
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
  if (!Number.isFinite(newPrice) || newPrice < 0) {
    throw new Error('Invalid price value');
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
      cancelTime: new Date().toISOString()
    });
  });

  return orderBook;
}

function validateRefactorOutput(orderBook) {
  if (!orderBook || typeof orderBook !== 'object') {
    throw new Error('Invalid order book');
  }

  if (!Array.isArray(orderBook.buy) || !Array.isArray(orderBook.sell) || !Array.isArray(orderBook.history)) {
    throw new Error('Order book must contain buy, sell, and history arrays');
  }

  return true;
}

module.exports = {
  validateRefactorOutput,
  initializeOrderBook,
  placeOrder,
  executeMarketOrder,
  addLimitOrder,
  processTrade,
  handlePriceChange,
  validateOrder,
  generateRandomId,
};