// Base class for all shipping strategies
function ShippingStrategy(baseRate) {
    this.baseRate = baseRate;
  }
  
  ShippingStrategy.prototype.calculateCost = function(weight, destination) {
    throw new Error("calculateCost method must be implemented by subclasses");
  };
  
  // Specific shipping strategies
  function AirShipping(baseRate) {
    ShippingStrategy.call(this, baseRate);
  }
  
  AirShipping.prototype.calculateCost = function(weight, destination) {
    let cost = this.baseRate * weight + 50;
    if (destination === "international") {
      cost += 100;
    }
    return cost;
  };
  
  function SeaShipping(baseRate) {
    ShippingStrategy.call(this, baseRate);
  }
  
  SeaShipping.prototype.calculateCost = function(weight, destination) {
    let cost = this.baseRate * weight * 0.8;
    if (destination === "international") {
      cost += 80;
    }
    return cost;
  };
  
  function GroundShipping(baseRate) {
    ShippingStrategy.call(this, baseRate);
  }
  
  GroundShipping.prototype.calculateCost = function(weight, destination) {
    let cost = this.baseRate * weight + 20;
    if (destination === "international") {
      cost += 60;
    }
    return cost;
  };
  
  // Shipping calculator class
  function ShippingCalculator(baseRate) {
    this.baseRate = baseRate;
    this.methods = {};
  }
  
  ShippingCalculator.prototype.calculateCost = function(weight, destination, method) {
    if (weight < 0) {
      throw new Error("Weight cannot be negative");
    }
  
    if (!this.methods[method]) {
      throw new Error(`Shipping method '${method}' is not supported`);
    }
  
    return this.methods[method].calculateCost(weight, destination);
  };
  
  ShippingCalculator.prototype.addShippingMethod = function(methodName, strategy) {
    this.methods[methodName] = strategy;
  };
  
  // Export all classes
  module.exports = {
    ShippingCalculator,
    ShippingStrategy,
    AirShipping,
    SeaShipping,
    GroundShipping
  };