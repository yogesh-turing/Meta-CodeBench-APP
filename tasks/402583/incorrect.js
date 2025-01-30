const Joi = require('joi');

const validateData = (data, allowedDomains) => {
  // Joi schema for email validation
  const emailSchema = Joi.string()
    .pattern(
      new RegExp('^[a-zA-Z0-9._%]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      { name: 'email' }
    )
    .max(256)
    .required();

  // Custom validation for consecutive dots and plus addressing
  const customEmailValidation = (value, helpers) => {
    // Check for consecutive dots
    if (value.includes('..')) {
      return helpers.error('string.email', { message: 'Email contains consecutive dots' });
    }

    // Check for plus addressing
    if (value.includes('+')) {
      return helpers.error('string.email', { message: 'Email contains plus addressing' });
    }

    // Check for valid TLD
    const validTlds = ['com', 'org', 'net', 'edu', 'gov'];
    const tld = value.split('.').pop();
    if (!validTlds.includes(tld)) {
      return helpers.error('string.email', { message: 'Email has an invalid TLD' });
    }

    // Check for allowed domains
    if (allowedDomains) {
      const domain = value.split('@').pop().split('.').slice(0, -1).join('.');
      if (!allowedDomains.includes(domain)) {
        return helpers.error('string.email', { message: 'Email domain is not allowed' });
      }
    }

    return value;
  };

  // Combine Joi schema with custom validation
  const schema = Joi.object({
    email: emailSchema.custom(customEmailValidation),
  });

  // Validate the data
  const result = schema.validate(data);

  // Return the validation result
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
  validateData,
};
