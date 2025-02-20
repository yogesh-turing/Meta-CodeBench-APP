const yup = require("yup");
const validator = require("validator");

function validateSignUpFormData(formData) {
  // Check if formData is null
  if (formData === null) {
    return {
      validation: false,
      message: "formData is required.",
    };
  }

  // Check for missing fields
  const requiredFields = ["firstname", "lastname", "email", "password", "confirm_password"];
  for (let field of requiredFields) {
    if (!Object.prototype.hasOwnProperty.call(formData, field) || formData[field] === "") {
      return {
        validation: false,
        message: `${field} is required.`,
      };
    }
  }

  // If address is provided, check for missing subfields
  if (formData.address) {
    const requiredAddressFields = ["house_no", "street_address", "city", "state"];
    for (let field of requiredAddressFields) {
      if (!Object.prototype.hasOwnProperty.call(formData.address, field) || formData.address[field] === "") {
        return {
          validation: false,
          message: `${field} is required.`,
        };
      }
    }
  }

  // Validate email format and domain
  const emailSchema = yup.string().email().test("domain", "Email must be in the '@finsol.pk' domain.", (value) => {
    return value.endsWith("@finsol.pk");
  });
  try {
    emailSchema.validateSync(formData.email);
  } catch (error) {
    return {
      validation: false,
      message: error.message,
    };
  }

  // Validate password length and composition
  const passwordSchema = yup.string().test("password", "Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit.", (value) => {
    return validator.isStrongPassword(value, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
    });
  });
  try {
    passwordSchema.validateSync(formData.password);
  } catch (error) {
    return {
      validation: false,
      message: error.message,
    };
  }

  // Validate password and confirm_password match
  if (formData.password !== formData.confirm_password) {
    return {
      validation: false,
      message: "Password and Confirm Password should match.",
    };
  }

  // Validate state
  const validStates = ["Punjab", "Sindh", "Balochistan", "Kashmir", "KPK"];
  if (formData.address && !validStates.includes(formData.address.state)) {
    return {
      validation: false,
      message: "State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.",
    };
  }

  // If all validations pass
  return {
    validation: true,
    message: null,
  };
}

module.exports = { validateSignUpFormData };