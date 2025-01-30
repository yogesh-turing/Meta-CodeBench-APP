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
  const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  
  const schema = Joi.object({
    email: Joi.string()
      .max(256)
      .pattern(emailRegex, { name: 'email' })
      .custom((value, helpers) => {
        // Check for consecutive dots
        if (value.includes('..')) {
          return helpers.error('string.email');
        }
        
        // Check for plus addressing
        if (value.split('@')[0].includes('+')) {
          return helpers.error('string.email');
        }
        
        // Check for valid TLD
        const tld = value.split('.').pop();
        if (!validTLDs.includes(tld)) {
          return helpers.error('string.email');
        }
        
        // Check for allowed domains
        if (allowedDomains) {
          const domain = value.split('@')[1];
          if (!allowedDomains.includes(domain)) {
            return helpers.error('string.email');
          }
        }
        
        return value;
      })
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