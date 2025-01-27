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
  orderId: Joi.string().pattern(/^[a-zA-Z0-9]{8,12}$/).required().messages({
    'string.pattern.base': ERRORS.INVALID_ORDER_ID,
    'any.required': ERRORS.INVALID_ORDER_ID
  }),
  customerName: Joi.string().pattern(/^\D+$/).required().messages({
    'string.pattern.base': ERRORS.INVALID_CUSTOMER_NAME,
    'any.required': ERRORS.INVALID_CUSTOMER_NAME
  }),
  email: Joi.string().email().optional().messages({
    'string.email': ERRORS.INVALID_EMAIL
  }),
  items: Joi.array().required().min(1).items(Joi.object({
    name: Joi.string().min(3).required().messages({
      'string.min': ERRORS.INVALID_ITEM_NAME,
      'any.required': ERRORS.INVALID_ITEM_NAME
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      'number.integer': ERRORS.INVALID_ITEM_QUANTITY,
      'number.min': ERRORS.INVALID_ITEM_QUANTITY,
      'any.required': ERRORS.INVALID_ITEM_QUANTITY
    }),
    price: Joi.number().positive().required().messages({
      'number.positive': ERRORS.INVALID_ITEM_PRICE,
      'any.required': ERRORS.INVALID_ITEM_PRICE
    })
  })).messages({
    'array.min': ERRORS.INVALID_ITEMS
  }),
  totalPrice: Joi.number().optional(),
  discountCode: Joi.string().optional(),
  paymentDetails: Joi.object({
    creditCard: Joi.object({
      cardNumber: Joi.string().pattern(/^\d{16}$/).required().messages({
        'string.pattern.base': ERRORS.INVALID_CREDIT_CARD_NUMBER,
        'any.required': ERRORS.INVALID_CREDIT_CARD_NUMBER
      }),
      expiryDate: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required().messages({
        'string.pattern.base': ERRORS.INVALID_EXPIRY_DATE,
        'any.required': ERRORS.INVALID_EXPIRY_DATE
      }),
      cvv: Joi.string().pattern(/^\d{3}$/).required().messages({
        'string.pattern.base': ERRORS.INVALID_CVV,
        'any.required': ERRORS.INVALID_CVV
      })
    }).optional(),
    paypal: Joi.string().email().optional().messages({
      'string.email': ERRORS.INVALID_PAYPAL_ID
    })
  }).required().messages({
    'any.required': ERRORS.INVALID_PAYMENT_DETAILS
  }),
  deliveryOptions: Joi.object({
    method: Joi.string().valid('standard', 'express').required().messages({
      'any.only': ERRORS.INVALID_DELIVERY_METHOD,
      'any.required': ERRORS.INVALID_DELIVERY_METHOD
    }),
    address: Joi.string().min(10).required().messages({
      'string.min': ERRORS.INVALID_ADDRESS,
      'any.required': ERRORS.INVALID_ADDRESS
    })
  }).optional(),
  orderDate: Joi.date().optional(),
  deliveryDate: Joi.date().optional(),
  customerAge: Joi.number().integer().min(18).optional().messages({
    'number.integer': ERRORS.INVALID_CUSTOMER_AGE,
    'number.min': ERRORS.INVALID_CUSTOMER_AGE
  })
});

function validateOrder(payload) {
  try {
    const { error } = orderSchema.validate(payload, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return {
        success: false,
        errors: errorMessages
      };
    }

    // Additional validation for total price
    const totalPrice = payload.items.reduce((total, item) => total + item.price * item.quantity, 0);
    if (payload.totalPrice !== totalPrice) {
      return {
        success: false,
        errors: [ERRORS.INVALID_TOTAL_PRICE]
      };
    }

    // Additional validation for discount code
    if (payload.discountCode && totalPrice < 100) {
      return {
        success: false,
        errors: [ERRORS.INVALID_DISCOUNT_CODE]
      };
    }

    // Additional validation for payment method
    if (payload.paymentDetails.creditCard && payload.paymentDetails.paypal) {
      return {
        success: false,
        errors: [ERRORS.INVALID_PAYMENT_METHOD]
      };
    }

    // Additional validation for delivery date
    if (payload.orderDate && payload.deliveryDate) {
      const orderDate = new Date(payload.orderDate);
      const deliveryDate = new Date(payload.deliveryDate);
      if (deliveryDate <= orderDate) {
        return {
          success: false,
          errors: [ERRORS.INVALID_DELIVERY_DATE]
        };
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