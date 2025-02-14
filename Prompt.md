```Javascript
const users = [];

function registerUser(name, email, password) {
    // TODO: Complete user registration with validation and error handling
}
module.exports = { registerUser, users };

```
Complete the registerUser method to correctly validate user registration and ensure all fields meet the following checks for the registration page:
- Ensure the registerUser method receives name, email, and password as input for the registration page.
- If the form is submitted without a name, email, or password, throw an error with the message:"All fields are required."
- Ensure the email follows a valid format. If the email is invalid, throw an error with the message:"Invalid email format. Please enter a valid email address."
- Ensure the email check is case-insensitive (e.g., Test@Email.com should be treated the same as test@email.com)
- Before registering a new user, check if the email is already in use. If the email is already registered, throw an error with the message:"This email is already registered."
- Ensure the password meets security requirements (e.g., at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character). If the password is weak, throw an error with a message like:"Password must be strong."

- Ensure the name contains only letters and spaces, is not empty, and does not consist of only spaces. If the name is invalid, throw an error with the message: "Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces."

- After successfully registering the user, return a response with "Registration successful!" along with the registered user details such as name and email.