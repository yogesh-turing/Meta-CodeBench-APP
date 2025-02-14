const users = [];

/**
 * Registers a new user after validating inputs.
 * @param {string} name - User's full name.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @throws {Error} If input is missing, invalid, or email already exists.
 * @returns {{ message: string, user: { name: string, email: string } }} Success message with user details.
 */
function registerUser(name, email, password) {
  if (![name, email, password].every(Boolean)) {
    throw new Error("All fields are required.");
  }

  // Check for leading/trailing spaces before trimming
  if (name !== name.trim()) {
    throw new Error(
      "Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces."
    );
  }
  if (email !== email.trim()) {
    throw new Error(
      "Invalid email format. Please enter a valid email address."
    );
  }

  // Trim and format inputs
  name = name.trim();
  email = email.trim().toLowerCase();

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validate name format
  if (!nameRegex.test(name)) {
    throw new Error(
      "Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces."
    );
  }

  // Validate email format

  if (!emailRegex.test(email)) {
    throw new Error(
      "Invalid email format. Please enter a valid email address."
    );
  }

  // Check if email is already registered
  if (users.some((user) => user.email === email)) {
    throw new Error("This email is already registered.");
  }

  // Validate password strength
  if (!passwordRegex.test(password)) {
    throw new Error("Password must be strong.");
  }
  
  // Store user details (excluding password)
  const user = { name, email };
  users.push(user);

  return { message: "Registration successful!", user };
}

module.exports = { registerUser, users };