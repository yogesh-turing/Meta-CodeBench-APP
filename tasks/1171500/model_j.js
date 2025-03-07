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
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);
    const emailSchema = Joi.string().email();
    const roleSchema = Joi.string().valid("user", "admin", "moderator");

    const usernameValidation = usernameSchema.validate(username);
    const passwordValidation = passwordSchema.validate(password);
    const emailValidation = emailSchema.validate(email);
    const roleValidation = roleSchema.validate(role);

    if (usernameValidation.error) throw new Error("Invalid username format");
    if (passwordValidation.error)
      throw new Error("Password is not strong enough");
    if (emailValidation.error) throw new Error("Invalid email format");
    if (roleValidation.error) throw new Error("Invalid role specified");

    const userExists = R.find(
      R.propEq("username", username.toLowerCase()), 
      this.users.map(user => ({ ...user, username: user.username.toLowerCase() }))
    );
    if (userExists) throw new Error("User already exists");

    this.users.push({ username, password, email, role });
  }

  loginUser(username, password) {
    this._validateStringParam(username, "loginUser");
    this._validateStringParam(password, "loginUser");

    const user = R.find(R.propEq("username", username), this.users);
    if (!user || user.password !== password)
      throw new Error("Invalid username or password");
    return "sessionToken123";
  }

  changeUserPassword(username, oldPassword, newPassword) {
    this._validateStringParam(username, "changeUserPassword");
    this._validateStringParam(oldPassword, "changeUserPassword");
    this._validateStringParam(newPassword, "changeUserPassword");

    const user = R.find(R.propEq("username", username), this.users);
    if (!user || user.password !== oldPassword)
      throw new Error("Invalid username or password");

    const passwordSchema = Joi.string()
      .min(8)
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);
    const passwordValidation = passwordSchema.validate(newPassword);
    if (passwordValidation.error)
      throw new Error("New password is not strong enough");

    user.password = newPassword;
  }

  assignRoleToUser(username, role) {
    this._validateStringParam(username, "assignRoleToUser");
    this._validateStringParam(role, "assignRoleToUser");

    const user = R.find(R.propEq("username", username), this.users);
    if (!user) throw new Error("User not found");

    const roleSchema = Joi.string().valid("user", "admin", "moderator");
    const roleValidation = roleSchema.validate(role);
    if (roleValidation.error) throw new Error("Invalid role");

    user.role = role;
  }

  getUsersByRole(role) {
    this._validateStringParam(role, "getUsersByRole");

    const usersWithRole = this.users.filter((user) => user.role === role);
    if (usersWithRole.length === 0)
      return "No users found with the specified role";
    return usersWithRole;
  }

  validateEmail(email) {
    this._validateStringParam(email, "validateEmail");

    const emailSchema = Joi.string().email();
    const { error } = emailSchema.validate(email);
    if (error) throw new Error("Invalid email format");
    return true;
  }
}

module.exports = { UserAuthenticationSystem };