const users = [];

function registerUser(name, email, password) {
    // Check if all fields are provided
    if (!name || !email || !password) {
        throw new Error("All fields are required.");
    }

    // Validate name format
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name.trim())) {
        throw new Error("Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format. Please enter a valid email address.");
    }

    // Check for existing email (case-insensitive)
    const emailExists = users.some(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
        throw new Error("This email is already registered.");
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be strong.");
    }

    // Create new user object
    const newUser = {
        name: name.trim(),
        email: email.toLowerCase(),
        password: password
    };

    // Add user to array
    users.push(newUser);

    // Return success response with user details
    return {
        message: "Registration successful!",
        user: {
            name: newUser.name,
            email: newUser.email
        }
    };
}

module.exports = { registerUser, users };