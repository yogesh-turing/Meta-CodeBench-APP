// Base class for all shipping strategies
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
  
  // Shipping calculator class
  class ShippingCalculator {
    constructor(baseRate) {
      this.baseRate = baseRate;
      this.shippingMethods = {};
    }
  
    calculateCost(weight, destination, method) {
      if (weight < 0) {
        throw new Error("Weight cannot be negative");
      }
  
      const strategy = this.shippingMethods[method];
      if (!strategy) {
        throw new Error(`Shipping method '${method}' is not supported`);
      }
  
      return strategy.calculateCost(weight, destination);
    }
  
    addShippingMethod(methodName, strategy) {
      this.shippingMethods[methodName] = strategy;
    }
  }
  
  module.exports = {
    ShippingCalculator,
    ShippingStrategy,
    AirShipping,
    SeaShipping,
    GroundShipping,
  };