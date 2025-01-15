const { validateEquation } = require('./correct');

describe("Equation Validator", () => {
  // Valid Equation Tests
  describe("Valid Equations", () => {
    const validEquations = [
      "2 + 3 * (4 - 1)",
      "(2 + 3) * (4 - 1)",
      "10 / 5",
      "(10 + 20) * 3 - 15",
      "2.5 + 3.7",
      "100",
      "0",

      // valid equation with all operators
        "2 + 3 - 4 * 5 / 6",
      // valid equation with all operators and parentheses
        "(2 + 3) - 4 * (5 / 6)",
        // valid equation with all operators and decimal numbers
        "2.5 + 3.7 - 4.8 * 5.9 / 6.1",
        // valid equation with all operators, parentheses, and decimal numbers
        "(2.5 + 3.7) - 4.8 * (5.9 / 6.1)",
        // valid equation with all operators, parentheses, and negative numbers
        "(-2 + 3) * (-4 - 5) / -6",
        // valid equation with all operators, parentheses, negative numbers, and decimal numbers
        "(-2.5 + 3.7) * (-4.8 - 5.9) / -6.1",
        // valid equation with all operators, nested parentheses
        "((2 + 3) * (4 - 1)) / 5",
    ];

    validEquations.forEach((equation) => {
      test(`should validate valid equation: ${equation}`, () => {
        const result = validateEquation(equation);
        expect(result.isValid).toBe(true);
      });
    });
  });

  // Invalid Equation Tests
  describe("Invalid Equations", () => {
    const invalidTestCases = [
      // Empty and Whitespace Cases
      {
        equation: "",
      },
      {
        equation: "   ",
      },

      // Invalid Character Cases
      {
        equation: "2 + 3 * abc",
      },
      {
        equation: "2 @ 3",
      },

      // Operator Sequence Issues
      {
        equation: "2 + 3 *",
      },
      {
        equation: "2 ++ 3",
      },
      {
        equation: "/3",
      },

      // Parentheses Problems
      {
        equation: "(2 + 3",
      },
      {
        equation: ")",
      },
      {
        equation: "()",
      },

      // Division by Zero Cases
      {
        equation: "3 / 0",
      },
      {
        equation: "10 / (5 - 5)",
      },

      // Decimal and Number Issues
      {
        equation: "2..3",
      },
      {
        equation: "2.",
      },
      {
        equation: ".5",
      },

      // Complex Structural Issues
      {
        equation: "2 + * 3",
      },
      {
        equation: "(2 + ) 3",
      },
    ];

    invalidTestCases.forEach(({ equation }) => {
      test(`should invalidate equation: ${equation}`, () => {
        const result = validateEquation(equation);
        if (result.isValid) {
            console.log(equation, result);
        }
        expect(result.isValid).toBe(false);
        expect(typeof result.errorMessage).toBe("string");
        expect(result.errorMessage.length).toBeGreaterThan(0);
        expect(typeof result.suggestion).toBe("string");
      });
    });
  });

  // Edge Case Specific Tests
  describe("Edge Case Validations", () => {
    test("should detect unbalanced nested parentheses", () => {
      const result = validateEquation("((2 + 3) * (4 - 1)");
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toMatch(new RegExp("parentheses", "i"));
    });

    test("should validate equations with decimal numbers", () => {
      const result = validateEquation("2.5 + 3.7 * 2");
      expect(result.isValid).toBe(true);
    });
  });
});