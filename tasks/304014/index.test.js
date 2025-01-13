const { flattenArr } = require('./incorrect');

// Test suite to check the flattening function
describe('flattenArr', () => {

  test('should flatten a deeply nested array', () => {
    const nestedArray = [1, [2, [3, [4, [5]]]]];
    const result = flattenArr(nestedArray);
    const expected = [1, 2, 3, 4, 5];
    expect(result).toEqual(expected);
  });

  test('should return non-array input', () => {
    let result = flattenArr(42);
    expect(result).toBe(42);
    result = flattenArr('hello');
    expect(result).toBe('hello');
  });

  test('should flatten an array with multiple subarrays at different depths', () => {
    const multiLevelArray = [1, [2, 3], [[4, 5], 6], [7]];
    const expected = [1, 2, 3, 4, 5, 6, 7];
    const result = flattenArr(multiLevelArray);
    expect(result).toEqual(expected);
  });

  test('should handle empty arrays', () => {
    const result = flattenArr([]);
    expect(result).toEqual([]);
  });

  test('should flatten an array with empty arrays inside', () => {
    const nestedWithEmptyArrays = [1, [], [2, []], [[3, 4], []], []];
    const result = flattenArr(nestedWithEmptyArrays);
    const expected = [1, 2, 3, 4];
    expect(result).toEqual(expected);
  });

  test('should flatten an array of length 1', () => {
    const singleElementArray = [[1]];
    const result = flattenArr(singleElementArray);
    expect(result).toEqual([1]);
  });

  test('should handle very large nested arrays for performance', () => {
    const largeNestedArray = Array(10000).fill([1, [2]]);
    const result = flattenArr(largeNestedArray);
    expect(result.length).toBe(20000);
  });

});