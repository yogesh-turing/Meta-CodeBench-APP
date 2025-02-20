// mathSeriesParser.test.js
const { ArithmeticSeriesParser } = require("./solution");
const assert = require("assert");
// Begin Mocha tests
describe("ArithmeticSeriesParser", () => {
  // Invalid input: non-string
  it("should throw a TypeError if input is not a string", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser(123);
    }, /Input must be a string/);
  });

  // Empty string input
  it("should throw an error if the input string is empty", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("   ");
    }, /Input series string is empty/);
  });

  // Standard arithmetic series
  it("should correctly parse a standard arithmetic series", () => {
    const parser = new ArithmeticSeriesParser("2, 4, 6, 8, 10");
    assert.strictEqual(parser.isArithmetic(), true);
    const pattern = parser.getArithmeticPattern();
    assert.deepStrictEqual(pattern, {
      firstTerm: 2,
      commonDifference: 2,
      series: [2, 4, 6, 8, 10],
    });
    assert.strictEqual(parser.nthTerm(3), 6);
    assert.strictEqual(parser.nthTerm(5), 10);
  });

  // Standard arithmetic series
  it("should throw error when no tokens are valid in a arithmetic series", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser(",");
    }, /Invalid number encountered: ""/);
  });

  // Single element series
  it("should handle a single-element series as arithmetic with a difference of 0", () => {
    const parser = new ArithmeticSeriesParser("42");
    assert.strictEqual(parser.isArithmetic(), true);
    const pattern = parser.getArithmeticPattern();
    assert.strictEqual(pattern.firstTerm, 42);
    assert.strictEqual(pattern.commonDifference, 0);
    // Even with a single element, nthTerm should work.
    assert.strictEqual(parser.nthTerm(1), 42);
    assert.strictEqual(parser.nthTerm(2), 42);
  });

  // Non-arithmetic standard series
  it("should detect a non-arithmetic standard series", () => {
    const parser = new ArithmeticSeriesParser("2, 4, 7, 8, 10");
    assert.strictEqual(parser.isArithmetic(), false);

    assert.throws(() => {
      assert.strictEqual(parser.getArithmeticPattern(), null);
      parser.nthTerm(3);
    }, /Series is not an arithmetic progression/);
  });

  // Standard series with an invalid token
  it("should throw an error when encountering an invalid number token in a standard series", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("2, 4, seven, 8, 10");
    }, /Invalid number encountered: "seven"/);
  });

  // Valid ellipsis series
  it("should correctly parse an ellipsis series", () => {
    const parser = new ArithmeticSeriesParser("4 + 7 + 10 + ... + 58");
    assert.strictEqual(parser.isArithmetic(), true);
    const pattern = parser.getArithmeticPattern();
    assert.strictEqual(pattern.type, "ellipsis");
    assert.strictEqual(pattern.firstTerm, 4);
    assert.strictEqual(pattern.commonDifference, 3);
    assert.strictEqual(pattern.lastTerm, 58);
    assert.strictEqual(pattern.numberOfTerms, 19); // (58-4)/3 + 1 = 19
    assert.deepStrictEqual(
      pattern.series,
      [4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58]
    );
    assert.strictEqual(parser.nthTerm(7), 22); // 4 + 6*3
  });

  // Valid initial sequence
  it("Should throw error if the initial sequence before ellipsis is not arithmetic", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("4 + 8 + 16 + ... + 58");
    }, /The initial sequence before the ellipsis is not arithmetic/);
  });

  // Ellipsis series with less than 2 numbers before ellipsis
  it("should throw an error for ellipsis series with fewer than two numbers before the ellipsis", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("4 + ... + 58");
    }, /At least two numbers are required before the ellipsis/);
  });

  // Ellipsis series that starts with an ellipsis
  it("should throw an error for an ellipsis series that starts with an ellipsis", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("... + 58");
    }, /Series cannot start with an ellipsis/);
  });

  // Ellipsis series with no final term (ellipsis at the end)
  it("should throw an error for an ellipsis series with no final term", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("4 + 7 + 10 + ...");
    }, /Series must specify a final term after the ellipsis/);
  });

  // Ellipsis series with 0 common difference where the final term does not fit the progression
  it("should throw an error if common difference is 0 but the last term differs", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("1 + 1 + 1 + ... + 60");
    }, /Invalid series: common difference is 0 but the last term differs./);
  });

  // Ellipsis series where the final term does not fit the progression
  it("should throw an error if the final term does not fit the arithmetic progression in an ellipsis series", () => {
    assert.throws(() => {
      new ArithmeticSeriesParser("4 + 7 + 10 + ... + 60");
    }, /Last term does not fit the arithmetic progression pattern/);
  });

  // nthTerm invalid arguments in a standard series
  it("should throw an error when nthTerm is called with an invalid argument", () => {
    const parser = new ArithmeticSeriesParser("2, 4, 6, 8, 10");
    assert.throws(() => {
      parser.nthTerm(0);
    }, /n must be a positive integer/);
    assert.throws(() => {
      parser.nthTerm(-1);
    }, /n must be a positive integer/);
    assert.throws(() => {
      parser.nthTerm(1.5);
    }, /n must be a positive integer/);
  });

  // Ellipsis series with a very large number of terms (> 1000)
  it("should generate an empty full series array for an ellipsis series with more than 1000 terms", () => {
    // firstTerm = 1, secondTerm = 2 (diff = 1), lastTerm = 2000, so numberOfTerms = 2000 > 1000.
    const parser = new ArithmeticSeriesParser("1 + 2 + ... + 2000");
    const pattern = parser.getArithmeticPattern();
    assert.strictEqual(pattern.numberOfTerms, 2000);
    // full series should be empty because numberOfTerms > 1000
    assert.deepStrictEqual(pattern.series, []);
    // nthTerm should still be computed correctly.
    assert.strictEqual(parser.nthTerm(100), 100);
  });

  // Standard series using whitespace as the only delimiter
  it("should correctly parse a standard series with whitespace delimiters", () => {
    const parser = new ArithmeticSeriesParser("2 4 6 8");
    assert.strictEqual(parser.isArithmetic(), true);
    const pattern = parser.getArithmeticPattern();
    assert.deepStrictEqual(pattern.series, [2, 4, 6, 8]);
    assert.strictEqual(parser.nthTerm(2), 4);
  });

  // Ellipsis series with commas as delimiters
  it("should correctly parse an ellipsis series with commas as delimiters", () => {
    const parser = new ArithmeticSeriesParser("4,7,10,...,58");
    assert.strictEqual(parser.isArithmetic(), true);
    const pattern = parser.getArithmeticPattern();
    assert.strictEqual(pattern.firstTerm, 4);
    assert.strictEqual(pattern.commonDifference, 3);
    assert.strictEqual(pattern.lastTerm, 58);
  });
});
