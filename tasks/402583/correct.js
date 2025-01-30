const Joi = require("joi");

const validateData = (data, allowedDomains = null) => {
  if (
    allowedDomains !== null &&
    (!Array.isArray(allowedDomains) ||
      !allowedDomains.every((domain) => typeof domain === "string"))
  ) {
    return {
      status: "failed",
      message: "Invalid allowedDomains parameter",
    };
  }

  const schema = Joi.object({
    email: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"), {
        name: "email",
      })
      .required(),
  });

  const result = schema.validate(data);
  if (result.error) {
    return {
      status: "failed",
      message: result.error.details[0].message,
    };
  }

  const email = data.email;
  if (email.includes("+")) {
    return {
      status: "failed",
      message: "Plus addressing is not allowed.",
    };
  }

  // Check for consecutive dots
  if (email.includes("..")) {
    return {
      status: "failed",
      message: "Email cannot contain consecutive dots.",
    };
  }

  // Check for length
  if (email.length > 254) {
    return {
      status: "failed",
      message: "Email length must be less than 255 characters.",
    };
  }

  const tld = email.split(".").pop();
  const validTlds = ["com", "org", "net", "edu", "gov"];
  if (!validTlds.includes(tld)) {
    return {
      status: "failed",
      message: "Email must have a valid top-level domain.",
    };
  }

  if (allowedDomains && Array.isArray(allowedDomains)) {
    const domain = email.split("@")[1];
    if (!allowedDomains.includes(domain)) {
      return {
        status: "failed",
        message: `Email domain must be one of the following: ${allowedDomains.join(
          ", "
        )}`,
      };
    }
  }

  return {
    status: "success",
    data: result.value,
  };
};

module.exports = {
  validateData,
};
