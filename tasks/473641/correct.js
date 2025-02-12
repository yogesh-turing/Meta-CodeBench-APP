const Joi = require('joi');
const crypto = require('crypto');

// Helper function to generate UUID
const generateId = () => crypto.randomBytes(16).toString('hex');

// Custom validation function for dates
const dateValidation = (value, helpers) => {
    const now = new Date();
    if (value <= now) {
        return helpers.error('date.future');
    }
    return value;
};

const TICKET = Joi.object({
    _id: Joi.string().optional().default(null).allow(null),
    name: Joi.string().min(3).max(100).required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),
    start_date: Joi.date().custom(dateValidation)
        .messages({
            'date.future': 'Start date must be in the future'
        }),
    due_date: Joi.date().custom(dateValidation)
        .messages({
            'date.future': 'Due date must be in the future'
        })
}).custom((obj, helpers) => {
    // Validate that both dates are present if one is present
    if ((obj.start_date && !obj.due_date) || (!obj.start_date && obj.due_date)) {
        return helpers.error('object.dependency', {
            message: 'Both start_date and due_date must be provided together'
        });
    }

    // Validate that due_date is after start_date
    if (obj.start_date && obj.due_date && obj.due_date <= obj.start_date) {
        return helpers.error('object.dateOrder', {
            message: 'Due date must be after start date'
        });
    }

    return obj;
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

    const { error, value } = TICKET.validate(ticketWithId, {
        abortEarly: false // This will collect all errors instead of stopping at the first one
    });

    if (error) {
        throw new Error(error.details.map(err => err.message).join('; '));
    }

    return value;
};

module.exports = {
    createTicket
};