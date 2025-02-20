// GeometricSequenceSolver.test.js
const { GeometricSequenceSolver } = require("./solution");

describe("GeometricSequenceSolver", () => {
  // --- Constructor and Parsing Errors ---
  test("should throw TypeError if input is not a string", () => {
    expect(() => new GeometricSequenceSolver(123)).toThrow(
      "Input must be a string."
    );
  });

  test("should throw error if input string is empty", () => {
    expect(() => new GeometricSequenceSolver("    ")).toThrow(
      "Input sequence string is empty."
    );
  });

  test("should throw error when encountering an invalid token in a standard sequence", () => {
    expect(() => new GeometricSequenceSolver("2, 4, eight, 16")).toThrow(
      "Invalid number encountered: "
    );
  });

  // --- Standard Sequence Tests ---
  test("should correctly parse a valid standard geometric sequence", () => {
    const solver = new GeometricSequenceSolver("2, 4, 8, 16, 32");
    expect(solver.isGeometric()).toBe(true);

    const pattern = solver.getGeometricPattern();
    expect(pattern).toEqual({
      firstTerm: 2,
      commonRatio: 2,
      sequence: [2, 4, 8, 16, 32],
    });
    expect(solver.nthTerm(4)).toBe(16);
    expect(solver.nthTerm(5)).toBe(32);
  });

  test("should correctly parse a single-element standard sequence", () => {
    const solver = new GeometricSequenceSolver("5");
    expect(solver.isGeometric()).toBe(true);

    const pattern = solver.getGeometricPattern();
    // For a single element, we assume commonRatio is 1 (if not 0)
    expect(pattern).toEqual({
      firstTerm: 5,
      commonRatio: 1,
      sequence: [5],
    });
    expect(solver.nthTerm(3)).toBe(5);
  });

  test("should detect a non-geometric standard sequence", () => {
    const solver = new GeometricSequenceSolver("2, 4, 9, 16, 32");
    expect(solver.isGeometric()).toBe(false);
    expect(solver.getGeometricPattern()).toBeNull();
    expect(() => solver.nthTerm(3)).toThrow("Sequence is not geometric.");
  });

  test("should correctly parse a standard sequence with whitespace delimiters", () => {
    const solver = new GeometricSequenceSolver("3 6 12 24");
    expect(solver.isGeometric()).toBe(true);
    const pattern = solver.getGeometricPattern();
    expect(pattern.sequence).toEqual([3, 6, 12, 24]);
    expect(solver.nthTerm(2)).toBe(6);
  });

  test("should correctly parse a standard sequence where first term is 0 and all terms are 0", () => {
    const solver = new GeometricSequenceSolver("0, 0, 0");
    expect(solver.isGeometric()).toBe(true);
    const pattern = solver.getGeometricPattern();
    expect(pattern).toEqual({
      firstTerm: 0,
      commonRatio: 0,
      sequence: [0, 0, 0],
    });
    expect(solver.nthTerm(5)).toBe(0);
  });

  // --- Ellipsis Sequence Tests ---
  test("should correctly parse a valid ellipsis geometric sequence", () => {
    const solver = new GeometricSequenceSolver("2 * 4 * 8 * ... * 256");
    expect(solver.isGeometric()).toBe(true);
    const pattern = solver.getGeometricPattern();
    expect(pattern.type).toBe("ellipsis");
    expect(pattern.firstTerm).toBe(2);
    expect(pattern.commonRatio).toBe(2);
    expect(pattern.lastTerm).toBe(256);
    // For sequence 2,4,8,...,256: number of terms = log2(256/2)+1 = log2(128)+1 = 7+1 = 8
    expect(pattern.numberOfTerms).toBe(8);
    expect(pattern.sequence).toEqual([2, 4, 8, 16, 32, 64, 128, 256]);
    expect(solver.nthTerm(5)).toBe(32);
  });

  test("should correctly parse an ellipsis sequence with commas as delimiters", () => {
    const solver = new GeometricSequenceSolver("2,4,8,...,256");
    expect(solver.isGeometric()).toBe(true);
    const pattern = solver.getGeometricPattern();
    expect(pattern.firstTerm).toBe(2);
    expect(pattern.commonRatio).toBe(2);
    expect(pattern.lastTerm).toBe(256);
  });

  test("should throw error for ellipsis sequence with fewer than two numbers before ellipsis", () => {
    expect(() => new GeometricSequenceSolver("2 * ... * 16")).toThrow(
      "At least two numbers are required before the ellipsis to determine the pattern."
    );
  });

  test("should throw error for ellipsis sequence that starts with an ellipsis", () => {
    expect(() => new GeometricSequenceSolver("... * 16")).toThrow(
      "Sequence cannot start with an ellipsis."
    );
  });

  test("should throw error for ellipsis sequence with no final term", () => {
    expect(() => new GeometricSequenceSolver("2 * 4 * 8 * ...")).toThrow(
      "Sequence must specify a final term after the ellipsis."
    );
  });

  test("should throw error if the final term does not fit the progression in an ellipsis sequence", () => {
    expect(() => new GeometricSequenceSolver("2 * 4 * 8 * ... * 300")).toThrow(
      "Last term does not fit the geometric progression pattern."
    );
  });

  test("should correctly parse an ellipsis sequence where first term is 0 and all terms are 0", () => {
    const solver = new GeometricSequenceSolver("0 * 0 * 0 * ... * 0");
    expect(solver.isGeometric()).toBe(true);
    const pattern = solver.getGeometricPattern();
    expect(pattern.firstTerm).toBe(0);
    expect(pattern.commonRatio).toBe(0);
    expect(pattern.lastTerm).toBe(0);
    // number of terms equals initial count + 1
    expect(pattern.numberOfTerms).toBe(4);
    expect(pattern.sequence).toEqual([0, 0, 0, 0]);
    expect(solver.nthTerm(10)).toBe(0);
  });

  test("should throw error for ellipsis sequence where first term is 0 but not all terms are 0", () => {
    expect(() => new GeometricSequenceSolver("0 * 2 * ... * 0")).toThrow(
      "Invalid sequence: first term is 0 but not all terms are 0."
    );
  });

  test("should correctly parse an ellipsis sequence with ratio 1 (constant sequence)", () => {
    const solver = new GeometricSequenceSolver("5 * 5 * 5 * ... * 5");
    expect(solver.isGeometric()).toBe(true);
    const pattern = solver.getGeometricPattern();
    expect(pattern.firstTerm).toBe(5);
    expect(pattern.commonRatio).toBe(1);
    expect(pattern.lastTerm).toBe(5);
    // number of terms equals initial count + 1 (here 4)
    expect(pattern.numberOfTerms).toBe(4);
    expect(pattern.sequence).toEqual([5, 5, 5, 5]);
    expect(solver.nthTerm(10)).toBe(5);
  });

  // --- nthTerm Argument Validation ---
  test("nthTerm should throw error when called with n not a positive integer", () => {
    const solver = new GeometricSequenceSolver("2,4,8,16,32");
    expect(() => solver.nthTerm(0)).toThrow("n must be a positive integer.");
    expect(() => solver.nthTerm(-3)).toThrow("n must be a positive integer.");
    expect(() => solver.nthTerm(1.5)).toThrow("n must be a positive integer.");
    expect(() => solver.nthTerm("3")).toThrow("n must be a positive integer.");
  });
});