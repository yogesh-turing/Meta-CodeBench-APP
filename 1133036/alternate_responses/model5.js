// Constants for validation and configuration
const CONSTANTS = {
  MAX_PRICE: 1000000,
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

  if (!['market', 'limit'].includes(order.type)) {
    throw new Error('Invalid order type');
  }

  if (!['buy', 'sell'].includes(order.side)) {
    throw new Error('Invalid order side');
  }

  if (typeof order.price !== 'number' || order.price <= CONSTANTS.MIN_PRICE || order.price > CONSTANTS.MAX_PRICE) {
    throw new Error(`Price must be a number between ${CONSTANTS.MIN_PRICE} and ${CONSTANTS.MAX_PRICE}`);
  }

  if (!Number.isInteger(order.amount) || order.amount < CONSTANTS.MIN_AMOUNT || order.amount > CONSTANTS.MAX_AMOUNT) {
    throw new Error(`Amount must be an integer between ${CONSTANTS.MIN_AMOUNT} and ${CONSTANTS.MAX_AMOUNT}`);
  }

  return true;
}

function placeOrder(orderBook, order) {
  if (!validateOrder(order)) {
    throw new Error("Invalid order");
  }

  switch (order.type) {
    case "market":
      return executeMarketOrder(orderBook, order);
    case "limit":
      return addLimitOrder(orderBook, order);
    default:
      return addDeferredOrder(orderBook, order);
  }
}

function executeMarketOrder(orderBook, order) {
  const oppositeSide = order.side === "buy" ? "sell" : "buy";
  const orderBookSide = orderBook[oppositeSide];
  let remainingAmount = order.amount;
  const trades = [];
  const timestamp = new Date().toISOString();

  for (let i = 0; i < orderBookSide.length && remainingAmount > 0; i++) {
    const bestOrder = orderBookSide[i];
    const tradeAmount = Math.min(bestOrder.amount, remainingAmount);

    const trade = {
      price: bestOrder.price,
      amount: tradeAmount,
      time: timestamp,
      tradeId: generateRandomId(),
      buyOrderId: order.side === "buy" ? order.orderId : bestOrder.orderId,
      sellOrderId: order.side === "sell" ? order.orderId : bestOrder.orderId
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
      status: "partially_filled",
      time: timestamp
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
    const priceDiff = side === "buy" ? b.price - a.price : a.price - b.price;
    return priceDiff !== 0 ? priceDiff : a.timestamp - b.timestamp;
  });
}

function processTrade(buyer, seller, amount) {
  const tradeInfo = {
    timestamp: new Date().toISOString(),
    amount,
    price: seller.price,
    buyerId: buyer.orderId,
    sellerId: seller.orderId
  };
  console.log(`Trade executed: ${JSON.stringify(tradeInfo)}`);
}

function addDeferredOrder(orderBook, order) {
  const deferredOrder = {
    ...order,
    status: "deferred",
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
  if (typeof newPrice !== 'number' || newPrice <= 0) {
    throw new Error('New price must be a positive number');
  }

  const removedOrders = {
    buy: orderBook.buy.filter(order => order.price < newPrice),
    sell: orderBook.sell.filter(order => order.price > newPrice)
  };

  orderBook.buy = orderBook.buy.filter(order => order.price >= newPrice);
  orderBook.sell = orderBook.sell.filter(order => order.price <= newPrice);

  // Log removed orders to history
  const timestamp = new Date().toISOString();
  removedOrders.buy.concat(removedOrders.sell).forEach(order => {
    orderBook.history.push({
      ...order,
      status: 'removed_price_change',
      removedAt: timestamp,
      newPrice
    });
  });

  return orderBook;
}

function validateRefactorOutput(orderBook) {
  if (!orderBook || typeof orderBook !== 'object') {
    return false;
  }

  return (
    Array.isArray(orderBook.buy) &&
    Array.isArray(orderBook.sell) &&
    Array.isArray(orderBook.history)
  );
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