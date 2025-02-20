const {
  processAge,
  calculateDigitalRoot,
  calculateModifiedAge,
  processDigitalRoot,
  isHarshad,
} = require("./solution");

describe("Age Calculator Tests", () => {
  describe("calculateDigitalRoot", () => {
    test("should calculate digital root correctly", () => {
      expect(calculateDigitalRoot(0)).toBe(0);
      expect(calculateDigitalRoot(1)).toBe(1);
      expect(calculateDigitalRoot(9)).toBe(9);
      expect(calculateDigitalRoot(11)).toBe(2);
      expect(calculateDigitalRoot(52)).toBe(7);
      expect(calculateDigitalRoot(81)).toBe(9);
    });

    test("should throw error for negative numbers", () => {
      expect(() => calculateDigitalRoot(-1)).toThrow(
        "Number must be non-negative"
      );
    });
  });

  describe("calculateModifiedAge", () => {
    test("should calculate modified age correctly", () => {
      expect(calculateModifiedAge(3)).toBe(2);
      expect(calculateModifiedAge(26)).toBe(17);
      expect(calculateModifiedAge(50)).toBe(33);
      expect(calculateModifiedAge(3)).toBe(2);
    });
  });

  describe("processDigitalRoot", () => {
    test("should process digital root correctly", () => {
      expect(processDigitalRoot(21, 9)).toBe(14);
      expect(processDigitalRoot(20, 9)).toBe(9);
      expect(processDigitalRoot(15, 1)).toBe(1);
      expect(processDigitalRoot(21, 1)).toBe(6);
    });
  });

  describe("isHarshad", () => {
    test("should throw error for invalid inputs", () => {
      expect(() => isHarshad(10, 0)).toThrow("Number must be non-negative");
      expect(() => isHarshad(1, 1)).toThrow("Base must be at least 2");
    });

    test("should correctly identify Harshad numbers", () => {
      expect(isHarshad(10, 10)).toBe(true);
      expect(isHarshad(10, 18)).toBe(true);
      expect(isHarshad(10, 21)).toBe(true);
      expect(isHarshad(10, 1)).toBe(true);
      expect(isHarshad(2, 2)).toBe(true);
      expect(isHarshad(2, 3)).toBe(false);
    });
  });

  describe("processAge integration tests", () => {
    test("should process valid age that results in Harshad number", () => {
      const result = processAge(34);
      expect(result.digitalRoot).toBe(7);
      expect(result.modifiedAge).toBe(22);
      expect(result.finalResult).toBe(5);
      expect(result.message).toBe("Hooray! Your final result is: 5");
    });

    test("should process valid age that does not result in Harshad number", () => {
      const result = processAge(33);
      expect(result.digitalRoot).toBe(6);
      expect(result.modifiedAge).toBe(22);
      expect(result.finalResult).toBe(6);
      expect(result.message).toBe("Your final result is: 6");
    });

    test("should throw error for invalid age", () => {
      expect(() => processAge(0)).toThrow("Age must be a positive integer");
      expect(() => processAge(-1)).toThrow("Age must be a positive integer");
      expect(() => processAge(3.5)).toThrow("Age must be a positive integer");
    });
  });
});
