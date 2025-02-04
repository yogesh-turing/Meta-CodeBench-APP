class DiscountStrategy {
    static getPremiumDiscount() { return 0.1; }
    static getWholesaleDiscount() { return 0.2; }
    static getLoyaltyDiscount() { return 0.05; }

    calculate(user) {
        if (user.type === 'premium') return this.getPremiumDiscount();
        if (user.type === 'wholesale') return this.getWholesaleDiscount();
        if (user.loyaltyPoints > 100) return this.getLoyaltyDiscount();
        return 0;
    }
}

class TaxCalculator {
    static getTaxRate(category) {
        const taxRates = {
            'electronics': 0.15,
            'clothing': 0.05,
            'default': 0.1
        };
        return taxRates[category] || taxRates.default;
    }

    calculate(product, price) {
        const taxRate = TaxCalculator.getTaxRate(product.category);
        return price * taxRate;
    }
}

class ShippingCalculator {
    static getBaseShippingCost(location) {
        if (location.country !== 'US') return 15;
        
        const stateCosts = {
            'CA': 5,
            'NY': 8,
            'default': 10
        };
        return stateCosts[location.state] || stateCosts.default;
    }

    calculate(location, product, user) {
        let cost = ShippingCalculator.getBaseShippingCost(location);
        
        if (product.weight > 5) {
            cost += 5;
        }

        if (user.type === 'premium') {
            cost *= 0.9;
        }

        return cost;
    }
}

class PriceCalculator {
    constructor() {
        this.discountStrategy = new DiscountStrategy();
        this.taxCalculator = new TaxCalculator();
        this.shippingCalculator = new ShippingCalculator();
    }

    calculate(product, user, location) {
        if (product.price === 0) {
            return { finalPrice: 0 };
        }

        const basePrice = product.price;
        const discount = this.discountStrategy.calculate(user);
        const discountedPrice = basePrice - (basePrice * discount);
        const taxAmount = this.taxCalculator.calculate(product, discountedPrice);
        const shippingCost = this.shippingCalculator.calculate(location, product, user);

        return {
            finalPrice: discountedPrice + taxAmount + shippingCost,
            breakdown: {
                basePrice,
                discountApplied: basePrice * discount,
                taxAmount,
                shippingCost
            }
        };
    }
}

function calculateFinalPrice(product, user, location) {
    const calculator = new PriceCalculator();
    return calculator.calculate(product, user, location);
}

module.exports = { calculateFinalPrice };