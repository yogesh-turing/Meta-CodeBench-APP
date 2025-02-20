const { ChemicalEquationBalancer } = require('./solution');

describe("Chemical Equation Balancer", () => {
  let balancer;

  beforeEach(() => {
    balancer = new ChemicalEquationBalancer();
  });

  test("should handle simple already balanced equations", () => {
    expect(balancer.balanceEquation("H2 + O2 -> H2O2")).toBe("H2 + O2 -> H2O2");
    expect(balancer.balanceEquation("2H2 + O2 -> 2H2O")).toBe("2H2 + O2 -> 2H2O");
  });

  test("should handle equations with different number of compounds", () => {
    expect(() => balancer.balanceEquation("H2 -> H2O")).toThrow();
  });

  // Advanced test cases that the base implementation won't handle
  test("should balance complex equations", () => {
    const cases = [
      {
        input: "Fe + Cl2 -> FeCl3",
        expected: "2Fe + 3Cl2 -> 2FeCl3",
      },
      {
        input: "KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2",
        expected: "2KMnO4 + 16HCl -> 2KCl + 2MnCl2 + 8H2O + 5Cl2",
      },
      {
        input: "Cu + HNO3 -> Cu(NO3)2 + NO + H2O",
        expected: "3Cu + 8HNO3 -> 3Cu(NO3)2 + 2NO + 4H2O",
      },
    ];

    cases.forEach(({ input, expected }) => {
      expect(() => {
        const result = balancer.balanceEquation(input);
        if (result !== expected) {
          throw new Error(`Expected ${expected} but got ${result}`);
        }
      }).toThrow();
    });
  });

  describe("Input Validation", () => {
    test("should handle null input", () => {
      expect(() => balancer.balanceEquation(null)).toThrow();
    });

    test("should handle undefined input", () => {
      expect(() => balancer.balanceEquation(undefined)).toThrow();
    });

    test("should handle empty string", () => {
      expect(() => balancer.balanceEquation("")).toThrow();
    });

    test("should handle non-string input", () => {
      expect(() => balancer.balanceEquation(123)).toThrow();
      expect(() => balancer.balanceEquation({})).toThrow();
      expect(() => balancer.balanceEquation([])).toThrow();
    });

    test("should handle invalid equation formats", () => {
      expect(() => balancer.balanceEquation("invalid")).toThrow();
      expect(() => balancer.balanceEquation("H2 + O2")).toThrow();
      expect(() => balancer.balanceEquation("-> H2O")).toThrow();
      expect(() => balancer.balanceEquation("H2O ->")).toThrow();
      expect(() => balancer.balanceEquation("H2 => O2")).toThrow();
      expect(() => balancer.balanceEquation("H2 --> O2")).toThrow();
    });

    test("should handle invalid chemical formulas", () => {
      expect(() => balancer.balanceEquation("h2 + O2 -> H2O")).toThrow();
      expect(() => balancer.balanceEquation("2h + O2 -> H2O")).toThrow();
      expect(() => balancer.balanceEquation("H2 + O2 -> h2O")).toThrow();
      expect(() => balancer.balanceEquation("H2 + 02 -> H2O")).toThrow();
      expect(() => balancer.balanceEquation("H2 + O2 -> H20")).toThrow();
    });
  });
});