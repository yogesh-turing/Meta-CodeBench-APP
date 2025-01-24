const Joi = require('joi');
const uuid = require('uuid');

const TICKET = Joi.object({
    _id: Joi.string().optional().default(null).allow(null),
    name: Joi.string().min(3).max(100).required(),
    due_date: Joi.date(),
    start_date: Joi.date()
  })

  function createTicket (ticket) {
    if (!ticket) {
      throw new Error('Ticket is required');
    }

    // Validate ticket object using Joi
    const { error } = TICKET.validate(ticket);

    if (error) {
        throw error;
    }

    // Check if start date is present and due date is not present
    if (ticket.start_date && !ticket.due_date) {
        throw new Error('Due date is required if start date is present');
    }

    // Check if due date is present and start date is not present
    if (ticket.due_date && !ticket.start_date) {
        throw new Error('Start date is required if due date is present');
    }

    // Check if start date and due date are in the future
    if (ticket.start_date && new Date(ticket.start_date) <= new Date()) {
        throw new Error('Start date must be in the future');
    }

    if (ticket.due_date && new Date(ticket.due_date) <= new Date()) {
        throw new Error('Due date must be in the future');
    }

    // Check if due date is after start date
    if (ticket.start_date && ticket.due_date && new Date(ticket.due_date) <= new Date(ticket.start_date)) {
        throw new Error('Due date must be after start date');
    }

    // Auto-generate id if not present
    if (!ticket._id) {
        ticket._id = uuid.v4();
    }

    return ticket;
}

module.exports = {
    createTicket
}