const Joi = require('joi');

const validateData = (data) => {
  const schema = Joi.object({
    email: Joi.string().pattern(
      new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
      { name: 'email' }
    ).required(),
  }); 

  const result = schema.validate(data);
  if (result.error) {
    console.error("Validation failed:", result.error.details);
    return {
      status: 'failed',
      message: result.error.details[0].message,
    }
  } else {
    console.log("Validation successful:", result.value);
    return {
      status: 'success',
      data: result.value,
    }
  }
};

module.exports = {
    validateData
};
