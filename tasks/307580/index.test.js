const { validateOrder } = require(process.env.TARGET_FILE);

const ERRORS = {
    INVALID_ORDER_ID: 'Invalid order Id',
    INVALID_CUSTOMER_NAME: 'Invalid customer name',
    INVALID_EMAIL: 'Invalid email',
    INVALID_ITEMS: 'Invalid items',
    INVALID_ITEM_NAME: 'Invalid item name',
    INVALID_ITEM_QUANTITY: 'Invalid item quantity',
    INVALID_ITEM_PRICE: 'Invalid item price',
    INVALID_PAYMENT_DETAILS: 'Invalid payment details',
    INVALID_CREDIT_CARD_NUMBER: 'Invalid credit card number',
    INVALID_EXPIRY_DATE: 'Invalid expiry date',
    INVALID_CVV: 'Invalid CVV',
    INVALID_PAYPAL_ID: 'Invalid PayPal ID',
    INVALID_DELIVERY_METHOD: 'Invalid delivery method',
    INVALID_ADDRESS: 'Invalid address',
    INVALID_PAYMENT_METHOD: 'Only one payment method is allowed',
    INVALID_ORDER_DATE: 'Invalid order date',
    INVALID_DELIVERY_DATE: 'Invalid delivery date',
    INVALID_TOTAL_PRICE: 'Invalid total price',
    INVALID_DISCOUNT_CODE: 'Invalid discount code',
    INVALID_CUSTOMER_AGE: 'Invalid customer age'
};

const errorStartwith = (error, message) => {
    return error.startsWith(message);
};

describe('validateOrder', () => {
    test('should return success for a valid order', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            email: 'john.doe@example.com',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 },
                { name: 'Item 2', quantity: 1, price: 100 }
            ],
            totalPrice: 200,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            },
            deliveryOptions: {
                method: 'standard',
                address: '123 Main St, Anytown, USA'
            },
            orderDate: '2023-01-01',
            deliveryDate: '2023-01-02',
            customerAge: 25
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(true);
    });

    test('should return error for invalid orderId', () => {
        const payload = {
            orderId: '123',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_ORDER_ID)).toBe(true);
    });

    test('should return error for invalid customerName', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John123',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_CUSTOMER_NAME)).toBe(true);
    });

    test('should return error for invalid email', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            email: 'john.doe@com',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_EMAIL)).toBe(true);
    });

    test('should return error for invalid items', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_ITEMS)).toBe(true);
    });

    test('should return error for invalid item name', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'It', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_ITEM_NAME)).toBe(true);
    });

    test('should return error for invalid item quantity', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 0, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_ITEM_QUANTITY)).toBe(true);
    });

    test('should return error for invalid item price', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 0 }
            ],
            totalPrice: 0,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_ITEM_PRICE)).toBe(true);
    });

    test('should return error for invalid total price', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 150,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_TOTAL_PRICE)).toBe(true);
    });

    test('should return error for invalid discount code', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 49 }
            ],
            totalPrice: 98,
            discountCode: 'DISCOUNT10',
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_DISCOUNT_CODE)).toBe(true);
    });

    test('should return error for invalid payment details', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {}
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_PAYMENT_DETAILS)).toBe(true);
    });

    test('should return error for invalid credit card number', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '12345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_CREDIT_CARD_NUMBER)).toBe(true);
    });

    test('should return error for invalid expiry date', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '13/25',
                    cvv: '123'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_EXPIRY_DATE)).toBe(true);
    });

    test('should return error for invalid CVV', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '12'
                }
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_CVV)).toBe(true);
    });

    test('should return error for invalid PayPal ID', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                paypal: 'john.doe@com'
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_PAYPAL_ID)).toBe(true);
    });

    test('should return error for multiple payment methods', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                },
                paypal: 'john.doe@example.com'
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_PAYMENT_METHOD)).toBe(true);
    });

    test('should return error for invalid delivery method', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            },
            deliveryOptions: {
                method: 'overnight',
                address: '123 Main St, Anytown, USA'
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_DELIVERY_METHOD)).toBe(true);
    });

    test('should return error for invalid address', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            },
            deliveryOptions: {
                method: 'standard',
                address: '123'
            }
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_ADDRESS)).toBe(true);
    });

    test('should return error for invalid delivery date', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50 }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            },
            orderDate: '2023-01-02',
            deliveryDate: '2023-01-01'
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_DELIVERY_DATE)).toBe(true);
    });

    test('should return error for invalid customer age', () => {
        const payload = {
            orderId: '12345678',
            customerName: 'John Doe',
            items: [
                { name: 'Item 1', quantity: 2, price: 50, ageRestricted: true }
            ],
            totalPrice: 100,
            paymentDetails: {
                creditCard: {
                    cardNumber: '1234567812345678',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            },
            customerAge: 17
        };

        const result = validateOrder(payload);
        expect(result.success).toBe(false);
        expect(errorStartwith(result.error, ERRORS.INVALID_CUSTOMER_AGE)).toBe(true);
    });
});