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
    `^[a-zA-Z0-9._%+-]+@(?:${allowedDomains ? allowedDomains.join('|') : '[a-zA-Z0-9.-]+'})\\.(?:${validTLDs.join('|')})$`
  );

  const schema = Joi.object({
    email: Joi.string()
      .max(256)
      .regex(/^[^+]+$/)
      .regex(/^(?!.*\.{2})[^@]+@[^@]+$/)
      .pattern(emailRegex, { name: 'email' })
      .required(),
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