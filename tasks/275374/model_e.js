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
        if (baseRate <= 0) {
            throw new Error("Base rate must be positive");
        }
        this.baseRate = baseRate;
        this.methods = {
            air: new AirShipping(baseRate),
            sea: new SeaShipping(baseRate),
            ground: new GroundShipping(baseRate)
        };
    }

    calculateCost(weight, destination, method = "ground") {
        if (weight <= 0) {
            throw new Error("Weight must be positive");
        }
        
        if (!["domestic", "international"].includes(destination)) {
            throw new Error("Destination must be either 'domestic' or 'international'");
        }

        const strategy = this.methods[method];
        if (!strategy) {
            throw new Error(`Shipping method '${method}' is not supported`);
        }

        return strategy.calculateCost(weight, destination);
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