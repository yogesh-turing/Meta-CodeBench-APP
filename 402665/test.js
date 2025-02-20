const {CafeOrderScheduling} = require('./solution');  // Correct the path to your class

describe("maxOrdersWithinDeadline", () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new CafeOrderScheduling();  // Create an instance of the class before each test
  });

  test("should return the maximum orders that can be completed on time for normal input", () => {
    const orders = [
      [2, 5],
      [1, 3],
      [3, 7],
      [2, 6],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(3);
  });

  test("should return the maximum orders that can be completed for a simple case", () => {
    const orders = [
      [1, 3],
      [2, 5],
      [1, 4],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(3);
  });

  test("should return 0 for an empty input", () => {
    const orders = [];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(0);
  });

  test("should return -1 for orders where preparation time exceeds deadline", () => {
    const orders = [
      [6, 5],
      [2, 3],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(-1);
  });

  test("should return the maximum orders completed for multiple orders with the same deadline", () => {
    const orders = [
      [2, 5],
      [1, 5],
      [3, 5],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(2);
  });

  test("should return -1 when one order exceeds its deadline", () => {
    const orders = [
      [5, 4],
      [2, 6],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(-1);
  });

  test("should return 0 for null input", () => {
    const orders = null;
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(0);
  });

  test("should return the maximum orders that can be completed for a single order", () => {
    const orders = [
      [2, 3],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(1);
  });

  test("should return -1 for orders with mismatched preparation times", () => {
    const orders = [
      [10, 8],
      [4, 7],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(-1);
  });

  test("should return the correct result for an array of orders with increasing preparation times", () => {
    const orders = [
      [1, 10],
      [2, 9],
      [3, 8],
      [4, 7],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(4);
  });

  test("should return -1 for input where orders have different row lengths", () => {
    const orders = [
      [2, 4],
      [3],
      [5, 6],
    ];
    expect(scheduler.maxOrdersWithinDeadline(orders)).toEqual(-1);
  });
});