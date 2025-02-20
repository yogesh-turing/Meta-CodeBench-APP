const Yup = require("yup");
const validator = require("validator");

function validateSignUpFormData(formData) {
  // Check if all required fields are present
  if (
    !formData.firstname ||
    !formData.lastname ||
    !formData.email ||
    !formData.password ||
    !formData.confirm_password
  ) {
    return {
      validation: false,
      message: `${Object.keys(formData).find(
        (key) => !formData[key]
      )} is required.`,
    };
  }

  // Check if address is provided and all its subfields are present
  if (formData.address) {
    if (
      !formData.address.house_no ||
      !formData.address.street_address ||
      !formData.address.city ||
      !formData.address.state
    ) {
      return {
        validation: false,
        message: `${Object.keys(formData.address).find(
          (key) => !formData.address[key]
        )} is required.`,
      };
    }
  }

  // Check if email is in the correct domain
  if (
    !validator.isEmail(formData.email) ||
    !formData.email.endsWith("@finsol.pk")
  ) {
    return {
      validation: false,
      message: "Email must be in the '@finsol.pk' domain.",
    };
  }

  // Check if password meets the requirements
  if (
    !validator.isLength(formData.password, { min: 8 }) ||
    !validator.isStrongPassword(formData.password)
  ) {
    return {
      validation: false,
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit.",
    };
  }

  // Check if password and confirm password match
  if (formData.password !== formData.confirm_password) {
    return {
      validation: false,
      message: "Password and Confirm Password should match.",
    };
  }

  // Check if state is one of the allowed values
  if (
    formData.address &&
    !["Punjab", "Sindh", "Balochistan", "Kashmir", "KPK"].includes(
      formData.address.state
    )
  ) {
    return {
      validation: false,
      message:
        "State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.",
    };
  }

  // If all checks pass, return success
  return {
    validation: true,
    message: null,
  };
}

module.exports = { validateSignUpFormData };