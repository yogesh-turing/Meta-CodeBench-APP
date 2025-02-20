const Yup = require('yup');
const validator = require('validator');

function validateSignUpFormData(formData) {
  // Check if all required fields are present
  const requiredFields = ['firstname', 'lastname', 'email', 'password', 'confirm_password'];
  for (let field of requiredFields) {
    if (!formData[field]) {
      return {
        validation: false,
        message: `${field} is required.`,
      };
    }
  }

  // Check if address is provided and all its subfields are present
  if (formData.address) {
    const addressFields = ['house_no', 'street_address', 'city', 'state'];
    for (let field of addressFields) {
      if (!formData.address[field]) {
        return {
          validation: false,
          message: `${field} is required.`,
        };
      }
    }
  }

  // Check if email is in the correct domain
  if (!validator.isEmail(formData.email) || !formData.email.endsWith('@finsol.pk')) {
    return {
      validation: false,
      message: 'Email must be in the \'@finsol.pk\' domain.',
    };
  }

  // Check if password meets the requirements
  const passwordSchema = Yup.string().min(8).matches(/^(?=.*[A-Z])(?=.*\d).*$/);
  try {
    passwordSchema.validateSync(formData.password);
  } catch (error) {
    return {
      validation: false,
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit.',
    };
  }

  // Check if password and confirm password match
  if (formData.password !== formData.confirm_password) {
    return {
      validation: false,
      message: 'Password and Confirm Password should match.',
    };
  }

  // Check if state is one of the allowed values
  const allowedStates = ['Punjab', 'Sindh', 'Balochistan', 'Kashmir', 'KPK'];
  if (formData.address && !allowedStates.includes(formData.address.state)) {
    return {
      validation: false,
      message: 'State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.',
    };
  }

  // If all checks pass, return success
  return {
    validation: true,
    message: null,
  };
}

module.exports = { validateSignUpFormData };