const { TradingPlatform, Order, Trade } = require('./solution');

describe('Trading Platform', () => {
  test('should generate a random order ID', () => {
    const order = new Order('limit', 'buy', 5, 100);
    expect(order.orderId).toBeDefined();
    expect(order.orderId).toHaveLength(13); // Random ID length based on implementation
  });

  test('should validate a correct limit order', () => {
    const order = new Order('limit', 'buy', 5, 100);
    expect(order.validate()).toBe(true);
  });

  test('should validate a correct market order', () => {
    const order = new Order('market', 'sell', 10);
    expect(order.validate()).toBe(true);
  });

  test('should return false for an invalid order (negative amount)', () => {
    const order = new Order('limit', 'buy', -5, 100);
    expect(order.validate()).toBe(false);
  });

  test('should return false for an invalid side', () => {
    const order = new Order('limit', 'invalid_side', 5, 100);
    expect(order.validate()).toBe(false);
  });

  test('should return false for a limit order without a price', () => {
    const order = new Order('limit', 'buy', 5);
    expect(order.validate()).toBe(false);
  });
});

describe('Trade Class', () => {
  test('should create a trade with correct properties', () => {
    const buyOrder = new Order('limit', 'buy', 5, 100);
    const sellOrder = new Order('limit', 'sell', 5, 100);
    const trade = new Trade(100, 5, buyOrder, sellOrder);

    expect(trade.price).toBe(100);
    expect(trade.amount).toBe(5);
    expect(trade.buyOrderId).toBe(buyOrder.orderId);
    expect(trade.sellOrderId).toBe(sellOrder.orderId);
    expect(trade.tradeId).toBeDefined();
    expect(trade.time).toBeDefined();
  });
});

describe('TradingPlatform Class', () => {
  let platform;

  beforeEach(() => {
    platform = new TradingPlatform();
  });

  test('should initialize with an empty order book', () => {
    expect(platform.orderBook).toEqual({ buy: [], sell: [], history: [] });
  });

  test('should add a limit order to the buy side and keep them sorted by price (highest first)', () => {
    platform.placeOrder({ type: 'limit', side: 'buy', amount: 5, price: 100 });
    platform.placeOrder({ type: 'limit', side: 'buy', amount: 5, price: 105 });
    expect(platform.orderBook.buy[0].price).toBe(105);
  });

  test('should add a limit order to the sell side and keep them sorted by price (lowest first)', () => {
    platform.placeOrder({ type: 'limit', side: 'sell', amount: 5, price: 110 });
    platform.placeOrder({ type: 'limit', side: 'sell', amount: 5, price: 105 });
    expect(platform.orderBook.sell[0].price).toBe(105);
  });

  test('should execute a market order and match it with existing limit orders', () => {
    platform.placeOrder({ type: 'limit', side: 'sell', amount: 5, price: 100 });
    const result = platform.placeOrder({ type: 'market', side: 'buy', amount: 3 });

    expect(result.trades).toHaveLength(1);
    expect(result.trades[0].amount).toBe(3);
    expect(result.trades[0].price).toBe(100);
  });

  test('should partially match a market order and leave remaining amount', () => {
    platform.placeOrder({ type: 'limit', side: 'sell', amount: 5, price: 100 });
    const result = platform.placeOrder({ type: 'market', side: 'buy', amount: 7 });

    expect(result.trades).toHaveLength(1);
    expect(result.trades[0].amount).toBe(5);
    expect(platform.orderBook.sell.length).toBe(0);
  });

  test('should log trade details when a trade is executed', () => {
    console.log = jest.fn();
    platform.placeOrder({ type: 'limit', side: 'sell', amount: 5, price: 100 });
    platform.placeOrder({ type: 'market', side: 'buy', amount: 5 });

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Trade executed: 5 units at 100'));
  });

  test('should handle price change and remove inappropriate orders', () => {
    platform.placeOrder({ type: 'limit', side: 'sell', amount: 5, price: 110 });
    platform.placeOrder({ type: 'limit', side: 'buy', amount: 5, price: 90 });

    platform.handlePriceChange(100);

    expect(platform.orderBook.sell).toEqual([]);
    expect(platform.orderBook.buy).toEqual([]);
  });

  test('should store deferred orders in the history', () => {
    platform.placeOrder({ type: 'market', side: 'buy', amount: 10 });
    expect(platform.orderBook.history).toHaveLength(1);
    expect(platform.orderBook.history[0].status).toBe('deferred');
  });
});