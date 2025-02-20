const yup = require('yup');
const validator = require('validator');

function validateSignUpFormData(formData) {
  // Check for required fields
  if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.confirm_password) {
    const missingField = !formData.firstname ? 'firstname' : !formData.lastname ? 'lastname' : !formData.email ? 'email' : !formData.password ? 'password' : 'confirm_password';
    return {
      validation: false,
      message: `${missingField} is required.`
    };
  }

  // Check if address is provided and all its subfields are present
  if (formData.address && (!formData.address.house_no || !formData.address.street_address || !formData.address.city || !formData.address.state)) {
    const missingField = !formData.address.house_no ? 'house_no' : !formData.address.street_address ? 'street_address' : !formData.address.city ? 'city' : 'state';
    return {
      validation: false,
      message: `${missingField} is required.`
    };
  }

  // Validate email format and domain
  if (!validator.isEmail(formData.email) || !formData.email.endsWith('@finsol.pk')) {
    return {
      validation: false,
      message: 'Email must be in the \'@finsol.pk\' domain.'
    };
  }

  // Validate password length and format
  const passwordSchema = yup.string().min(8).matches(/^(?=.*[A-Z])(?=.*\d).+$/);
  if (!passwordSchema.isValidSync(formData.password)) {
    return {
      validation: false,
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit.'
    };
  }

  // Check if password and confirm password match
  if (formData.password !== formData.confirm_password) {
    return {
      validation: false,
      message: 'Password and Confirm Password should match.'
    };
  }

  // Validate state
  const validStates = ['Punjab', 'Sindh', 'Balochistan', 'Kashmir', 'KPK'];
  if (formData.address && !validStates.includes(formData.address.state)) {
    return {
      validation: false,
      message: 'State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.'
    };
  }

  // If all validations pass, return success
  return {
    validation: true,
    message: null
  };
}

module.exports = { validateSignUpFormData };