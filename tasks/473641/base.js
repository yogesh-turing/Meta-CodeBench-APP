const Joi = require('joi');

const TICKET = Joi.object({
    _id: Joi.string().optional().default(null).allow(null),
    name: Joi.string().min(3).max(200).required(),
    due_date: Joi.date(),
    start_date: Joi.date()
  })
  
const createTicket = (ticket) => {
    if (!ticket) {
      throw new Error('Ticket is required');
    }
    // TODO: Implement Joi validations here

    // TODO: Return error if validation fails
    // TODO: Return ticket object if validation is successful
}

module.exports = {
    createTicket
}