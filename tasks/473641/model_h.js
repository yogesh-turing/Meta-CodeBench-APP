const Joi = require('joi');
const uuid = require('uuid');

const TICKET = Joi.object({
  _id: Joi.string().optional().default(null).allow(null),
  name: Joi.string().min(3).max(100).required(),
  due_date: Joi.date().when('start_date', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
  start_date: Joi.date().when('due_date', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
}).with('start_date', 'due_date');

const createTicket = (ticket) => {
  if (!ticket) {
    throw new Error('Ticket is required');
  }

  const { error, value } = TICKET.validate(ticket, {
    abortEarly: false,
  });

  if (error) {
    throw error;
  }

  if (value.start_date && value.due_date) {
    if (value.start_date >= value.due_date) {
      throw new Error('Due date should be after start date');
    }

    if (value.start_date <= new Date() || value.due_date <= new Date()) {
      throw new Error('Start date and due date should be in the future');
    }
  }

  if (!value._id) {
    value._id = uuid.v4();
  }

  return value;
};

module.exports = {
  createTicket,
};