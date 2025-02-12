const Joi = require('joi');
const uuid = require('uuid');

const TICKET = Joi.object({
    _id: Joi.string().optional().default(null).allow(null),
    name: Joi.string().min(3).max(100).required(),
    due_date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.date().required().greater(Joi.ref('start_date')),
        otherwise: Joi.optional()
    }),
    start_date: Joi.date().when('due_date', {
        is: Joi.exist(),
        then: Joi.date().required().less(Joi.ref('due_date')),
        otherwise: Joi.optional()
    })
  })

const createTicket = (ticket) => {
    if (!ticket) {
      throw new Error('Ticket is required');
    }

    // Generate id if not present
    if (!ticket._id) {
        ticket._id = uuid.v4();
    }

    // Validate the ticket object
    const result = TICKET.validate(ticket, { abortEarly: false });
    if (result.error) {
      throw new Error(result.error.details.map(detail => detail.message).join(', '));
    }

    // Check if dates are in the future
    if (ticket.start_date && ticket.start_date <= new Date()) {
        throw new Error('Start date should be in the future');
    }
    if (ticket.due_date && ticket.due_date <= new Date()) {
        throw new Error('Due date should be in the future');
    }

    return ticket;
}

module.exports = {
    createTicket
}