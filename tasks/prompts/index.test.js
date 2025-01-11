// billingSystem.test.js
const { calculateTotalBill } = require('./correct');

test('should calculate total bill with membership discount and PayPal fee', () => {
    const cart = [
        { price: 20, quantity: 2 }, 
        { price: 50, quantity: 1 }
    ];
    const result = calculateTotalBill(cart, 'premium', 'paypal', 'SUMMER2025');
    
    expect(result.totalAmount).toBe('78.01'); // Ensure the correct amount is returned
    expect(result.discountApplied).toBe(15); // Discount of 15%
    expect(result.taxAmount).toBe('6.88'); // Tax calculated correctly
    expect(result.processingFee).toBe('2.27'); // PayPal fee (3%)
});

test('should handle invalid cart item prices', () => {
    const cart = [{ price: -10, quantity: 2 }];
    
    expect(() => {
        calculateTotalBill(cart, 'basic', 'credit_card');
    }).toThrowError("Each item must have a valid price and quantity.");
});

test('should throw error for unsupported payment method', () => {
    const cart = [{ price: 10, quantity: 2 }];
    
    expect(() => {
        calculateTotalBill(cart, 'basic', 'bitcoin');
    }).toThrowError("Unsupported payment method.");
});


describe('calculateTotalBill', () => {
    test('should throw an error if cart is not a non-empty array', () => {
        expect(() => calculateTotalBill([], 'regular', 'credit_card')).toThrow(Error);
        expect(() => calculateTotalBill(null, 'regular', 'credit_card')).toThrow(Error);
    });

    test('should throw an error if any item in the cart has invalid price or quantity', () => {
        const cart = [{ price: -10, quantity: 1 }];
        expect(() => calculateTotalBill(cart, 'regular', 'credit_card')).toThrow(Error);
    });

    test('should calculate total bill correctly without discount and membership', () => {
        const cart = [{ price: 100, quantity: 2 }];
        const result = calculateTotalBill(cart, 'regular', 'credit_card');
        expect(result.totalAmount).toBe('224.40');
        expect(result.discountApplied).toBe(0);
        expect(result.taxAmount).toBe('20.00');
        expect(result.processingFee).toBe('4.40');
    });

    test('should apply discount correctly', () => {
        const cart = [{ price: 100, quantity: 2 }];
        const result = calculateTotalBill(cart, 'regular', 'credit_card', 'SUMMER2025');
        expect(result.totalAmount).toBe('190.74');
        expect(result.discountApplied).toBe(15);
        expect(result.taxAmount).toBe('17.00');
        expect(result.processingFee).toBe('3.74');
    });

    test('should apply membership discount correctly', () => {
        const cart = [{ price: 100, quantity: 2 }];
        const result = calculateTotalBill(cart, 'premium', 'credit_card');
        expect(result.totalAmount).toBe('201.96');
        expect(result.discountApplied).toBe(0);
        expect(result.taxAmount).toBe('18.00');
        expect(result.processingFee).toBe('3.96');
    });

    test('should throw an error for unsupported payment method', () => {
        const cart = [{ price: 100, quantity: 2 }];
        expect(() => calculateTotalBill(cart, 'regular', 'unsupported_method')).toThrow(Error);
    });

    test('should calculate total bill correctly with PayPal', () => {
        const cart = [{ price: 100, quantity: 2 }];
        const result = calculateTotalBill(cart, 'regular', 'paypal');
        expect(result.totalAmount).toBe('226.60');
        expect(result.discountApplied).toBe(0);
        expect(result.taxAmount).toBe('20.00');
        expect(result.processingFee).toBe('6.60');
    });

    test('should calculate total bill correctly with bank transfer', () => {
        const cart = [{ price: 100, quantity: 2 }];
        const result = calculateTotalBill(cart, 'regular', 'bank_transfer');
        expect(result.totalAmount).toBe('222.20');
        expect(result.discountApplied).toBe(0);
        expect(result.taxAmount).toBe('20.00');
        expect(result.processingFee).toBe('2.20');
    });
});