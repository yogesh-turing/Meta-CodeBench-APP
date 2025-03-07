const Joi = require("joi");
const R = require("ramda");

class UserAuthenticationSystem {
  constructor() {
    this.users = [];
    this.schemas = {
      username: Joi.string().alphanum().min(4).max(20),
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
        .message("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
      email: Joi.string().email(),
      role: Joi.string().valid("user", "admin", "moderator")
    };
  }

  _validateStringParam(param, functionName) {
    if (typeof param !== "string") {
      throw new Error(`Invalid parameter passed to ${functionName}`);
    }
  }

  _validateSchema(value, schema, errorMessage) {
    const { error } = schema.validate(value);
    if (error) throw new Error(errorMessage);
  }

  registerUser(username, password, email, role) {
    this._validateStringParam(username, "registerUser");
    this._validateStringParam(password, "registerUser");
    this._validateStringParam(email, "registerUser");
    this._validateStringParam(role, "registerUser");

    this._validateSchema(username, this.schemas.username, "Invalid username format");
    this._validateSchema(password, this.schemas.password, "Password is not strong enough");
    this._validateSchema(email, this.schemas.email, "Invalid email format");
    this._validateSchema(role, this.schemas.role, "Invalid role specified");

    const userExists = R.any(R.propEq("username", username), this.users);
    if (userExists) {
      throw new Error("User already exists");
    }

    this.users.push({ username, password, email, role });
  }

  loginUser(username, password) {
    this._validateStringParam(username, "loginUser");
    this._validateStringParam(password, "loginUser");

    const user = R.find(R.propEq("username", username), this.users);
    if (!user || user.password !== password) {
      throw new Error("Invalid username or password");
    }
    return "sessionToken123";
  }

  changeUserPassword(username, oldPassword, newPassword) {
    this._validateStringParam(username, "changeUserPassword");
    this._validateStringParam(oldPassword, "changeUserPassword");
    this._validateStringParam(newPassword, "changeUserPassword");

    const userIndex = R.findIndex(R.propEq("username", username), this.users);
    if (userIndex === -1) {
      throw new Error("Invalid username or password");
    }

    const user = this.users[userIndex];
    if (user.password !== oldPassword) {
      throw new Error("Invalid username or password");
    }

    this._validateSchema(newPassword, this.schemas.password, "New password is not strong enough");
    
    this.users[userIndex] = { ...user, password: newPassword };
  }

  assignRoleToUser(username, role) {
    this._validateStringParam(username, "assignRoleToUser");
    this._validateStringParam(role, "assignRoleToUser");

    this._validateSchema(role, this.schemas.role, "Invalid role");

    const userIndex = R.findIndex(R.propEq("username", username), this.users);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users[userIndex] = { ...this.users[userIndex], role };
  }

  getUsersByRole(role) {
    this._validateStringParam(role, "getUsersByRole");
    this._validateSchema(role, this.schemas.role, "Invalid role specified");

    const usersWithRole = R.filter(R.propEq("role", role), this.users);
    return usersWithRole.length === 0 
      ? "No users found with the specified role" 
      : usersWithRole;
  }

  validateEmail(email) {
    this._validateStringParam(email, "validateEmail");
    this._validateSchema(email, this.schemas.email, "Invalid email format");
    return true;
  }
}

module.exports = { UserAuthenticationSystem };