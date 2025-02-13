class ShippingStrategy {
    constructor(baseRate) {
        if (baseRate <= 0) {
            throw new Error("Base rate must be positive");
        }
        this.baseRate = baseRate;
    }

    calculateCost(weight, destination) {
        throw new Error("calculateCost method must be implemented by subclasses");
    }
}

class AirShipping extends ShippingStrategy {
    calculateCost(weight, destination) {
        if (weight <= 0) {
            throw new Error("Weight must be positive");
        }
        let cost = this.baseRate * weight + 50;
        return destination === "international" ? cost + 100 : cost;
    }
}

class SeaShipping extends ShippingStrategy {
    calculateCost(weight, destination) {
        if (weight <= 0) {
            throw new Error("Weight must be positive");
        }
        let cost = this.baseRate * weight * 0.8;
        return destination === "international" ? cost + 80 : cost;
    }
}

class GroundShipping extends ShippingStrategy {
    calculateCost(weight, destination) {
        if (weight <= 0) {
            throw new Error("Weight must be positive");
        }
        let cost = this.baseRate * weight + 20;
        return destination === "international" ? cost + 60 : cost;
    }
}

class ShippingCalculator {
    constructor(baseRate) {
        if (baseRate <= 0) {
            throw new Error("Base rate must be positive");
        }
        this.baseRate = baseRate;
        this.methods = {
            ground: new GroundShipping(baseRate),
            air: new AirShipping(baseRate),
            sea: new SeaShipping(baseRate)
        };
    }

    calculateCost(weight, destination, method = "ground") {
        if (weight <= 0) {
            throw new Error("Weight must be positive");
        }
        if (!["domestic", "international"].includes(destination)) {
            throw new Error("Destination must be either 'domestic' or 'international'");
        }
        if (!this.methods[method]) {
            throw new Error(`Shipping method '${method}' is not supported`);
        }

        return this.methods[method].calculateCost(weight, destination);
    }

    addShippingMethod(methodName, strategy) {
        if (!(strategy instanceof ShippingStrategy)) {
            throw new Error("Strategy must be an instance of ShippingStrategy");
        }
        this.methods[methodName] = strategy;
    }
}

module.exports = {
    ShippingCalculator,
    ShippingStrategy,
    AirShipping,
    SeaShipping,
    GroundShipping
};