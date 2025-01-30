const Joi = require('joi');

const validateData = (data, allowedDomains) => {
  const validTlds = ['com', 'org', 'net', 'edu', 'gov'];

  // Validate allowedDomains
  if (allowedDomains && (!Array.isArray(allowedDomains) || allowedDomains.some(domain => typeof domain !== 'string'))) {
    return {
      status: 'failed',
      message: 'Invalid allowedDomains parameter. It should be an array of strings.'
    };
  }

  const schema = Joi.object({
    email: Joi.string()
      .pattern(
        new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        { name: 'email' }
      )
      .required()
      .max(256)
      .custom((value, helpers) => {
        // Disallow plus addressing
        if (value.includes('+')) {
          return helpers.error('string.pattern.base', { pattern: 'email' });
        }

        // Disallow consecutive dots
        if (value.includes('..')) {
          return helpers.error('string.pattern.base', { pattern: 'email' });
        }

        // Validate TLD
        const tld = value.split('.').pop();
        if (!validTlds.includes(tld)) {
          return helpers.error('string.pattern.base', { pattern: 'email' });
        }

        // Validate allowed domains
        if (allowedDomains && !allowedDomains.includes(value.split('@').pop())) {
          return helpers.error('string.pattern.base', { pattern: 'email' });
        }

        return value;
      }),
  });

  const result = schema.validate(data);
  if (result.error) {
    return {
      status: 'failed',
      message: result.error.details[0].message,
    }
  } else {
    return {
      status: 'success',
      data: result.value,
    }
  }
};

module.exports = {
  validateData
};