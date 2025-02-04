class DiscountCalculator {
    calculateDiscount(product, user) {
        if (user.type === 'premium') return 0.1;
        if (user.type === 'wholesale') return 0.2;
        if (user.loyaltyPoints > 100) return 0.05;
        return 0;
    }
}

class TaxCalculator {
    getTaxRate(category) {
        const taxRates = {
            'electronics': 0.15,
            'clothing': 0.05,
            'default': 0.1
        };
        return taxRates[category] || taxRates.default;
    }
}

class ShippingCalculator {
    calculateShippingCost(location, product, user) {
        let shippingCost = this.getBaseShippingCost(location);
        
        if (product.weight > 5) {
            shippingCost += 5;
        }

        if (user.type === 'premium') {
            shippingCost *= 0.9;
        }

        return shippingCost;
    }

    getBaseShippingCost(location) {
        if (location.country !== 'US') return 15;
        
        const stateRates = {
            'CA': 5,
            'NY': 8,
            'default': 10
        };
        return stateRates[location.state] || stateRates.default;
    }
}

class PriceCalculator {
    constructor() {
        this.discountCalculator = new DiscountCalculator();
        this.taxCalculator = new TaxCalculator();
        this.shippingCalculator = new ShippingCalculator();
    }

    calculateFinalPrice(product, user, location) {
        if (product.price === 0) {
            return { finalPrice: 0 };
        }

        const basePrice = product.price;
        const discount = this.discountCalculator.calculateDiscount(product, user);
        const discountedPrice = basePrice - (basePrice * discount);
        
        const taxRate = this.taxCalculator.getTaxRate(product.category);
        const taxAmount = discountedPrice * taxRate;
        
        const shippingCost = this.shippingCalculator.calculateShippingCost(location, product, user);

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
    return calculator.calculateFinalPrice(product, user, location);
}

module.exports = { calculateFinalPrice };