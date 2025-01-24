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
        then: Joi.required(),
        otherwise: Joi.optional()
    }).min('now').when('start_date', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('start_date'))
    }),
    start_date: Joi.date().when('due_date', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional()
    }).min('now')
});

const createTicket = (ticket) => {
    if (!ticket) {
        throw new Error('Ticket is required');
    }

    // Add ID if not present
    const ticketWithId = {
        ...ticket,
        _id: ticket._id || generateId()
    };

    // Validate ticket
    const { error, value } = TICKET.validate(ticketWithId, {
        abortEarly: false,
        presence: 'required'
    });

    if (error) {
        throw new Error(error.details.map(detail => detail.message).join(', '));
    }

    return value;
};

module.exports = {
    createTicket
};