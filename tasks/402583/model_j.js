const Joi = require('joi');

const validateData = (data, allowedDomains) => {
  // Define the list of valid TLDs
  const validTlds = ['com', 'org', 'net', 'edu', 'gov'];

  // Define the schema for email validation
  const emailSchema = Joi.string()
    .pattern(
      new RegExp(
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(?:' + validTlds.join('|') + ')$'
      ),
      { name: 'email' }
    )
    .max(256)
    .required();

  // Define the schema for allowed domains
  const allowedDomainsSchema = Joi.array().items(Joi.string().required());

  // Validate the allowed domains parameter
  const allowedDomainsResult = allowedDomainsSchema.validate(allowedDomains);
  if (allowedDomainsResult.error) {
    return {
      status: 'failed',
      message: 'Invalid allowed domains',
    };
  }

  // If allowed domains are provided, add a custom validation rule
  if (allowedDomains) {
    emailSchema = emailSchema.custom((value, helpers) => {
      const domain = value.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Invalid domain');
  }

  // Validate the email
  const result = emailSchema.validate(data.email);
  if (result.error) {
    return {
      status: 'failed',
      message: result.error.details[0].message,
    };
  }

  // Check for consecutive dots
  if (data.email.includes('..')) {
    return {
      status: 'failed',
      message: 'Email cannot contain consecutive dots',
    };
  }

  // Check for plus addressing
  if (data.email.includes('+')) {
    return {
      status: 'failed',
      message: 'Email cannot use plus addressing',
    };
  }

  return {
    status: 'success',
    data: data,
  };
};

module.exports = {
  validateData,
};