const Joi = require('joi');

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

const orderSchema = Joi.object({
  orderId: Joi.string().required().regex(/^[a-zA-Z0-9]{8,12}$/, { name: 'Invalid order Id' }),
  customerName: Joi.string().required().regex(/^[a-zA-Z ]+$/, { name: 'Invalid customer name' }),
  email: Joi.string().email().optional(),
  items: Joi.array().required().items(Joi.object({
    name: Joi.string().required().min(3),
    quantity: Joi.number().required().integer().min(1),
    price: Joi.number().required().min(0.01),
    ageRestricted: Joi.boolean().optional()
  })),
  totalPrice: Joi.number().required(),
  discountCode: Joi.string().optional(),
  paymentDetails: Joi.object({
    creditCard: Joi.object({
      cardNumber: Joi.string().regex(/^\d{16}$/),
      expiryDate: Joi.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
      cvv: Joi.string().regex(/^\d{3}$/)
    }),
    paypal: Joi.string().email()
  }).xor('creditCard', 'paypal'),
  deliveryOptions: Joi.object({
    method: Joi.string().valid('standard', 'express'),
    address: Joi.string().min(10)
  }),
  orderDate: Joi.date().optional(),
  deliveryDate: Joi.date().optional(),
  customerAge: Joi.number().integer().optional()
});

function validateOrder(payload) {
  try {
    const result = orderSchema.validate(payload, { abortEarly: false });
    if (result.error) {
      throw new Error(result.error.details[0].message);
    }
    // Additional logic for total price and discount code
    const totalPrice = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (payload.totalPrice !== totalPrice) {
      throw new Error(ERRORS.INVALID_TOTAL_PRICE);
    }
    if (payload.discountCode && totalPrice < 100) {
      throw new Error(ERRORS.INVALID_DISCOUNT_CODE);
    }
    // Additional logic for delivery date
    if (payload.orderDate && payload.deliveryDate) {
      const orderDate = new Date(payload.orderDate);
      const deliveryDate = new Date(payload.deliveryDate);
      if (deliveryDate <= orderDate) {
        throw new Error(ERRORS.INVALID_DELIVERY_DATE);
      }
    }
    // Additional logic for customer age
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