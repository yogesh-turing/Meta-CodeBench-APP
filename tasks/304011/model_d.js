class DiscountStrategy {
    calculate(basePrice, user) {
        return 0;
    }
}

class PremiumDiscount extends DiscountStrategy {
    calculate(basePrice) {
        return basePrice * 0.1;
    }
}

class WholesaleDiscount extends DiscountStrategy {
    calculate(basePrice) {
        return basePrice * 0.2;
    }
}

class LoyaltyDiscount extends DiscountStrategy {
    calculate(basePrice, user) {
        return user.loyaltyPoints > 100 ? basePrice * 0.05 : 0;
    }
}

class DiscountFactory {
    static getStrategy(user) {
        if (user.type === 'premium') return new PremiumDiscount();
        if (user.type === 'wholesale') return new WholesaleDiscount();
        return new LoyaltyDiscount();
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

    calculate(price, category) {
        return price * this.constructor.getTaxRate(category);
    }
}

class ShippingCalculator {
    calculate(location, product, isUserPremium) {
        let cost = this.#getBaseShippingCost(location);
        cost += this.#getWeightSurcharge(product);
        return isUserPremium ? cost * 0.9 : cost;
    }

    #getBaseShippingCost(location) {
        if (location.country !== 'US') return 15;
        
        const stateRates = {
            'CA': 5,
            'NY': 8,
            'default': 10
        };
        return stateRates[location.state] || stateRates.default;
    }

    #getWeightSurcharge(product) {
        return product.weight > 5 ? 5 : 0;
    }
}

class PriceCalculator {
    #taxCalculator;
    #shippingCalculator;

    constructor() {
        this.#taxCalculator = new TaxCalculator();
        this.#shippingCalculator = new ShippingCalculator();
    }

    calculateFinalPrice(product, user, location) {
        if (!product?.price || product.price === 0) {
            return { finalPrice: 0 };
        }

        const basePrice = product.price;
        const discountStrategy = DiscountFactory.getStrategy(user);
        const discountAmount = discountStrategy.calculate(basePrice, user);
        const discountedPrice = basePrice - discountAmount;
        
        const taxAmount = this.#taxCalculator.calculate(discountedPrice, product.category);
        const shippingCost = this.#shippingCalculator.calculate(
            location,
            product,
            user.type === 'premium'
        );

        return {
            finalPrice: discountedPrice + taxAmount + shippingCost,
            breakdown: {
                basePrice,
                discountApplied: discountAmount,
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