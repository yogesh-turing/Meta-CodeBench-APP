const { ShippingCalculator, AirShipping, ShippingStrategy, SeaShipping, GroundShipping } = require('./correct');
  
  describe("ShippingCalculator", () => {
    let calculator;
  
    beforeEach(() => {
      calculator = new ShippingCalculator(10); // Base rate of 10
    });
  
    describe("Default Shipping Methods", () => {
      it("should calculate cost for air shipping (domestic)", () => {
        const cost = calculator.calculateCost(5, "domestic", "air");
        expect(cost).toBe(100); // (10 * 5) + 50 = 100
      });
  
      it("should calculate cost for air shipping (international)", () => {
        const cost = calculator.calculateCost(5, "international", "air");
        expect(cost).toBe(200); // (10 * 5) + 50 + 100 = 200
      });
  
      it("should calculate cost for sea shipping (domestic)", () => {
        const cost = calculator.calculateCost(5, "domestic", "sea");
        expect(cost).toBe(40); // (10 * 5) * 0.8 = 40
      });
  
      it("should calculate cost for sea shipping (international)", () => {
        const cost = calculator.calculateCost(5, "international", "sea");
        expect(cost).toBe(120); // (10 * 5) * 0.8 + 80 = 120
      });
  
      it("should calculate cost for ground shipping (domestic)", () => {
        const cost = calculator.calculateCost(5, "domestic", "ground");
        expect(cost).toBe(70); // (10 * 5) + 20 = 70
      });
  
      it("should calculate cost for ground shipping (international)", () => {
        const cost = calculator.calculateCost(5, "international", "ground");
        expect(cost).toBe(130); // (10 * 5) + 20 + 60 = 130
      });
  
      it("should default to ground shipping if method is not specified", () => {
        const cost = calculator.calculateCost(5, "domestic");
        expect(cost).toBe(70); // Defaults to ground shipping
      });
    });
  
    describe("Edge Cases", () => {
      it("should handle zero weight", () => {
        const cost = calculator.calculateCost(0, "domestic", "air");
        expect(cost).toBe(50); // (10 * 0) + 50 = 50
      });
  
      it("should handle negative weight (invalid input)", () => {
        expect(() => calculator.calculateCost(-5, "domestic", "air")).toThrow();
      });
    });
  
    describe("Adding Custom Shipping Methods", () => {
      it("should allow adding a new shipping method and calculate cost correctly", () => {
        class ExpressShipping extends ShippingStrategy {
          calculateCost(weight, destination) {
            let cost = this.baseRate * weight + 100; // Use this.baseRate
            if (destination === "international") {
              cost += 150;
            }
            return cost;
          }
        }
  
        // Pass the baseRate when creating the ExpressShipping instance
        calculator.addShippingMethod("express", new ExpressShipping(10));
        const cost = calculator.calculateCost(5, "international", "express");
        expect(cost).toBe(300); // (10 * 5) + 100 + 150 = 300
      });
    });
  });
  
  describe("ShippingStrategy Subclasses", () => {
    const baseRate = 10;
  
    it("AirShipping should calculate cost correctly", () => {
      const airShipping = new AirShipping(baseRate);
      expect(airShipping.calculateCost(5, "domestic")).toBe(100); // (10 * 5) + 50 = 100
      expect(airShipping.calculateCost(5, "international")).toBe(200); // (10 * 5) + 50 + 100 = 200
    });
  
    it("SeaShipping should calculate cost correctly", () => {
      const seaShipping = new SeaShipping(baseRate);
      expect(seaShipping.calculateCost(5, "domestic")).toBe(40); // (10 * 5) * 0.8 = 40
      expect(seaShipping.calculateCost(5, "international")).toBe(120); // (10 * 5) * 0.8 + 80 = 120
    });
  
    it("GroundShipping should calculate cost correctly", () => {
      const groundShipping = new GroundShipping(baseRate);
      expect(groundShipping.calculateCost(5, "domestic")).toBe(70); // (10 * 5) + 20 = 70
      expect(groundShipping.calculateCost(5, "international")).toBe(130); // (10 * 5) + 20 + 60 = 130
    });
  });
  