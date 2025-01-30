const Joi = require('joi');

const validateData = (data, allowedDomains) => {
  const schema = Joi.object({
    email: Joi.string()
      .max(256)
      .pattern(
        new RegExp(
          '^[a-zA-Z0-9._%]+@[a-zA-Z0-9.-]+\\.(com|org|net|edu|gov)$',
          'i'
        ),
        { name: 'email' }
      )
      .required()
      .custom((value, helpers) => {
        if (value.includes('+')) {
          return helpers.message({
            custom: 'Plus addressing is not allowed',
          });
        }
        if (value.includes('..')) {
          return helpers.message({
            custom: 'Consecutive dots are not allowed',
          });
        }
        return value;
      }),
  });

  if (allowedDomains) {
    if (!Array.isArray(allowedDomains)) {
      return {
        status: 'failed',
        message: 'Allowed domains must be an array of strings',
      };
    }
    if (allowedDomains.some((domain) => typeof domain !== 'string')) {
      return {
        status: 'failed',
        message: 'Allowed domains must be an array of strings',
      };
    }
    schema.append({
      email: Joi.string().custom((value, helpers) => {
        const domain = value.split('@')[1];
        if (!allowedDomains.includes(domain)) {
          return helpers.message({
            custom: `Domain ${domain} is not allowed`,
          });
        }
        return value;
      }),
    });
  }

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
  validateData,
};