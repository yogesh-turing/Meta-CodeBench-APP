const Joi = require('joi');

const validateData = (data, allowedDomains) => {
  // Validate allowedDomains
  if (allowedDomains !== undefined) {
    if (!Array.isArray(allowedDomains) || !allowedDomains.every(domain => typeof domain === 'string')) {
      return {
        status: 'failed',
        message: 'Invalid allowedDomains parameter',
      };
    }
  }

  const validTLDs = ['com', 'org', 'net', 'edu', 'gov'];
  
  const schema = Joi.object({
    email: Joi.string()
      .max(256)
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .pattern(new RegExp('^[^+]+@')) // Disallow plus addressing
      .pattern(new RegExp('^(?!.*\\.\\.)')) // Disallow consecutive dots
      .custom((value, helpers) => {
        const domain = value.split('@')[1];
        const tld = domain.split('.').pop();
        if (!validTLDs.includes(tld)) {
          return helpers.error('any.invalid');
        }
        if (allowedDomains && !allowedDomains.includes(domain)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'custom email validation')
      .required()
      .messages({
        'string.pattern.base': 'Invalid email format',
        'any.invalid': 'Invalid email domain or TLD',
      }),
  });

  const result = schema.validate(data);
  if (result.error) {
    return {
      status: 'failed',
      message: result.error.details[0].message,
    };
  } else {
    return {
      status: 'success',
      data: result.value,
    };
  }
};

module.exports = {
  validateData
};