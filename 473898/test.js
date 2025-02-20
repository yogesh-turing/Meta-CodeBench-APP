const { multiplyLargeNumbers } = require('./solution');
describe("multiplyLargeNumbers function", () => {
  test("should correctly multiply small numbers", () => {
    const result = multiplyLargeNumbers(12, 34);
    expect(result).toBe(12 * 34);
  });

  test("should correctly multiply large numbers", () => {
    const result = multiplyLargeNumbers(12345, 67890);
    expect(result).toBe(12345 * 67890);
  });

  test("should correctly multiply numbers with different lengths", () => {
    const result = multiplyLargeNumbers(1234, 56789);
    expect(result).toBe(1234 * 56789);
  });

  test("should correctly handle multiplication with zero", () => {
    const result = multiplyLargeNumbers(0, 98765);
    expect(result).toBe(0);
  });

  test("should correctly multiply a negative and positive number", () => {
    const result = multiplyLargeNumbers(-123, 456);
    expect(result).toBe(-123 * 456);
  });

  test("should correctly multiply two negative numbers", () => {
    const result = multiplyLargeNumbers(-123, -456);
    expect(result).toBe(-123 * -456);
  });

  test("should correctly handle multiplication with maximum safe integer", () => {
    const result = multiplyLargeNumbers(Number.MAX_SAFE_INTEGER, 1);
    expect(result).toBe(Number.MAX_SAFE_INTEGER * 1);
  });

  test("should correctly handle multiplication of large integers", () => {
    const num1 = 46340;
    const num2 = 46340;
    const result = multiplyLargeNumbers(num1, num2);
    expect(result).toBe(num1 * num2);
  });
});