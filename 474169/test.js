const { getMaxSumPath } = require("./solution");

describe("getMaxSumPath", () => {
  it("should throw an error if the grid is not 3x3", () => {
    const invalidGrid1 = [
      [1, 2],
      [3, 4],
    ];
    const invalidGrid2 = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
    ];

    expect(() => getMaxSumPath(invalidGrid1)).toThrow("Grid must be 3 by 3");
    expect(() => getMaxSumPath(invalidGrid2)).toThrow("Grid must be 3 by 3");
  });

  it("should return the maximum sum for a 3x3 grid with all zeros", () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const result = getMaxSumPath(grid);

    expect(result.maxSum).toBe(0);
    expect(result.bestPathNumbers.length).toBe(5);
    expect(result.bestPathNumbers.every((num) => num === 0)).toBe(true);
  });

  it("should return the maximum sum for a 3x3 grid with large positive and negative numbers", () => {
    const grid = [
      [1000000, -500000, 300000],
      [-200000, 900000, -400000],
      [700000, -800000, 600000],
    ];
    const result = getMaxSumPath(grid);
    expect(result.maxSum).toBe(1900000);
  });

  it("should throw an error if the grid contains null or undefined values", () => {
    const grid = [
      [1, null, 3],
      [4, undefined, 6],
      [7, 8, 9],
    ];
    expect(() => getMaxSumPath(grid)).toThrow(
      "Null or undefined values are not allowed"
    );
  });

  it("should throw an error if the grid contains NaN values", () => {
    const grid = [
      [1, NaN, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(() => getMaxSumPath(grid)).toThrow("NaN values are not allowed");
  });

  it("should return the maximum sum for a 3x3 grid with all positive values", () => {
    const grid = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const result = getMaxSumPath(grid);
    expect(result.maxSum).toBe(45);
    expect(result.bestPathNumbers).toEqual([1, 2, 3, 6, 5, 4, 7, 8, 9]);
  });

  it("should throw an error if the grid contains fractional numbers", () => {
    const grid = [
      [1.5, 2, 3],
      [4, 5.75, 6],
      [7, 8, 9.25],
    ];

    expect(() => getMaxSumPath(grid)).toThrow("Fractions are not allowed");
  });

  it("should return the maximum sum for a 3x3 grid with negative numbers", () => {
    const grid = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    const result = getMaxSumPath(grid);
    expect(result.maxSum).toBe(-21);
    expect(result.bestPathNumbers).toEqual([-1, -2, -3, -6, -9]);
  });

  it("should throw an error if the grid contains non-integer values", () => {
    const grid = [
      [1, 3, "A"],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(() => getMaxSumPath(grid)).toThrow("Strings are not allowed");
  });

  it("should throw an error if the grid contains invalid input (e.g., unquoted characters)", () => {
    const invalidInput = () => {
      const grid = [
        [1, A, 3],
        [4, h, 6],
        [7, 8, 9],
      ];
      getMaxSumPath(grid);
    };
    expect(invalidInput).toThrow(ReferenceError);
  });

  it("should return the maximum sum for a 3x3 grid with mixed numbers", () => {
    const grid = [
      [1, -2, 3],
      [-4, 5, -6],
      [7, -8, 9],
    ];
    const result = getMaxSumPath(grid);
    expect(result.maxSum).toBe(8);
    expect(result.bestPathNumbers).toEqual([1, -2, 5, -4, 7, -8, 9]);
  });
});