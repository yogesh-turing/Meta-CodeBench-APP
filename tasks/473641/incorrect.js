const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const TICKET = Joi.object({
    _id: Joi.string().optional().default(() => uuidv4()),
    name: Joi.string().min(3).max(100).required(),
    due_date: Joi.date()
        .when('start_date', {
            is: Joi.exist(),
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .min('now')
        .messages({
            'date.min': 'Due date must be in the future'
        }),
    start_date: Joi.date()
        .when('due_date', {
            is: Joi.exist(),
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .min('now')
        .messages({
            'date.min': 'Start date must be in the future'
        })
}).custom((obj, helpers) => {
    if (obj.start_date && obj.due_date && obj.start_date >= obj.due_date) {
        return helpers.error('custom.invalidDates', {
            message: 'Due date must be after start date'
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
        throw new Error(error.details.map(err => err.message).join(', '));
    }
    
    return value;
};

module.exports = {
    createTicket
};