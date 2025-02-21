const { chainRuleDerivative } = require('./alternate_responses/incorrect_solution');

describe("Polynomial Derivative Calculator", () => {
  describe("Valid Inputs", () => {
    test("standard integer input", () => {
      const input = "(3x^2)^5";
      const expected = "The derivative of the polynomial using chain rule is: 5(3x^2)^4 (6x^1)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });

    test("omitted coefficient (default 1)", () => {
      const input = "(x^3)^2";
      const expected = "The derivative of the polynomial using chain rule is: 2(1x^3)^1 (3x^2)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });

    test("negative exponents and coefficients", () => {
      const input = "(-2x^-3)^4";
      const expected = "The derivative of the polynomial using chain rule is: 4(-2x^-3)^3 (6x^-4)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });

    test("decimal values", () => {
      const input = "(2.5x^3.5)^2";
      const expected = "The derivative of the polynomial using chain rule is: 2(2.5x^3.5)^1 (8.75x^2.5)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });

    test("inner exponent results in zero exponent", () => {
      const input = "(5x^1)^3";
      const expected = "The derivative of the polynomial using chain rule is: 3(5x^1)^2 (5x)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });

    test("decimal coefficient without leading zero", () => {
      const input = "(.5x^2)^3";
      const expected = "The derivative of the polynomial using chain rule is: 3(0.5x^2)^2 (1x^1)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });

    test("outer exponent of 1", () => {
      const input = "(2x^3)^1";
      const expected = "The derivative of the polynomial using chain rule is: 1(2x^3)^0 (6x^2)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });

    test("zero outer exponent", () => {
      const input = "(2x^3)^0";
      const expected = "The derivative of the polynomial using chain rule is: 0(2x^3)^-1 (6x^2)";
      expect(chainRuleDerivative(input)).toBe(expected);
    });
  });

  describe("Invalid Inputs", () => {
    test("missing closing parenthesis", () => {
      const input = "(3x^2^5";
      expect(() => chainRuleDerivative(input)).toThrow();
    });

    test("missing x component", () => {
      const input = "(3^2)^5";
      expect(() => chainRuleDerivative(input)).toThrow();
    });

    test("non-numeric exponent", () => {
      const input = "(3x^a)^5";
      expect(() => chainRuleDerivative(input)).toThrow();
    });

    test("empty input string", () => {
      const input = "";
      expect(() => chainRuleDerivative(input)).toThrow();
    });

    test("missing caret in exponent", () => {
      const input = "(3x2)^5";
      expect(() => chainRuleDerivative(input)).toThrow();
    });

    test("missing outer exponent", () => {
      const input = "(3x^2)";
      expect(() => chainRuleDerivative(input)).toThrow();
    });

    test("multiple carets in inner expression", () => {
      const input = "(3x^2^5)^3";
      expect(() => chainRuleDerivative(input)).toThrow();
    });
  });
});