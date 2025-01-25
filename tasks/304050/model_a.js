const Joi = require('joi');

const ERROR_MESSAGES = {
  INVALID_NAME: 'Invalid name',
  INVALID_DATE_OF_BIRTH: 'Invalid date of birth',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_IP_ADDRESS: 'Invalid IP address format',
  INVALID_ADDRESS: 'Invalid address',
  INVALID_ADDRESSES: 'Invalid addresses',
  INVALID_ZIP_CODE: 'Invalid zip code',
  INVALID_ADDRESS_TYPE: 'Invalid address type',
  INVALID_EMPLOYMENT_DETAILS: 'Invalid employment details',
  INVALID_PHONE_NUMBER: 'Invalid phone number',
  INVALID_PASSWORD: 'Invalid password',
  INVALID_USERNAME: 'Invalid username',
  INVALID_EMAIL_DOMAIN: 'Invalid email domain',
  INVALID_AGE: 'User must be at least 18 years old'
};

const addressSchema = Joi.object({
  city: Joi.string().required().messages({
    'any.required': ERROR_MESSAGES.INVALID_ADDRESS + ' City is required.',
    'string.empty': ERROR_MESSAGES.INVALID_ADDRESS + ' City is required.'
  }),
  zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages({
    'string.pattern.base': ERROR_MESSAGES.INVALID_ADDRESS + ' Invalid zip code.',
    'any.required': ERROR_MESSAGES.INVALID_ADDRESS + ' Invalid zip code.'
  }),
  type: Joi.string().valid('home', 'work').required().messages({
    'any.only': ERROR_MESSAGES.INVALID_ADDRESS + ' Type must be \'home\' or \'work\'.'
  })
});

const employmentDetailsSchema = Joi.object({
  position: Joi.string().required().messages({
    'any.required': ERROR_MESSAGES.INVALID_EMPLOYMENT_DETAILS + ' Employment details must include a valid position.',
    'string.empty': ERROR_MESSAGES.INVALID_EMPLOYMENT_DETAILS + ' Employment details must include a valid position.'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': ERROR_MESSAGES.INVALID_EMPLOYMENT_DETAILS + ' Employment details must include a valid start date.'
  })
});

const schema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': ERROR_MESSAGES.INVALID_NAME + ' Name must be at least 3 characters long.',
    'string.empty': ERROR_MESSAGES.INVALID_NAME + ' Name must be at least 3 characters long.'
  }),
  dateOfBirth: Joi.date()
    .iso()
    .max('now')
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) {
        return helpers.message(ERROR_MESSAGES.INVALID_DATE_OF_BIRTH + ' Date of birth must be a valid past date and user must be at least 18 years old.');
      }
      return value;
    })
    .required(),
  email: Joi.string()
    .email()
    .custom((value, helpers) => {
      const domain = value.split('@')[1];
      if (domain !== 'example.com') {
        return helpers.message(ERROR_MESSAGES.INVALID_EMAIL_DOMAIN + ' Email must be from the domain example.com.');
      }
      return value;
    })
    .required()
    .messages({
      'string.email': ERROR_MESSAGES.INVALID_EMAIL + ' Invalid email format.'
    }),
  ipAddress: Joi.alternatives().try(
    Joi.string().ip({ version: ['ipv4'] }),
    Joi.string().ip({ version: ['ipv6'] })
  ).required().messages({
    'alternatives.match': ERROR_MESSAGES.INVALID_IP_ADDRESS + ' Invalid IP address format.'
  }),
  addresses: Joi.array()
    .items(addressSchema)
    .min(1)
    .required()
    .messages({
      'array.min': ERROR_MESSAGES.INVALID_ADDRESSES + ' At least one address is required.',
      'array.base': ERROR_MESSAGES.INVALID_ADDRESSES + ' At least one address is required.'
    }),
  isEmployed: Joi.boolean().required(),
  employmentDetails: Joi.when('isEmployed', {
    is: true,
    then: employmentDetailsSchema.required(),
    otherwise: Joi.allow(null)
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{1,3}\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': ERROR_MESSAGES.INVALID_PHONE_NUMBER + ' Phone number must be in a valid international format.'
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.pattern.base': ERROR_MESSAGES.INVALID_PASSWORD + ' Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    }),
  username: Joi.string()
    .invalid('admin', 'root')
    .required()
    .messages({
      'any.invalid': ERROR_MESSAGES.INVALID_USERNAME + ' Username is not allowed.'
    })
});

function validateAndProcessInput(input) {
  const { error, value } = schema.validate(input, { abortEarly: false });
  
  if (error) {
    return {
      success: false,
      errors: error.details.map(detail => detail.message)
    };
  }

  // Format dates as YYYY-MM-DD
  const formattedData = {
    ...value,
    dateOfBirth: new Date(value.dateOfBirth).toISOString().split('T')[0],
    employmentDetails: value.isEmployed ? {
      ...value.employmentDetails,
      startDate: new Date(value.employmentDetails.startDate).toISOString().split('T')[0]
    } : null
  };

  return {
    success: true,
    data: formattedData
  };
}

module.exports = {
  validateAndProcessInput
};