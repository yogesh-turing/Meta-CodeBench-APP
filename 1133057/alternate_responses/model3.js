const users = [];

function registerUser(name, email, password) {
    // Check if all fields are provided
    if (!name || !email || !password) {
        throw new Error("All fields are required.");
    }

    // Validate name (only letters and spaces, not empty or only spaces)
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
        throw new Error("Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format. Please enter a valid email address.");
    }

    // Convert email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();

    // Check if email is already registered
    if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
        throw new Error("This email is already registered.");
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be strong.");
    }

    // Create new user object
    const newUser = {
        name,
        email: normalizedEmail,
        password // In a real application, this should be hashed
    };

    // Add user to the array
    users.push(newUser);

    // Return success message with user details (excluding password)
    return {
        message: "Registration successful!",
        user: {
            name: newUser.name,
            email: newUser.email
        }
    };
}

module.exports = { registerUser, users };