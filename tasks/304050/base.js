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

function validateAndProcessInput(input) {
  const errors = [];

  // Validate name
  if (!input.name || typeof input.name !== 'string' || input.name.length < 3) {
    errors.push(ERROR_MESSAGES.INVALID_NAME + " Name must be at least 3 characters long.");
  }

  // Validate date of birth
  const dob = new Date(input.dateOfBirth);
  const age = new Date().getFullYear() - dob.getFullYear();
  if (isNaN(dob) || dob >= new Date() || age < 18) {
    errors.push(ERROR_MESSAGES.INVALID_DATE_OF_BIRTH + " Date of birth must be a valid past date and user must be at least 18 years old.");
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedDomain = "example.com";
  const emailDomain = input.email.split("@")[1];
  if (!emailRegex.test(input.email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL + " Invalid email format.");
  } else if (emailDomain !== allowedDomain) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL_DOMAIN + ` Email must be from the domain ${allowedDomain}.`);
  }

  // Validate IP address
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|... other IPv6 formats ...)$/; // Simplified
  if (!ipRegex.test(input.ipAddress) && !ipv6Regex.test(input.ipAddress)) {
    errors.push(ERROR_MESSAGES.INVALID_IP_ADDRESS + " Invalid IP address format.");
  }

  // Validate addresses
  if (!Array.isArray(input.addresses) || input.addresses.length === 0) {
    errors.push(ERROR_MESSAGES.INVALID_ADDRESSES + " At least one address is required.");
  } else {
    input.addresses.forEach((address, index) => {
      if (!address.city || typeof address.city !== 'string') {
        errors.push(ERROR_MESSAGES.INVALID_ADDRESS + ` Address ${index + 1}: City is required.`);
      }
      if (!address.zipCode || !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
        errors.push(ERROR_MESSAGES.INVALID_ADDRESS + ` Address ${index + 1}: Invalid zip code.`);
      }
      if (!['home', 'work'].includes(address.type)) {
        errors.push(ERROR_MESSAGES.INVALID_ADDRESS + ` Address ${index + 1}: Type must be 'home' or 'work'.`);
      }
    });
  }

  // Validate employment details
  if (input.isEmployed) {
    if (
      !input.employmentDetails ||
      typeof input.employmentDetails.position !== 'string' ||
      input.employmentDetails.position.length === 0
    ) {
      errors.push(ERROR_MESSAGES.INVALID_EMPLOYMENT_DETAILS + " Employment details must include a valid position.");
    }
    if (
      !input.employmentDetails.startDate ||
      isNaN(new Date(input.employmentDetails.startDate))
    ) {
      errors.push(ERROR_MESSAGES.INVALID_EMPLOYMENT_DETAILS + " Employment details must include a valid start date.");
    } else {
      input.employmentDetails.startDate = new Date(input.employmentDetails.startDate).toISOString().split('T')[0];
    }
  }

  // Validate phone number
  const phoneRegex = /^\+\d{1,3}\d{9}$/;
  if (!phoneRegex.test(input.phoneNumber)) {
    errors.push(ERROR_MESSAGES.INVALID_PHONE_NUMBER + " Phone number must be in a valid international format.");
  }

  // Validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(input.password)) {
    errors.push(ERROR_MESSAGES.INVALID_PASSWORD + " Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  }

  // Validate username
  const disallowedUsernames = ["admin", "root"];
  if (disallowedUsernames.includes(input.username.toLowerCase())) {
    errors.push(ERROR_MESSAGES.INVALID_USERNAME + " Username is not allowed.");
  }

  // Return errors if any
  if (errors.length > 0) {
    return { success: false, errors };
  }

  // Process and return the valid data
  return {
    success: true,
    data: {
      name: input.name.trim(),
      dateOfBirth: dob.toISOString().split('T')[0],
      email: input.email,
      ipAddress: input.ipAddress,
      addresses: input.addresses,
      employmentDetails: input.isEmployed ? input.employmentDetails : null,
      phoneNumber: input.phoneNumber,
      password: input.password,
      username: input.username
    },
  };
}

module.exports = {
  validateAndProcessInput
};