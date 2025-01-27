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

const orderIdSchema = Joi.string().required().pattern(/^[a-zA-Z0-9]{8,12}$/);
const customerNameSchema = Joi.string().required().pattern(/^[a-zA-Z]+$/);
const emailSchema = Joi.string().email();
const itemSchema = Joi.object({
  name: Joi.string().required().min(3),
  quantity: Joi.number().required().integer().min(1),
  price: Joi.number().required().min(0.01),
  ageRestricted: Joi.boolean()
});
const paymentDetailsSchema = Joi.object({
  creditCard: Joi.object({
    cardNumber: Joi.string().required().pattern(/^\d{16}$/),
    expiryDate: Joi.string().required().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
    cvv: Joi.string().required().pattern(/^\d{3}$/)
  }),
  paypal: Joi.string().email()
}).xor('creditCard', 'paypal');
const deliveryOptionsSchema = Joi.object({
  method: Joi.string().required().valid('standard', 'express'),
  address: Joi.string().required().min(10)
});
const orderDateSchema = Joi.date();
const deliveryDateSchema = Joi.date().greater(Joi.ref('orderDate'));
const customerAgeSchema = Joi.number().integer().min(18);

const schema = Joi.object({
  orderId: orderIdSchema.error(new Error(ERRORS.INVALID_ORDER_ID)),
  customerName: customerNameSchema.error(new Error(ERRORS.INVALID_CUSTOMER_NAME)),
  email: emailSchema.error(new Error(ERRORS.INVALID_EMAIL)),
  items: Joi.array().required().min(1).items(itemSchema).error(new Error(ERRORS.INVALID_ITEMS)),
  totalPrice: Joi.number().required().error(new Error(ERRORS.INVALID_TOTAL_PRICE)),
  discountCode: Joi.string().when('totalPrice', {
    is: Joi.number().less(100),
    then: Joi.forbidden().error(new Error(ERRORS.INVALID_DISCOUNT_CODE))
  }),
  paymentDetails: paymentDetailsSchema.required().error(new Error(ERRORS.INVALID_PAYMENT_DETAILS)),
  deliveryOptions: deliveryOptionsSchema.error(new Error(ERRORS.INVALID_DELIVERY_METHOD)),
  orderDate: orderDateSchema.error(new Error(ERRORS.INVALID_ORDER_DATE)),
  deliveryDate: deliveryDateSchema.error(new Error(ERRORS.INVALID_DELIVERY_DATE)),
  customerAge: customerAgeSchema.when('items', {
    is: Joi.array().items(Joi.object({ ageRestricted: Joi.boolean().valid(true) })),
    then: customerAgeSchema.required().error(new Error(ERRORS.INVALID_CUSTOMER_AGE))
  })
});

function validateOrder(payload) {
  try {
    const result = schema.validate(payload, { abortEarly: false });
    if (result.error) {
      throw result.error;
    }

    const totalPrice = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (totalPrice !== payload.totalPrice) {
      throw new Error(ERRORS.INVALID_TOTAL_PRICE);
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