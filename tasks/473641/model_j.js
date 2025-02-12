const Joi = require('joi');
const uuid = require('uuid');

const TICKET = Joi.object({
  _id: Joi.string().optional().default(null).allow(null),
  name: Joi.string().min(3).max(100).required(),
  due_date: Joi.date().when('start_date', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  start_date: Joi.date().when('due_date', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const createTicket = (ticket) => {
  if (!ticket) {
    throw new Error('Ticket is required');
  }

  // Generate id if not provided
  if (!ticket._id) {
    ticket._id = uuid.v4();
  }

  // Add additional validations
  const schema = TICKET.append({
    start_date: Joi.date().greater('now'),
    due_date: Joi.date().greater(Joi.ref('start_date')),
  });

  const { error, value } = schema.validate(ticket, { abortEarly: false });

  if (error) {
    throw error;
  }

  return value;
};

module.exports = {
  createTicket,
};