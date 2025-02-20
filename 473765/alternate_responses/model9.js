const Yup = require("yup");
const validator = require("validator");

function validateSignUpFormData(formData) {
  const requiredFields = [
    "firstname",
    "lastname",
    "email",
    "password",
    "confirm_password",
  ];

  // Check for missing required fields
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!formData[field] || formData[field].trim() === "") {
      return {
        validation: false,
        message: `${field} is required.`,
      };
    }
  }

  // Check for address fields if address is provided
  if (formData.address) {
    const addressFields = ["house_no", "street_address", "city", "state"];
    for (let i = 0; i < addressFields.length; i++) {
      const field = addressFields[i];
      if (!formData.address[field] || formData.address[field].trim() === "") {
        return {
          validation: false,
          message: `${field} is required.`,
        };
      }
    }
  }

  // Validate email format and domain
  const emailSchema = Yup.string()
    .email()
    .test("email-domain", "Email must be in the '@finsol.pk' domain.", (value) => {
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

  // Validate password strength
  const passwordSchema = Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .test(
      "password-strength",
      "Password must contain at least one uppercase letter and one numeric digit.",
      (value) => {
        return (
          validator.isStrongPassword(value, {
            minUppercase: 1,
            minNumbers: 1,
          }) !== false
        );
      }
    );
  try {
    passwordSchema.validateSync(formData.password);
  } catch (error) {
    return {
      validation: false,
      message: error.message,
    };
  }

  // Validate password and confirm password match
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
      message:
        "State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.",
    };
  }

  // If all validations pass
  return {
    validation: true,
    message: null,
  };
}

module.exports = { validateSignUpFormData };