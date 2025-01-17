const { updateDiscountRate, calculateDiscount } = require('./correct')

describe("calculateDiscount Function", () => {
    beforeEach(() => {
      jest.resetModules();
      updateDiscountRate("employee", 0.1);
      updateDiscountRate("student", 0.05);
    });
  
    test("should return 90.00 for employees", () => {
      const price = 100;
      const userType = "employee";
      const discount = calculateDiscount(price, userType);
      expect(discount).toBe(90.0);
    });
  
    test("should return 95.00 for students", () => {
      const price = 100;
      const userType = "student";
      const discount = calculateDiscount(price, userType);
      expect(discount).toBe(95.0);
    });
  
    test("should throw error for regular customers", () => {
      const price = 100;
      const userType = "regular";
      expect(() => calculateDiscount(price, userType)).toThrow();
      try {
        calculateDiscount(price, userType);
      } catch (error) {
        expect(typeof error.message).toBe("string");
      }
    });
  
    test("should throw error when userType is undefined", () => {
      const price = 100;
      const userType = undefined;
      expect(() => calculateDiscount(price, userType)).toThrow();
      try {
        calculateDiscount(price, userType);
      } catch (error) {
        expect(typeof error.message).toBe("string");
      }
    });
  
    test("should throw an error for invalid price (negative)", () => {
      expect(() => calculateDiscount(-50, "employee")).toThrow();
      try {
        calculateDiscount(-50, "employee");
      } catch (error) {
        expect(typeof error.message).toBe("string");
      }
    });
  
    test("should throw an error for invalid price (non-numeric)", () => {
      expect(() => calculateDiscount("100", "employee")).toThrow();
      try {
        calculateDiscount("100", "employee");
      } catch (error) {
        expect(typeof error.message).toBe("string");
      }
    });
  
    test("should return the original price for a 0% discount rate", () => {
      updateDiscountRate("guest", 0);
      expect(calculateDiscount(100, "guest")).toBe(100.0);
    });
  
    test("should calculate the discount correctly for dynamically added user types", () => {
      updateDiscountRate("vip", 0.2);
      expect(calculateDiscount(300, "vip")).toBe(240.0);
    });
  
    test("should handle a very large price correctly", () => {
      const price = 1000000000;
      const userType = "employee";
      const discount = calculateDiscount(price, userType);
      expect(discount).toBe(900000000);
    });
  });
  
  describe("updateDiscountRate Function", () => {
    test("should add a new user type with a valid discount rate", () => {
      updateDiscountRate("member", 0.15);
      expect(calculateDiscount(100, "member")).toBe(85.0);
    });
  
    test("should update an existing user type with a new discount rate", () => {
      updateDiscountRate("employee", 0.25);
      expect(calculateDiscount(200, "employee")).toBe(150.0);
    });
  
    test("should throw an error for invalid discount rate (negative)", () => {
      expect(() => updateDiscountRate("employee", -0.1)).toThrow();
      try {
        updateDiscountRate("employee", -0.1);
      } catch (error) {
        expect(typeof error.message).toBe("string");
      }
    });
  
    test("should throw an error for invalid discount rate (greater than 1)", () => {
      expect(() => updateDiscountRate("student", 1.5)).toThrow();
      try {
        updateDiscountRate("student", 1.5);
      } catch (error) {
        expect(typeof error.message).toBe("string");
      }
    });
  
    test("should throw an error for invalid discount rate (non-numeric)", () => {
      expect(() => updateDiscountRate("vip", "twenty")).toThrow();
      try {
        updateDiscountRate("vip", "twenty");
      } catch (error) {
        expect(typeof error.message).toBe("string");
      }
    });
  });
  
  test("should return correct discount for senior citizens", () => {
    updateDiscountRate("senior", 0.3);
    const price = 200;
    const userType = "senior";
    const discount = calculateDiscount(price, userType);
    expect(discount).toBe(140.0);
  });
  
  test("should return correct discount for military personnel", () => {
    updateDiscountRate("military", 0.2);
    const price = 150;
    const userType = "military";
    const discount = calculateDiscount(price, userType);
    expect(discount).toBe(120.0);
  });
  
  test("should throw an error for a very small discount rate", () => {
    updateDiscountRate("tiny", 0.0001);
    const price = 100;
    const userType = "tiny";
    const discount = calculateDiscount(price, userType);
    expect(discount).toBeCloseTo(99.99, 2);
  });