const uuid = require('uuid');

function initializeOrderBook() {
  return { buy: [], sell: [], history: [] };
}

function placeOrder(orderBook, order) {
  if (!validateOrder(order)) throw new Error("Invalid order");

  if (order.type === "market") {
    return executeMarketOrder(orderBook, order);
  } else if (order.type === "limit") {
    return addLimitOrder(orderBook, order);
  } else {
    addDeferredOrder(orderBook, order);
  }
  return orderBook;
}

function executeMarketOrder(orderBook, order) {
  const oppositeSide = order.side === "buy" ? "sell" : "buy";
  const orderBookSide = orderBook[oppositeSide];
  let remainingAmount = order.amount;
  const trades = [];

  for (let i = 0; i < orderBookSide.length && remainingAmount > 0; i++) {
    const bestOrder = orderBookSide[i];
    const tradeAmount = Math.min(bestOrder.amount, remainingAmount);

    processTrade(order, bestOrder, tradeAmount);
    trades.push({
      price: bestOrder.price,
      amount: tradeAmount,
      time: new Date().toISOString(),
      tradeId: uuid.v4(),
    });

    bestOrder.amount -= tradeAmount;
    remainingAmount -= tradeAmount;

    if (bestOrder.amount === 0) {
      orderBookSide.splice(i, 1);
      i--;
    }
  }

  if (remainingAmount > 0) {
    console.warn(`Market order partially filled: ${remainingAmount} units remaining`);
  }

  orderBook.history.push(...trades);
  return { orderBook, trades };
}

function addLimitOrder(orderBook, order) {
  orderBook[order.side].push({ ...order, timestamp: Date.now(), orderId: uuid.v4() });
  sortLimitOrders(orderBook[order.side], order.side);
  return orderBook;
}

function sortLimitOrders(orders, side) {
  orders.sort((a, b) => {
    if (a.price === b.price) return a.timestamp - b.timestamp;
    return side === "buy" ? b.price - a.price : a.price - b.price;
  });
}

function processTrade(buyer, seller, amount) {
  console.log(`[${new Date().toISOString()}] Trade executed: ${amount} units at ${seller.price}`);
}

function addDeferredOrder(orderBook, order) {
  orderBook.history.push({ ...order, status: "deferred", time: new Date().toISOString() });
}

function validateOrder(order) {
  if (!order.type || !order.side || typeof order.price !== "number" || order.amount <= 0) return false;
  if (order.side !== "buy" && order.side !== "sell") return false;
  if (order.type !== "market" && order.type !== "limit") return false;
  if (order.amount % 1 !== 0) return false; // reject fractional amounts
  if (order.price <= 0) return false; // reject non-positive prices
  if (order.amount > 1000000 || order.price > 1000000) return false; // reject extremely large values
  return true;
}

function handlePriceChange(orderBook, newPrice) {
  orderBook.sell = orderBook.sell.filter(order => order.price <= newPrice);
  orderBook.buy = orderBook.buy.filter(order => order.price >= newPrice);
  return orderBook;
}

function validateRefactorOutput(orderBook) {
  if (!orderBook.buy || !orderBook.sell || !orderBook.history) return false;
  if (!Array.isArray(orderBook.buy) || !Array.isArray(orderBook.sell) || !Array.isArray(orderBook.history)) return false;
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
  generateRandomId: uuid.v4,
};