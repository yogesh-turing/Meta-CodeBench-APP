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
  orderId: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,12}$/)
    .required()
    .messages({
      'any.required': ERRORS.INVALID_ORDER_ID,
      'string.pattern.base': ERRORS.INVALID_ORDER_ID,
      'string.empty': ERRORS.INVALID_ORDER_ID
    }),

  customerName: Joi.string()
    .pattern(/^[^0-9]+$/)
    .required()
    .messages({
      'any.required': ERRORS.INVALID_CUSTOMER_NAME,
      'string.pattern.base': ERRORS.INVALID_CUSTOMER_NAME,
      'string.empty': ERRORS.INVALID_CUSTOMER_NAME
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': ERRORS.INVALID_EMAIL
    }),

  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .min(3)
          .required()
          .messages({
            'any.required': ERRORS.INVALID_ITEM_NAME,
            'string.min': ERRORS.INVALID_ITEM_NAME,
            'string.empty': ERRORS.INVALID_ITEM_NAME
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            'any.required': ERRORS.INVALID_ITEM_QUANTITY,
            'number.base': ERRORS.INVALID_ITEM_QUANTITY,
            'number.min': ERRORS.INVALID_ITEM_QUANTITY
          }),
        price: Joi.number()
          .positive()
          .required()
          .messages({
            'any.required': ERRORS.INVALID_ITEM_PRICE,
            'number.base': ERRORS.INVALID_ITEM_PRICE,
            'number.positive': ERRORS.INVALID_ITEM_PRICE
          }),
        ageRestricted: Joi.boolean().optional()
      })
    )
    .min(1)
    .required()
    .messages({
      'any.required': ERRORS.INVALID_ITEMS,
      'array.min': ERRORS.INVALID_ITEMS
    }),

  totalPrice: Joi.number().required(),

  discountCode: Joi.string().optional(),

  paymentDetails: Joi.object({
    creditCard: Joi.object({
      cardNumber: Joi.string()
        .pattern(/^\d{16}$/)
        .messages({
          'string.pattern.base': ERRORS.INVALID_CREDIT_CARD_NUMBER
        }),
      expiryDate: Joi.string()
        .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
        .messages({
          'string.pattern.base': ERRORS.INVALID_EXPIRY_DATE
        }),
      cvv: Joi.string()
        .pattern(/^\d{3}$/)
        .messages({
          'string.pattern.base': ERRORS.INVALID_CVV
        })
    }).optional(),
    paypal: Joi.string()
      .email()
      .messages({
        'string.email': ERRORS.INVALID_PAYPAL_ID
      })
      .optional()
  })
    .required()
    .custom((value, helpers) => {
      if (!value.creditCard && !value.paypal) {
        return helpers.error('any.invalid');
      }
      if (value.creditCard && value.paypal) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'any.required': ERRORS.INVALID_PAYMENT_DETAILS,
      'any.invalid': ERRORS.INVALID_PAYMENT_METHOD
    }),

  deliveryOptions: Joi.object({
    method: Joi.string()
      .valid('standard', 'express')
      .messages({
        'any.only': ERRORS.INVALID_DELIVERY_METHOD
      }),
    address: Joi.string()
      .min(10)
      .messages({
        'string.min': ERRORS.INVALID_ADDRESS
      })
  }).optional(),

  orderDate: Joi.date().iso().optional(),
  deliveryDate: Joi.date().iso().optional(),
  customerAge: Joi.number().optional()
}).custom((value, helpers) => {
  // Validate total price
  const calculatedTotal = value.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  if (value.totalPrice !== calculatedTotal) {
    return helpers.message(ERRORS.INVALID_TOTAL_PRICE);
  }

  // Validate discount code
  if (value.discountCode && calculatedTotal < 100) {
    return helpers.message(ERRORS.INVALID_DISCOUNT_CODE);
  }

  // Validate delivery dates
  if (value.orderDate && value.deliveryDate) {
    if (new Date(value.deliveryDate) <= new Date(value.orderDate)) {
      return helpers.message(ERRORS.INVALID_DELIVERY_DATE);
    }
  }

  // Validate age restriction
  if (
    value.customerAge &&
    value.items.some(item => item.ageRestricted) &&
    value.customerAge < 18
  ) {
    return helpers.message(ERRORS.INVALID_CUSTOMER_AGE);
  }

  return value;
});

function validateOrder(payload) {
  try {
    const { error } = orderSchema.validate(payload, { abortEarly: true });
    if (error) {
      throw new Error(error.details[0].message);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  validateOrder,
  orderSchema // Exported for testing purposes
};