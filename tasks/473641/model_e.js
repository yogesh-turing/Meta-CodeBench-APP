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
    _id: Joi.string().optional().default(null).allow(null),
    name: Joi.string().min(3).max(100).required(),
    due_date: Joi.date().greater('now'),
    start_date: Joi.date().greater('now')
}).custom((obj, helpers) => {
    // Both dates must be present if one is present
    if ((obj.start_date && !obj.due_date) || (!obj.start_date && obj.due_date)) {
        return helpers.error('any.invalid');
    }
    
    // Due date must be after start date
    if (obj.start_date && obj.due_date && obj.due_date <= obj.start_date) {
        return helpers.error('any.invalid');
    }
    
    return obj;
}, 'date validation').messages({
    'any.invalid': 'Start date and due date must both be present, and due date must be after start date'
});

const createTicket = (ticket) => {
    if (!ticket) {
        throw new Error('Ticket is required');
    }

    // Validate the ticket object
    const { error, value } = TICKET.validate(ticket, { abortEarly: false });
    
    if (error) {
        throw new Error(error.details.map(detail => detail.message).join(', '));
    }

    // Generate ID if not provided
    if (!value._id) {
        value._id = generateId();
    }

    return value;
};

module.exports = {
    createTicket
};