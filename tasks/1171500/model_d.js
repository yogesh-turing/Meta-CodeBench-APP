const Joi = require("joi");
const R = require("ramda");

class UserAuthenticationSystem {
  constructor() {
    this.users = [];
  }

  _validateStringParam(param, functionName) {
    if (typeof param !== "string") {
      throw new Error(`Invalid parameter passed to ${functionName}`);
    }
  }

  registerUser(username, password, email, role) {
    this._validateStringParam(username, "registerUser");
    this._validateStringParam(password, "registerUser");
    this._validateStringParam(email, "registerUser");
    this._validateStringParam(role, "registerUser");

    const usernameSchema = Joi.string().alphanum().min(4).max(20);
    const passwordSchema = Joi.string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/);
    const emailSchema = Joi.string().email();
    const roleSchema = Joi.string().valid("user", "admin", "moderator");

    const usernameValidation = usernameSchema.validate(username);
    const passwordValidation = passwordSchema.validate(password);
    const emailValidation = emailSchema.validate(email);
    const roleValidation = roleSchema.validate(role);

    if (usernameValidation.error) throw new Error("Invalid username format");
    if (passwordValidation.error) throw new Error("Password is not strong enough");
    if (emailValidation.error) throw new Error("Invalid email format");
    if (roleValidation.error) throw new Error("Invalid role specified");

    const userExists = this.users.some(user => user.username === username);
    if (userExists) throw new Error("User already exists");

    this.users.push({ username, password, email, role });
  }

  loginUser(username, password) {
    this._validateStringParam(username, "loginUser");
    this._validateStringParam(password, "loginUser");

    const user = this.users.find(user => user.username === username);
    if (!user || user.password !== password) {
      throw new Error("Invalid username or password");
    }
    return "sessionToken123";
  }

  changeUserPassword(username, oldPassword, newPassword) {
    this._validateStringParam(username, "changeUserPassword");
    this._validateStringParam(oldPassword, "changeUserPassword");
    this._validateStringParam(newPassword, "changeUserPassword");

    const userIndex = this.users.findIndex(user => user.username === username);
    if (userIndex === -1 || this.users[userIndex].password !== oldPassword) {
      throw new Error("Invalid username or password");
    }

    const passwordSchema = Joi.string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/);
    const passwordValidation = passwordSchema.validate(newPassword);
    
    if (passwordValidation.error) {
      throw new Error("New password is not strong enough");
    }

    this.users[userIndex].password = newPassword;
  }

  assignRoleToUser(username, role) {
    this._validateStringParam(username, "assignRoleToUser");
    this._validateStringParam(role, "assignRoleToUser");

    const roleSchema = Joi.string().valid("user", "admin", "moderator");
    const roleValidation = roleSchema.validate(role);
    if (roleValidation.error) {
      throw new Error("Invalid role");
    }

    const userIndex = this.users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users[userIndex].role = role;
  }

  getUsersByRole(role) {
    this._validateStringParam(role, "getUsersByRole");

    const roleSchema = Joi.string().valid("user", "admin", "moderator");
    const roleValidation = roleSchema.validate(role);
    if (roleValidation.error) {
      throw new Error("Invalid role");
    }

    const usersWithRole = this.users.filter(user => user.role === role);
    return usersWithRole.length === 0 
      ? "No users found with the specified role" 
      : usersWithRole;
  }

  validateEmail(email) {
    this._validateStringParam(email, "validateEmail");

    const emailSchema = Joi.string().email();
    const { error } = emailSchema.validate(email);
    if (error) {
      throw new Error("Invalid email format");
    }
    return true;
  }
}

module.exports = { UserAuthenticationSystem };