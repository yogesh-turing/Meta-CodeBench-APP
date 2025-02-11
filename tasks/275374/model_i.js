function ShippingCalculator(baseRate) {
    const strategies = {};
  
    function calculateCost(weight, destination, method = "ground") {
      if (weight < 0) {
        throw new Error("Weight cannot be negative.");
      }
  
      if (!strategies[method]) {
        throw new Error(`Shipping method '${method}' is not supported.`);
      }
  
      return strategies[method].calculateCost(weight, destination);
    }
  
    function addShippingMethod(methodName, strategy) {
      strategies[methodName] = strategy;
    }
  
    // Register default shipping methods
    addShippingMethod("air", AirShipping(baseRate));
    addShippingMethod("sea", SeaShipping(baseRate));
    addShippingMethod("ground", GroundShipping(baseRate));
  
    return {
      calculateCost,
      addShippingMethod,
    };
  }
  
  function ShippingStrategy(baseRate) {
    return {
      baseRate,
      calculateCost: function (weight, destination) {
        throw new Error("calculateCost method must be implemented by subclasses");
      },
    };
  }
  
  function AirShipping(baseRate) {
    return {
      baseRate,
      calculateCost: function (weight, destination) {
        let cost = this.baseRate * weight + 50;
        if (destination === "international") {
          cost += 100;
        }
        return cost;
      },
    };
  }
  
  function SeaShipping(baseRate) {
    return {
      baseRate,
      calculateCost: function (weight, destination) {
        let cost = this.baseRate * weight * 0.8;
        if (destination === "international") {
          cost += 80;
        }
        return cost;
      },
    };
  }
  
  function GroundShipping(baseRate) {
    return {
      baseRate,
      calculateCost: function (weight, destination) {
        let cost = this.baseRate * weight + 20;
        if (destination === "international") {
          cost += 60;
        }
        return cost;
      },
    };
  }
  
  module.exports = {
    ShippingCalculator,
    ShippingStrategy,
    AirShipping,
    SeaShipping,
    GroundShipping,
  };