const { MaximizeProfit } = require("./base");

describe("MaximizeProfit Tests", () => {
  let maximizeProfit;

  beforeEach(() => {
    maximizeProfit = new MaximizeProfit();
  });

  // Base test cases
  describe("Base Test Cases", () => {
    test("Array with null stock price", () => {
      const k = 1;
      const actualProfit = maximizeProfit.maxProfit(null, k);
      expect(actualProfit).toBe(0);
    });

    test("Array with zero stock price and non-zero k", () => {
      const stockPrices = [0];
      const k = 1;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(0);
    });

    test("Array with no stocks", () => {
      const stockPrices = [];
      const k = 1;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(0);
    });

    test("Array with no stocks and negative k", () => {
      const stockPrices = [];
      const k = -1;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(0);
    });

    test("Array with one stock", () => {
      const stockPrices = [10];
      const k = 1;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(0);
    });
  });

  // Mixed stock scenarios
  describe("Mixed Stock Scenarios", () => {
    test("Array with mixed stock prices (1)", () => {
      const stockPrices = [100, 180, 260, 310, 40, 535, 695];
      const k = 2;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(865);
    });

    test("Array with mixed stock prices (2)", () => {
      const stockPrices = [7, 10, 1, 3, 6, 9, 2];
      const k = 3;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(11);
    });

    test("Array with mixed stock prices (3)", () => {
      const stockPrices = [70, 100, 120, 80, 150, 130, 170];
      const k = 4;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(160);
    });

    test("Array with stocks and k greater than n", () => {
      const stockPrices = [3, 4, 2];
      const k = 4;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(1);
    });
  });

  // Edge cases
  describe("Edge Cases", () => {
    test("Randomly sorted stocks (1)", () => {
      const stockPrices = [2, 4, 1];
      const k = 2;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(2);
    });

    test("Randomly sorted stocks (2)", () => {
      const stockPrices = [3, 2, 6, 5, 0, 3];
      const k = 2;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(7);
    });

    test("Mixed stock prices with k=2, [100, 30, 15, 10, 8, 25, 80]", () => {
      const stockPrices = [100, 30, 15, 10, 8, 25, 80];
      const k = 2;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(72);
    });

    test("Descending stock prices with k=1, [90, 80, 70, 60, 50]", () => {
      const stockPrices = [90, 80, 70, 60, 50];
      const k = 1;
      const actualProfit = maximizeProfit.maxProfit(stockPrices, k);
      expect(actualProfit).toBe(0);
    });
  });

  // Performance test
  describe("Performance Test", () => {
    test("Maintain linear time complexity O(n)", () => {
      const sizes = [1000, 10000, 100000];
      const timings = [];

      sizes.forEach((size) => {
        const stockPrices = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
        const startTime = process.hrtime();
        maximizeProfit.maxProfit(stockPrices, 3);
        const endTime = process.hrtime(startTime);
        const timeInMs = endTime[0] * 1000 + endTime[1] / 1000000;
        timings.push({ size, time: timeInMs });
      });

      const ratios = [];
      for (let i = 1; i < timings.length; i++) {
        const timeRatio = timings[i].time / timings[i - 1].time;
        const sizeRatio = timings[i].size / timings[i - 1].size;
        ratios.push(timeRatio / sizeRatio);
      }

      ratios.forEach((ratio) => {
        expect(ratio).toBeGreaterThan(0.5);
        expect(ratio).toBeLessThan(2.0);
      });

      console.log("Performance test results:");
      timings.forEach(({ size, time }) => {
        console.log(`Size: ${size}, Time: ${time.toFixed(2)}ms`);
      });
    });
  });
});