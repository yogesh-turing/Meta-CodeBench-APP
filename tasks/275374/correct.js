// Base class for shipping strategies
class ShippingStrategy {
    constructor(baseRate) {
      this.baseRate = baseRate;
    }
  
    calculateCost(weight, destination) {
      throw new Error("calculateCost method must be implemented by subclasses");
    }
  }
  
  // Specific shipping strategies
  class AirShipping extends ShippingStrategy {
    calculateCost(weight, destination) {
      let cost = this.baseRate * weight + 50;
      if (destination === "international") {
        cost += 100;
      }
      return cost;
    }
  }
  
  class SeaShipping extends ShippingStrategy {
    calculateCost(weight, destination) {
      let cost = this.baseRate * weight * 0.8;
      if (destination === "international") {
        cost += 80;
      }
      return cost;
    }
  }
  
  class GroundShipping extends ShippingStrategy {
    calculateCost(weight, destination) {
      let cost = this.baseRate * weight + 20;
      if (destination === "international") {
        cost += 60;
      }
      return cost;
    }
  }
  
  // ShippingCalculator class
  class ShippingCalculator {
    constructor(baseRate) {
      this.baseRate = baseRate;
      this.methods = {
        air: new AirShipping(baseRate),
        sea: new SeaShipping(baseRate),
        ground: new GroundShipping(baseRate),
      };
    }
  
    addShippingMethod(methodName, strategy) {
      this.methods[methodName] = strategy;
    }
  
    calculateCost(weight, destination, method = "ground") {
      if (weight < 0) {
        throw new Error("Weight cannot be negative.");
      }
      const shippingStrategy = this.methods[method];
      if (!shippingStrategy) {
        throw new Error(`Shipping method '${method}' is not supported.`);
      }
  
      return shippingStrategy.calculateCost(weight, destination);
    }
  }
  
  module.exports = { ShippingCalculator, ShippingStrategy, AirShipping, SeaShipping, GroundShipping };