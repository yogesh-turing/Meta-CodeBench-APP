class PriceCalculator {
    constructor(product, user, location) {
        this.product = product;
        this.user = user;
        this.location = location;
    }

    calculate() {
        if (this.product.price === 0) {
            return { finalPrice: 0 };
        }

        let discountedPrice = this.applyDiscount(this.product.price);
        let taxAmount = this.calculateTax(discountedPrice);
        let shippingCost = this.calculateShippingCost();

        let finalPrice = discountedPrice + taxAmount + shippingCost;

        return {
            finalPrice,
            breakdown: {
                basePrice: this.product.price,
                discountApplied: this.product.price - discountedPrice,
                taxAmount,
                shippingCost
            }
        };
    }

    applyDiscount(basePrice) {
        let discount = 0;

        if (this.user.type === 'premium') {
            discount = 0.1;
        } else if (this.user.type === 'wholesale') {
            discount = 0.2;
        } else if (this.user.loyaltyPoints > 100) {
            discount = 0.05;
        }

        return basePrice - (basePrice * discount);
    }

    calculateTax(price) {
        let taxRate = this.getTaxRate();
        return price * taxRate;
    }

    getTaxRate() {
        if (this.product.category === 'electronics') {
            return 0.15;
        } else if (this.product.category === 'clothing') {
            return 0.05;
        } else {
            return 0.1;
        }
    }

    calculateShippingCost() {
        let shippingCost = 10;

        if (this.location.country === 'US') {
            if (this.location.state === 'CA') {
                shippingCost = 5;
            } else if (this.location.state === 'NY') {
                shippingCost = 8;
            }
        } else {
            shippingCost = 15;
        }

        if (this.product.weight > 5) {
            shippingCost += 5;
        }

        if (this.user.type === 'premium') {
            shippingCost *= 0.9;
        }

        return shippingCost;
    }
}

module.exports = {
    calculateFinalPrice: PriceCalculator.calculate
};