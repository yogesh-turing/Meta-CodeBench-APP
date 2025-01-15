const { calculator } = require('./incorrect');

describe("Calculator Function Tests", () => {
  let calc;

  beforeEach(() => {
    calc = calculator();
  });

  test("Initial state should return 0", () => {
    expect(calc.getResult()).toBe(0);
  });

  test("Addition should work correctly", () => {
    calc.add(10);
    expect(calc.getResult()).toBe(10);
  });

  test("Addition with multiple params should work correctly", () => {
    calc.add(10, 12, 12);
    expect(calc.getResult()).toBe(34);
  });

  test("Subtraction should work correctly", () => {
    calc.add(10).subtract(5);
    expect(calc.getResult()).toBe(5);
  });

  test("Subtraction with multiple params should work correctly", () => {
    calc.add(10).subtract(5, 2);
    expect(calc.getResult()).toBe(3);
  });

  test("Multiplication should work correctly", () => {
    calc.add(2).multiply(3);
    expect(calc.getResult()).toBe(6);
  });

  test("Multiplication with multiple params should work correctly", () => {
    calc.add(2).multiply(3, 2);
    expect(calc.getResult()).toBe(12);
  });

  test("Division should work correctly", () => {
    calc.add(20).divide(4);
    expect(calc.getResult()).toBe(5);
  });

  test("Division with multiple params should work correctly", () => {
    calc.add(20).divide(4, 5);
    expect(calc.getResult()).toBe(1);
  });

  test("Precision should work correctly", () => {
    calc.add(10).divide(3);
    expect(calc.getResult(2)).toBe(3.33);
  });

  test("Chaining multiple operations should work correctly", () => {
    calc.add(5).multiply(4).subtract(10).divide(2);
    expect(calc.getResult()).toBe(5);
  });

  test("Chaining multiple operations should work correctly", () => {
    calc.add(5).multiply(4).subtract(10).divide(2);
    expect(calc.getResult()).toBe(5);
    expect(calc.add(5).getResult()).toBe(10);
  });

  test("Chaining operations with multiple params should work correctly", () => {
    calc.add(4, 5).subtract(3).multiply(4).divide(2);
    expect(calc.getResult()).toBe(12);
  });

  test("Division by zero should throw an error", () => {
    expect(() => {
      calc.add(10).divide(0);
    }).toThrow("Error encountered");
  });

  test("Invalid input should throw an error", () => {
    expect(() => {
      calc.add(null).add(2).getResult();
    }).toThrow("Error encountered");
  });

  test("Invalid input should throw an error", () => {
    expect(() => {
      calc.add("1").divide(1).getResult();
    }).toThrow("Error encountered");
    expect(() => {
      calc.add(1).subtract("1").getResult();
    }).toThrow("Error encountered");
    expect(() => {
      calc.add(1).multiply("1").getResult();
    }).toThrow("Error encountered");
  });

  test("Invalid input with multiple params should throw an error", () => {
    expect(() => {
      calc.add(1, "1").divide(1).getResult();
    }).toThrow("Error encountered");
  });

  test("Null precision should throw an error", () => {
    expect(() => {
      calc.add(1).divide(1).getResult(null);
    }).toThrow("Error encountered");
  });

  test("Invalid precision should throw an error", () => {
    expect(() => {
      calc.add(1).divide(1).getResult("2");
    }).toThrow("Error encountered");
  });

  test("first subtraction should work correctly", () => {
    calc.subtract(10);
    expect(calc.getResult()).toBe(-10);
  });
});