class ShippingStrategy {
  constructor(baseRate) {
    this.baseRate = baseRate;
  }

  calculateCost(weight, destination) {
    throw new Error("calculateCost method must be implemented by subclasses");
  }
}

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

class ShippingCalculator {
  constructor(baseRate) {
    this.baseRate = baseRate;
    this.methods = {};
  }

  addShippingMethod(methodName, strategy) {
    this.methods[methodName] = strategy;
  }

  calculateCost(weight, destination, method = "ground") {
    if (weight < 0) {
      throw new Error("Weight cannot be negative.");
    }

    if (!this.methods[method]) {
      throw new Error(`Shipping method '${method}' is not supported.`);
    }

    const strategy = this.methods[method];
    return strategy.calculateCost(weight, destination);
  }
}

module.exports = {
  ShippingCalculator,
  ShippingStrategy,
  AirShipping,
  SeaShipping,
  GroundShipping,
};