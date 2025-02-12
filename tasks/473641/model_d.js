const Joi = require('joi');

// Helper function to generate a simple UUID
const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const TICKET = Joi.object({
    _id: Joi.string().optional().allow(null),
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
}).custom((obj, helpers) => {
    // Additional validation to ensure both dates are present if one is present
    if ((obj.start_date && !obj.due_date) || (!obj.start_date && obj.due_date)) {
        return helpers.error('any.custom', {
            message: 'Both start_date and due_date must be provided together'
        });
    }
    return obj;
});

const createTicket = (ticket) => {
    if (!ticket) {
        throw new Error('Ticket is required');
    }

    // Add ID if not provided
    const ticketWithId = {
        ...ticket,
        _id: ticket._id || generateId()
    };

    // Validate ticket
    const { error, value } = TICKET.validate(ticketWithId, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        throw new Error(error.details.map(detail => detail.message).join(', '));
    }

    return value;
};

module.exports = {
    createTicket
};