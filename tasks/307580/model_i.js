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
  orderId: Joi.string().required().pattern(/^[a-zA-Z0-9]{8,12}$/).messages({
    'string.pattern.base': ERRORS.INVALID_ORDER_ID,
  }),
  customerName: Joi.string().required().pattern(/^([a-zA-Z]+\s?)*$/).messages({
    'string.pattern.base': ERRORS.INVALID_CUSTOMER_NAME,
  }),
  email: Joi.string().optional().email().messages({
    'string.email': ERRORS.INVALID_EMAIL,
  }),
  items: Joi.array().required().min(1).items(
    Joi.object({
      name: Joi.string().required().min(3).messages({
        'string.min': ERRORS.INVALID_ITEM_NAME,
      }),
      quantity: Joi.number().required().integer().min(1).messages({
        'number.min': ERRORS.INVALID_ITEM_QUANTITY,
      }),
      price: Joi.number().required().positive().messages({
        'number.positive': ERRORS.INVALID_ITEM_PRICE,
      }),
      ageRestricted: Joi.boolean().optional()
    })
  ).messages({
    'array.min': ERRORS.INVALID_ITEMS,
  }),
  totalPrice: Joi.number().required(),
  discountCode: Joi.string().optional(),
  paymentDetails: Joi.object({
    creditCard: Joi.object({
      cardNumber: Joi.string().pattern(/^\d{16}$/).required().messages({
        'string.pattern.base': ERRORS.INVALID_CREDIT_CARD_NUMBER,
      }),
      expiryDate: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required().messages({
        'string.pattern.base': ERRORS.INVALID_EXPIRY_DATE,
      }),
      cvv: Joi.string().pattern(/^\d{3}$/).required().messages({
        'string.pattern.base': ERRORS.INVALID_CVV,
      })
    }).optional(),
    paypal: Joi.string().email().optional().messages({
      'string.email': ERRORS.INVALID_PAYPAL_ID,
    })
  }).required().messages({
    'object.missing': ERRORS.INVALID_PAYMENT_DETAILS,
  }).xor('creditCard', 'paypal').messages({
    'object.xor': ERRORS.INVALID_PAYMENT_METHOD,
  }),
  deliveryOptions: Joi.object({
    method: Joi.string().valid('standard', 'express').required().messages({
      'any.only': ERRORS.INVALID_DELIVERY_METHOD,
    }),
    address: Joi.string().required().min(10).messages({
      'string.min': ERRORS.INVALID_ADDRESS,
    })
  }).optional(),
  orderDate: Joi.date().optional().messages({
    'date.base': ERRORS.INVALID_ORDER_DATE,
  }),
  deliveryDate: Joi.date().optional().greater(Joi.ref('orderDate', {
    adjust: (date) => date
  })).messages({
    'date.greater': ERRORS.INVALID_DELIVERY_DATE,
  }),
  customerAge: Joi.number().integer().optional().when('items', {
    is: Joi.array().items(Joi.object({
      ageRestricted: Joi.boolean().valid(true).required()
    })),
    then: Joi.number().integer().min(18).required().messages({
      'number.min': ERRORS.INVALID_CUSTOMER_AGE,
    })
  })
});

function validateOrder(payload) {
  try {
    const result = orderSchema.validate(payload, { abortEarly: false });
    if (result.error) {
      return {
        success: false,
        error: result.error.details[0].message
      };
    }

    // Validate total price
    const totalPrice = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (totalPrice !== payload.totalPrice) {
      return {
        success: false,
        error: ERRORS.INVALID_TOTAL_PRICE
      };
    }

    // Validate discount code
    if (payload.discountCode && totalPrice < 100) {
      return {
        success: false,
        error: ERRORS.INVALID_DISCOUNT_CODE
      };
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