const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const TICKET = Joi.object({
  _id: Joi.string().optional().default(() => uuidv4()).allow(null),
  name: Joi.string().min(3).max(100).required(),
  due_date: Joi.date().when('start_date', {
    is: Joi.date().required(),
    then: Joi.date().required().greater(Joi.ref('start_date')),
    otherwise: Joi.date().optional()
  }),
  start_date: Joi.date().when('due_date', {
    is: Joi.date().required(),
    then: Joi.date().required(),
    otherwise: Joi.date().optional()
  })
});

const createTicket = (ticket) => {
  if (!ticket) {
    throw new Error('Ticket is required');
  }

  const { error, value } = TICKET.validate(ticket, {
    abortEarly: false
  });

  if (error) {
    throw new Error(error.message);
  }

  const now = new Date();
  if (value.start_date && value.start_date <= now) {
    throw new Error('Start date must be in the future');
  }
  if (value.due_date && value.due_date <= now) {
    throw new Error('Due date must be in the future');
  }

  return value;
};

module.exports = {
  createTicket
};