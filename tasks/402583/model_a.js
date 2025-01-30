const Joi = require('joi');

const validateData = (data, allowedDomains) => {
  // Validate allowedDomains parameter
  if (allowedDomains !== undefined) {
    if (!Array.isArray(allowedDomains) || !allowedDomains.every(domain => typeof domain === 'string')) {
      return {
        status: 'failed',
        message: 'Invalid allowedDomains parameter',
      };
    }
  }

  const validTLDs = ['com', 'org', 'net', 'edu', 'gov'];
  const emailRegex = new RegExp(
    `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(?:${validTLDs.join('|')})$`
  );

  const schema = Joi.object({
    email: Joi.string()
      .max(256)
      .regex(emailRegex)
      .custom((value, helpers) => {
        // Check for consecutive dots
        if (value.includes('..')) {
          return helpers.error('string.invalidEmail');
        }
        // Disallow plus addressing
        if (value.includes('+')) {
          return helpers.error('string.invalidEmail');
        }
        // Check allowed domains if provided
        if (allowedDomains) {
          const domain = value.split('@')[1];
          if (!allowedDomains.some(allowedDomain => domain.endsWith(allowedDomain))) {
            return helpers.error('string.invalidDomain');
          }
        }
        return value;
      }, 'custom email validation')
      .required()
      .messages({
        'string.invalidEmail': 'Invalid email format',
        'string.invalidDomain': 'Email domain not allowed',
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