const Joi = require('joi');

const validateData = (data, allowedDomains) => {
  // Define the schema for email validation
  const emailSchema = Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9._%]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'), { name: 'email' })
    .required()
    .max(256)
    .custom((value, helpers) => {
      // Ensure the email does not contain consecutive dots
      if (value.includes('..')) {
        return helpers.message({ custom: 'Email should not contain consecutive dots' });
      }
      return value;
    })
    .custom((value, helpers) => {
      // Ensure the email has a valid top-level domain (TLD)
      const tlds = ['com', 'org', 'net', 'edu', 'gov'];
      const domain = value.split('.').pop();
      if (!tlds.includes(domain)) {
        return helpers.message({ custom: 'Invalid top-level domain' });
      }
      return value;
    })
    .custom((value, helpers) => {
      // Validate allowed domains if provided
      if (allowedDomains) {
        const domain = value.split('@')[1];
        if (!allowedDomains.includes(domain)) {
          return helpers.message({ custom: 'Domain is not allowed' });
        }
      }
      return value;
    });

  const schema = Joi.object({
    email: emailSchema,
  });

  // Validate the data
  const result = schema.validate(data);

  // Handle validation result
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