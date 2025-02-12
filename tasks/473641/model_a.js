const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const TICKET = Joi.object({
    _id: Joi.string().optional().default(() => uuidv4()),
    name: Joi.string().min(3).max(100).required(),
    due_date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.date().required().greater('now').greater(Joi.ref('start_date'))
            .messages({
                'date.greater': 'Due date must be after start date and in the future'
            })
    }),
    start_date: Joi.date().when('due_date', {
        is: Joi.exist(),
        then: Joi.date().required().greater('now')
            .messages({
                'date.greater': 'Start date must be in the future'
            })
    })
}).custom((obj, helper) => {
    // Additional check to ensure both dates exist if one exists
    if ((obj.start_date && !obj.due_date) || (!obj.start_date && obj.due_date)) {
        return helper.error('object.custom', {
            message: 'Both start_date and due_date must be provided together'
        });
    }
    return obj;
});

const createTicket = (ticket) => {
    if (!ticket) {
        throw new Error('Ticket is required');
    }

    const { error, value } = TICKET.validate(ticket, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        throw new Error(error.details.map(err => err.message).join('; '));
    }

    return value;
};

module.exports = {
    createTicket
};