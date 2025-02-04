const { calculateFinalPrice } = require('./model_a');

describe('calculateFinalPrice', () => {

    test('Premium user buying electronics in NY', () => {
        const product = { price: 200, category: 'electronics', weight: 3 };
        const user = { type: 'premium', loyaltyPoints: 50 };
        const location = { country: 'US', state: 'NY' };

        const result = calculateFinalPrice(product, user, location);
        console.log(result);
        expect(result.finalPrice).toBeCloseTo(214.2, 2); // Base: 200, Discount: 20, Tax: 27, Shipping: 8*0.9
    });

    test('Wholesale user buying clothing in CA', () => {
        const product = { price: 100, category: 'clothing', weight: 2 };
        const user = { type: 'wholesale', loyaltyPoints: 20 };
        const location = { country: 'US', state: 'CA' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.finalPrice).toBeCloseTo(89, 2); // Base: 100, Discount: 20, Tax: 4, Shipping: 5
    });

    test('Loyalty-based discount for a user buying other category in Texas', () => {
        const product = { price: 150, category: 'other', weight: 4 };
        const user = { type: 'regular', loyaltyPoints: 120 };
        const location = { country: 'US', state: 'TX' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.finalPrice).toBeCloseTo(166.75, 2); // Base: 150, Discount: 7.5, Tax: 14.25, Shipping: 10
    });

    test('User buying heavy product (weight > 5) in UK', () => {
        const product = { price: 250, category: 'electronics', weight: 6 };
        const user = { type: 'regular', loyaltyPoints: 50 };
        const location = { country: 'UK', state: '' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.finalPrice).toBeCloseTo(307.5, 2); // Base: 250, Discount: 0, Tax: 37.5, Shipping: 15+5
    });

    test('Zero price product should return zero final price', () => {
        const product = { price: 0, category: 'electronics', weight: 2 };
        const user = { type: 'premium', loyaltyPoints: 50 };
        const location = { country: 'US', state: 'NY' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.finalPrice).toBe(0);
    });

    test('Very expensive product (boundary case)', () => {
        const product = { price: 1000000, category: 'electronics', weight: 3 };
        const user = { type: 'premium', loyaltyPoints: 50 };
        const location = { country: 'US', state: 'NY' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.finalPrice).toBeGreaterThan(1000000);
    });

    test('Product with zero weight', () => {
        const product = { price: 300, category: 'electronics', weight: 0 };
        const user = { type: 'regular', loyaltyPoints: 50 };
        const location = { country: 'US', state: 'NY' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.finalPrice).toBeCloseTo(353, 2); // Base: 300, Discount: 0, Tax: 45, Shipping: 8
    });

    test('User from a different country (shipping should be high)', () => {
        const product = { price: 500, category: 'clothing', weight: 4 };
        const user = { type: 'premium', loyaltyPoints: 100 };
        const location = { country: 'Germany', state: '' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.finalPrice).toBeCloseTo(486, 2); // Base: 500, Discount: 50, Tax: 22.5, Shipping: 15 * 0.9
    });

    test('Shipping cost increases when weight > 5', () => {
        const product = { price: 100, category: 'other', weight: 6 };
        const user = { type: 'wholesale', loyaltyPoints: 20 };
        const location = { country: 'US', state: 'CA' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.breakdown.shippingCost).toBe(10); // Base 5 + Extra 5 for weight
    });

    test('Invalid product category defaults to standard tax rate', () => {
        const product = { price: 200, category: 'unknown', weight: 3 };
        const user = { type: 'regular', loyaltyPoints: 50 };
        const location = { country: 'US', state: 'NY' };

        const result = calculateFinalPrice(product, user, location);
        expect(result.breakdown.taxAmount).toBeCloseTo(20, 2); // Tax rate 10%
    });

});
