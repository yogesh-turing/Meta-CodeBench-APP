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
  orderId: Joi.string().regex(/^[a-zA-Z0-9]{8,12}$/).required().messages({
    'string.base': ERRORS.INVALID_ORDER_ID,
    'string.regex.base': ERRORS.INVALID_ORDER_ID,
    'any.required': ERRORS.INVALID_ORDER_ID
  }),
  customerName: Joi.string().regex(/^[a-zA-Z ]+$/).required().messages({
    'string.base': ERRORS.INVALID_CUSTOMER_NAME,
    'string.regex.base': ERRORS.INVALID_CUSTOMER_NAME,
    'any.required': ERRORS.INVALID_CUSTOMER_NAME
  }),
  email: Joi.string().email().optional().messages({
    'string.email': ERRORS.INVALID_EMAIL
  }),
  items: Joi.array().min(1).required().messages({
    'array.base': ERRORS.INVALID_ITEMS,
    'array.min': ERRORS.INVALID_ITEMS,
    'any.required': ERRORS.INVALID_ITEMS
  }).items(Joi.object({
    name: Joi.string().min(3).required().messages({
      'string.base': ERRORS.INVALID_ITEM_NAME,
      'string.min': ERRORS.INVALID_ITEM_NAME,
      'any.required': ERRORS.INVALID_ITEM_NAME
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      'number.base': ERRORS.INVALID_ITEM_QUANTITY,
      'number.integer': ERRORS.INVALID_ITEM_QUANTITY,
      'number.min': ERRORS.INVALID_ITEM_QUANTITY,
      'any.required': ERRORS.INVALID_ITEM_QUANTITY
    }),
    price: Joi.number().min(0.01).required().messages({
      'number.base': ERRORS.INVALID_ITEM_PRICE,
      'number.min': ERRORS.INVALID_ITEM_PRICE,
      'any.required': ERRORS.INVALID_ITEM_PRICE
    }),
    ageRestricted: Joi.boolean().optional()
  })),
  totalPrice: Joi.number().min(0.01).required().messages({
    'number.base': ERRORS.INVALID_TOTAL_PRICE,
    'number.min': ERRORS.INVALID_TOTAL_PRICE,
    'any.required': ERRORS.INVALID_TOTAL_PRICE
  }),
  discountCode: Joi.string().optional().messages({
    'string.base': ERRORS.INVALID_DISCOUNT_CODE
  }),
  paymentDetails: Joi.object({
    creditCard: Joi.object({
      cardNumber: Joi.string().regex(/^[0-9]{16}$/).required().messages({
        'string.base': ERRORS.INVALID_CREDIT_CARD_NUMBER,
        'string.regex.base': ERRORS.INVALID_CREDIT_CARD_NUMBER,
        'any.required': ERRORS.INVALID_CREDIT_CARD_NUMBER
      }),
      expiryDate: Joi.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/).required().messages({
        'string.base': ERRORS.INVALID_EXPIRY_DATE,
        'string.regex.base': ERRORS.INVALID_EXPIRY_DATE,
        'any.required': ERRORS.INVALID_EXPIRY_DATE
      }),
      cvv: Joi.string().regex(/^[0-9]{3}$/).required().messages({
        'string.base': ERRORS.INVALID_CVV,
        'string.regex.base': ERRORS.INVALID_CVV,
        'any.required': ERRORS.INVALID_CVV
      })
    }).xor('paypal'),
    paypal: Joi.string().email().required().messages({
      'string.base': ERRORS.INVALID_PAYPAL_ID,
      'string.email': ERRORS.INVALID_PAYPAL_ID,
      'any.required': ERRORS.INVALID_PAYPAL_ID
    })
  }).required().messages({
    'object.base': ERRORS.INVALID_PAYMENT_DETAILS,
    'any.required': ERRORS.INVALID_PAYMENT_DETAILS
  }),
  deliveryOptions: Joi.object({
    method: Joi.string().valid('standard', 'express').required().messages({
      'string.base': ERRORS.INVALID_DELIVERY_METHOD,
      'any.only': ERRORS.INVALID_DELIVERY_METHOD,
      'any.required': ERRORS.INVALID_DELIVERY_METHOD
    }),
    address: Joi.string().min(10).required().messages({
      'string.base': ERRORS.INVALID_ADDRESS,
      'string.min': ERRORS.INVALID_ADDRESS,
      'any.required': ERRORS.INVALID_ADDRESS
    })
  }).optional(),
  orderDate: Joi.date().optional().messages({
    'date.base': ERRORS.INVALID_ORDER_DATE
  }),
  deliveryDate: Joi.date().min(Joi.ref('orderDate')).optional().messages({
    'date.base': ERRORS.INVALID_DELIVERY_DATE,
    'date.min': ERRORS.INVALID_DELIVERY_DATE
  }),
  customerAge: Joi.number().integer().min(18).optional().messages({
    'number.base': ERRORS.INVALID_CUSTOMER_AGE,
    'number.integer': ERRORS.INVALID_CUSTOMER_AGE,
    'number.min': ERRORS.INVALID_CUSTOMER_AGE
  })
});

function validateOrder(payload) {
  try {
    const result = orderSchema.validate(payload, {
      abortEarly: false
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.details.map(detail => detail.message).join(', ')
      };
    }

    // Check if discount code is valid only when total price is 100 or more
    if (payload.discountCode && payload.totalPrice < 100) {
      return {
        success: false,
        error: ERRORS.INVALID_DISCOUNT_CODE
      };
    }

    // Check if customer age is valid when age restricted items are present
    if (payload.customerAge && payload.items.some(item => item.ageRestricted)) {
      if (payload.customerAge < 18) {
        return {
          success: false,
          error: ERRORS.INVALID_CUSTOMER_AGE
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