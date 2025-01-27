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

function validateOrder(payload) {
  try {
    if (!payload.orderId || typeof payload.orderId !== 'string' || !/^[a-zA-Z0-9]{8,12}$/.test(payload.orderId)) {
      throw new Error(ERRORS.INVALID_ORDER_ID);
    }

    if (!payload.customerName || typeof payload.customerName !== 'string' || /\d/.test(payload.customerName)) {
        throw new Error(ERRORS.INVALID_CUSTOMER_NAME);
    }

    if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
        throw new Error(ERRORS.INVALID_EMAIL);
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
        throw new Error(ERRORS.INVALID_ITEMS);
    }

    let totalPrice = 0;
    for (const item of payload.items) {
        if (!item.name || typeof item.name !== 'string' || item.name.length < 3) {
            throw new Error(ERRORS.INVALID_ITEM_NAME);
        }
        if (typeof item.quantity !== 'number' || item.quantity < 1) {
            throw new Error(ERRORS.INVALID_ITEM_QUANTITY);
        }
        if (typeof item.price !== 'number' || item.price <= 0) {
            throw new Error(ERRORS.INVALID_ITEM_PRICE);
        }
        totalPrice += item.price * item.quantity;
    }

    if (payload.totalPrice !== totalPrice) {
        throw new Error(ERRORS.INVALID_TOTAL_PRICE);
    }

    if (payload.discountCode && totalPrice < 100) {
        throw new Error(ERRORS.INVALID_DISCOUNT_CODE);
    }

    if (!payload.paymentDetails || (!payload.paymentDetails.creditCard && !payload.paymentDetails.paypal)) {
        throw new Error(ERRORS.INVALID_PAYMENT_DETAILS);
    }

    if (payload.paymentDetails.creditCard) {
        const { cardNumber, expiryDate, cvv } = payload.paymentDetails.creditCard;
        if (!/^\d{16}$/.test(cardNumber)) {
            throw new Error(ERRORS.INVALID_CREDIT_CARD_NUMBER);
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            throw new Error(ERRORS.INVALID_EXPIRY_DATE);
        }
        if (!/^\d{3}$/.test(cvv)) {
            throw new Error(ERRORS.INVALID_CVV);
        }
    }

    if (payload.paymentDetails.paypal) {
        if (!/^\S+@\S+\.\S+$/.test(payload.paymentDetails.paypal)) {
            throw new Error(ERRORS.INVALID_PAYPAL_ID);
        }
    }

    if (payload.paymentDetails.creditCard && payload.paymentDetails.paypal) {
        throw new Error(ERRORS.INVALID_PAYMENT_METHOD);
    }

    if (payload.deliveryOptions) {
        const { method, address } = payload.deliveryOptions;
        if (!['standard', 'express'].includes(method)) {
            throw new Error(ERRORS.INVALID_DELIVERY_METHOD);
        }
        if (!address || address.length < 10) {
            throw new Error(ERRORS.INVALID_ADDRESS);
        }
    }

    if (payload.orderDate && payload.deliveryDate) {
        const orderDate = new Date(payload.orderDate);
        const deliveryDate = new Date(payload.deliveryDate);
        if (deliveryDate <= orderDate) {
            throw new Error(ERRORS.INVALID_DELIVERY_DATE);
        }
    }

    if (payload.customerAge && payload.items.some(item => item.ageRestricted)) {
        if (payload.customerAge < 18) {
            throw new Error(ERRORS.INVALID_CUSTOMER_AGE);
        }
    }

    return {
        success: true
    };
  } catch (error) {
    return {
        success: false,
        error: error.message
    };
  }
}

module.exports = {
  validateOrder
};