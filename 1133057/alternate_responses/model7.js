const users = [];

function registerUser(name, email, password) {
    // Check if all fields are provided
    if (!name || !email || !password) {
        throw new Error("All fields are required.");
    }

    // Check if the name is valid
    if (!/^[a-zA-Z ]+$/.test(name) || name.trim() === "") {
        throw new Error("Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces.");
    }

    // Check if the email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format. Please enter a valid email address.");
    }

    // Check if the email is already registered
    if (users.find(user => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("This email is already registered.");
    }

    // Check if the password is strong
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be strong.");
    }

    // Register the user
    const user = { name, email };
    users.push(user);

    return { message: "Registration successful!", user };
}

module.exports = { registerUser, users };