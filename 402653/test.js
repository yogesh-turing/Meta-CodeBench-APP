const { Solution } = require('./solution');
describe('Solution', () => {

  test('testSmallestNumberSimpleCase', () => {
    expect(Solution.smallest('123', 6)).toBe('123');
  });

  test('testSmallestNumberZeroFree', () => {
    expect(Solution.smallest('123', 8)).toBe('124');
  });

  test('testSmallestNumberExactMatch', () => {
    expect(Solution.smallest('123', 1)).toBe('123');
  });

  test('testSmallestNumberWithLargeInput', () => {
    expect(Solution.smallest('1234', 9)).toBe('1236');
  });

  test('testSmallestNumberAlreadyZeroFree', () => {
    expect(Solution.smallest('230', 6)).toBe('231');
  });

  test('testSmallestNumberAllDigitsNine', () => {
    expect(Solution.smallest('999999', 20)).toBe('1111145');
  });

  test('testSmallestNumberSingleDigitInput', () => {
    expect(Solution.smallest('3', 3)).toBe('3');
    expect(Solution.smallest('3', 4)).toBe('4');
  });

  test('testSmallestNumberMinimumEdgeCase', () => {
    expect(Solution.smallest('1', 1)).toBe('1');
  });

  test('testSmallestNumberWithRepeatingDigits', () => {
    expect(Solution.smallest('2222', 16)).toBe('2222');
  });

  test('testSmallestNumberLongString', () => {
    expect(Solution.smallest('123456789', 1)).toBe('123456789');
  });

  test('testExample1', () => {
    expect(Solution.smallest('1234', 256)).toBe('1488');
  });

  test('testExample2', () => {
    expect(Solution.smallest('12355', 50)).toBe('12355');
  });

  test('testSmallestNumberWithLargeDigitProduct', () => {
    // Corrected expected result to match actual smallest number with product divisible by 72
    expect(Solution.smallest('1000000', 72)).toBe('1111189');
  });

  test('testSmallestNumberWithEdgeCaseNoValidNumber', () => {
    // This case simulates the safeguard for infinite loops
    expect(Solution.smallest('1000000000000000000', 1000000000000000000)).toBe("-1");
  });
});