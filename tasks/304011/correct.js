class DiscountCalculator {
    static getDiscount(user) {
        if (user.type === 'premium') return 0.1;
        if (user.type === 'wholesale') return 0.2;
        if (user.loyaltyPoints > 100) return 0.05;
        return 0;
    }
}

class TaxCalculator {
    static getTaxRate(category) {
        const taxRates = {
            electronics: 0.15,
            clothing: 0.05,
            other: 0.1
        };
        return taxRates[category] || 0.1; // Default tax rate if category is unknown
    }
}

class ShippingCalculator {
    static getShippingCost(location, weight, userType) {
        let shippingCost = 10;
        
        if (location.country === 'US') {
            const stateShippingRates = { CA: 5, NY: 8 };
            shippingCost = stateShippingRates[location.state] || 10;
        } else {
            shippingCost = 15;
        }

        if (weight > 5) {
            shippingCost += 5;
        }

        if (userType === 'premium') {
            shippingCost *= 0.9; // 10% discount for premium users
        }

        return shippingCost;
    }
}

class PriceCalculator {
    static calculateFinalPrice(product, user, location) {
        const basePrice = product.price;
        if (basePrice === 0) {
            return { finalPrice: 0 };
        }
        const discountRate = DiscountCalculator.getDiscount(user);
        const discountedPrice = basePrice * (1 - discountRate);
        const taxRate = TaxCalculator.getTaxRate(product.category);
        const taxAmount = discountedPrice * taxRate;
        const shippingCost = ShippingCalculator.getShippingCost(location, product.weight, user.type);

        return {
            finalPrice: discountedPrice + taxAmount + shippingCost,
            breakdown: {
                basePrice,
                discountApplied: basePrice * discountRate,
                taxAmount,
                shippingCost
            }
        };
    }
}

module.exports = {
    calculateFinalPrice: PriceCalculator.calculateFinalPrice
};
