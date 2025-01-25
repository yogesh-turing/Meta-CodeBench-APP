const Joi = require('joi');

const validateOrder = (payload) => {
    const itemSchema = Joi.object({
        name: Joi.string().min(3).required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
    });

    const creditCardSchema = Joi.object({
        cardNumber: Joi.string().pattern(/^\d{16}$/).required(),
        expiryDate: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required(),
        cvv: Joi.string().pattern(/^\d{3}$/).required(),
    });

    const paypalSchema = Joi.object({
        paypalId: Joi.string().email().required(),
    });

    const deliveryOptionsSchema = Joi.object({
        method: Joi.string().valid('standard', 'express').required(),
        address: Joi.string().min(10).required(),
    });

    const orderSchema = Joi.object({
        orderId: Joi.string().pattern(/^[a-zA-Z0-9]{8,12}$/).required(),
        customerName: Joi.string().pattern(/^[^\d]+$/).required(),
        email: Joi.string().email().optional(),
        items: Joi.array().items(itemSchema).min(1).required(),
        paymentDetails: Joi.object()
            .keys({
                creditCard: creditCardSchema,
                paypal: paypalSchema,
            })
            .xor('creditCard', 'paypal')
            .required(),
        deliveryOptions: deliveryOptionsSchema.optional(),
    }).when(Joi.object({ deliveryOptions: Joi.exist() }).unknown(), {
        then: Joi.object({ items: Joi.array().min(1).required() }),
    });

    const { error } = orderSchema.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }

    return true;
};

module.exports = {
    validateOrder
};
