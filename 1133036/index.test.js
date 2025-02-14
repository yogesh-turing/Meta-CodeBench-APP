const { initializeOrderBook,
  placeOrder,
  executeMarketOrder,
  addLimitOrder,
  handlePriceChange,
  validateOrder,
  generateRandomId, } = require('./alternate_responses/model5.js'); // Replace with the actual file name

describe("Trading Platform Unit Tests", () => {
  describe("initializeOrderBook", () => {
    test("should initialize an order book with empty buy, sell, and history arrays", () => {
      const orderBook = initializeOrderBook();
      expect(orderBook).toEqual({ buy: [], sell: [], history: [] });
    });
  });

  describe("validateOrder", () => {
    function dynamicValidateOrderTest(order) {
      try {
        const result = validateOrder(order);
        expect(result).toBe(false); // If no error is thrown, expect false for invalid orders
      } catch (error) {
        expect(error).toBeInstanceOf(Error); // If an error is thrown, ensure it's an instance of Error
        expect(error.message).toBeDefined(); // Check that the error has a message
      }
    }

    test("should return true for a valid market buy order", () => {
      const order = { type: "market", side: "buy", price: 100, amount: 5 };
      expect(validateOrder(order)).toBe(true);
    });

    test("should reject an order with missing fields", () => {
      const order = { type: "market", side: "buy", amount: 5 }; // Missing price
      dynamicValidateOrderTest(order);
    });

    test("should reject an order with an invalid side", () => {
      const order = { type: "market", side: "hold", price: 100, amount: 5 }; // Invalid side
      dynamicValidateOrderTest(order);
    });

    test("should reject an order with a non-numeric price", () => {
      const order = {
        type: "market",
        side: "buy",
        price: "not_a_number",
        amount: 5,
      };
      dynamicValidateOrderTest(order);
    });

    test("should reject an order with a negative amount", () => {
      const order = { type: "market", side: "buy", price: 100, amount: -5 };
      dynamicValidateOrderTest(order);
    });

    test("should reject an order with a non-integer amount", () => {
      const order = { type: "limit", side: "sell", price: 100, amount: 2.5 };
      dynamicValidateOrderTest(order);
    });
  });

  describe("placeOrder", () => {
    let orderBook;

    beforeEach(() => {
      orderBook = initializeOrderBook();
    });

    test("should throw an error for an invalid order", () => {
      const order = { type: "market", side: "buy", amount: 5 }; // Missing price
      expect(() => placeOrder(orderBook, order)).toThrow(Error);
    });

    test("should add a limit order to the order book", () => {
      const order = { type: "limit", side: "sell", price: 120, amount: 10 };
      placeOrder(orderBook, order);
      expect(orderBook.sell.length).toBe(1);
      expect(orderBook.sell[0]).toMatchObject({ price: 120, amount: 10 });
    });

    test("should execute a market order and add trade history", () => {
      orderBook.sell.push({ price: 100, amount: 5 });
      const order = { type: "market", side: "buy", price: 100, amount: 5 };
      const result = placeOrder(orderBook, order);
      expect(result.trades.length).toBe(1);
      expect(orderBook.history.length).toBe(1);
    });

    test("should throw an error for extremely large order amount", () => {
      const order = {
        type: "market",
        side: "buy",
        price: 100,
        amount: Number.MAX_SAFE_INTEGER,
      };
      expect(() => placeOrder(orderBook, order)).toThrow(Error);
    });

    test("should throw an error for invalid data types", () => {
      const order = { type: "market", side: "buy", price: "100", amount: "5" }; // String types for price and amount
      expect(() => placeOrder(orderBook, order)).toThrow(Error);
    });
  });

  describe("executeMarketOrder", () => {
    test("should execute a full market order", () => {
      const orderBook = initializeOrderBook();
      orderBook.sell.push({ price: 100, amount: 10 });

      const order = { type: "market", side: "buy", price: 100, amount: 10 };
      const result = executeMarketOrder(orderBook, order);
      expect(result.trades.length).toBe(1);
      expect(result.trades[0]).toMatchObject({ amount: 10, price: 100 });
    });

    test("should execute a partial market order and verify trade history with unique trade ID and timestamp", () => {
      const orderBook = initializeOrderBook();
      orderBook.sell.push({ price: 100, amount: 5 });

      const order = { type: "market", side: "buy", price: 100, amount: 10 };
      const result = executeMarketOrder(orderBook, order);

      expect(result.trades.length).toBe(1);
      expect(orderBook.sell.length).toBe(0);
      expect(orderBook.history.length).toBe(1);

      const trade = orderBook.history[0];
      expect(trade).toHaveProperty("tradeId");
      expect(trade).toHaveProperty("time");
      expect(typeof trade.tradeId).toBe("string");
      expect(new Date(trade.time).toString()).not.toBe("Invalid Date");
    });
  });

  describe("addLimitOrder", () => {
    test("should add a limit order and maintain correct sorting", () => {
      const orderBook = initializeOrderBook();
      addLimitOrder(orderBook, {
        type: "limit",
        side: "sell",
        price: 120,
        amount: 10,
      });
      addLimitOrder(orderBook, {
        type: "limit",
        side: "sell",
        price: 110,
        amount: 5,
      });
      expect(orderBook.sell[0].price).toBe(110);
    });

    test("should prioritize older orders with the same price", () => {
      const orderBook = initializeOrderBook();
      addLimitOrder(orderBook, {
        type: "limit",
        side: "sell",
        price: 100,
        amount: 10,
      });
      const orderWithLaterTimestamp = {
        type: "limit",
        side: "sell",
        price: 100,
        amount: 5,
        timestamp: Date.now() + 1000,
      };
      addLimitOrder(orderBook, orderWithLaterTimestamp);
      expect(orderBook.sell[0].amount).toBe(10);
    });
  });

  describe("generateRandomId", () => {
    test("should generate a unique random ID", () => {
      const id1 = generateRandomId();
      const id2 = generateRandomId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("Edge Cases", () => {
    test("should handle null/undefined order gracefully", () => {
      const orderBook = initializeOrderBook();
      expect(() => placeOrder(orderBook, null)).toThrow(Error);
      expect(() => placeOrder(orderBook, undefined)).toThrow(Error);
    });

    test("should handle large input sizes without crashing", () => {
      const orderBook = initializeOrderBook();
      for (let i = 0; i < 10000; i++) {
        placeOrder(orderBook, {
          type: "limit",
          side: "buy",
          price: 100 + i,
          amount: 1,
        });
      }
      expect(orderBook.buy.length).toBe(10000);
    });
  });

  describe("handlePriceChange", () => {
    let orderBook;

    beforeEach(() => {
      orderBook = initializeOrderBook();
    });

    test("should remove sell orders with prices higher than the new price", () => {
      orderBook.sell.push(
        { price: 150, amount: 10 },
        { price: 100, amount: 5 }
      );
      handlePriceChange(orderBook, 120);
      expect(orderBook.sell.length).toBe(1);
      expect(orderBook.sell[0].price).toBe(100);
    });

    test("should remove buy orders with prices lower than the new price", () => {
      orderBook.buy.push({ price: 50, amount: 10 }, { price: 100, amount: 5 });
      handlePriceChange(orderBook, 75);
      expect(orderBook.buy.length).toBe(1);
      expect(orderBook.buy[0].price).toBe(100);
    });

    test("should remove all orders if no prices match the new price criteria", () => {
      orderBook.sell.push({ price: 200, amount: 10 });
      orderBook.buy.push({ price: 50, amount: 5 });
      handlePriceChange(orderBook, 100);
      expect(orderBook.sell.length).toBe(0);
      expect(orderBook.buy.length).toBe(0);
    });
  });
});
