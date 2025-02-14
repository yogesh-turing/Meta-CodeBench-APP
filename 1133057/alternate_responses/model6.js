const users = [];

function registerUser(name, email, password) {
  // Check if all fields are provided
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  // Validate name
  if (!/^[a-zA-Z ]+$/.test(name) || name.trim() === "") {
    throw new Error("Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces.");
  }

  // Validate email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.toLowerCase())) {
    throw new Error("Invalid email format. Please enter a valid email address.");
  }

  // Check if email is already registered
  if (users.find((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("This email is already registered.");
  }

  // Validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("Password must be strong.");
  }

  // Register user
  const user = { name, email };
  users.push(user);

  // Return response
  return {
    message: "Registration successful!",
    user,
  };
}

module.exports = { registerUser, users };