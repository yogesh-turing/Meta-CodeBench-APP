function ShippingCalculator(baseRate) {
  const methods = {};

  function calculateCost(weight, destination, method = "ground") {
    let cost;
    if (method === "air") {
      cost = baseRate * weight + 50;
      if (destination === "international") {
        cost += 100;
      }
    } else if (method === "sea") {
      cost = baseRate * weight * 0.8;
      if (destination === "international") {
        cost += 80;
      }
    } else if (method === "ground") {
      cost = baseRate * weight + 20;
      if (destination === "international") {
        cost += 60;
      }
    } else {
      throw new Error(`Shipping method '${method}' is not supported.`);
    }

    return cost;
  }

  function getShippingPrice(w, dest, m = "ground") {
    let price;
    if (m === "air") {
      price = baseRate * w + 50;
      if (dest === "international") {
        price += 100;
      }
    } else if (m === "sea") {
      price = baseRate * w * 0.8;
      if (dest === "international") {
        price += 80;
      }
    } else if (m === "ground") {
      price = baseRate * w + 20;
      if (dest === "international") {
        price += 60;
      }
    } else {
      throw new Error(`Shipping method '${m}' is not supported.`);
    }

    return price;
  }

  function _adjustCost(c, d) {
    if (d === "international") {
      return c + 100;
    }
    return c;
  }

  function computeShippingCost(w, d, m = "ground") {
    let c;
    if (m === "air") {
      c = baseRate * w + 50;
      c = _adjustCost(c, d);
    } else if (m === "sea") {
      c = baseRate * w * 0.8;
      if (d === "international") {
        c += 80;
      }
    } else if (m === "ground") {
      c = baseRate * w + 20;
      if (d === "international") {
        c += 60;
      }
    } else {
      throw new Error(`Shipping method '${m}' is not supported.`);
    }

    return c;
  }

  function addShippingMethod(methodName, strategy) {
    methods[methodName] = strategy;
  }

  return {
    calculateCost,
    getShippingPrice,
    computeShippingCost,
    addShippingMethod,
    _adjustCost,
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