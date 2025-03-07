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

    const userExists = R.find(R.propEq(username, "username"))(this.users);
    if (userExists) {
      throw new Error("User already exists");
    }

    const schema = Joi.object({
      username: Joi.string().alphanum().min(4).max(20).required(),
      password: Joi.string()
        .min(8)
        .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
        .required(),
      email: Joi.string().email().required(),
      role: Joi.string().valid("user", "admin", "moderator").required(),
    });

    const validation = schema.validate({ username, password, email, role });
    if (validation.error) {
      const errorType = validation.error.details[0].path[0];
      switch (errorType) {
        case "username":
          throw new Error("Invalid username format");
        case "password":
          throw new Error("Password is not strong enough");
        case "email":
          throw new Error("Invalid email format");
        case "role":
          throw new Error("Invalid role specified");
        default:
          throw new Error("Validation failed");
      }
    }

    this.users.push({ username, password, email, role });
  }

  loginUser(username, password) {
    this._validateStringParam(username, "loginUser");
    this._validateStringParam(password, "loginUser");

    const user = R.find(R.whereEq({ username, password }))(this.users);
    if (!user) {
      throw new Error("Invalid username or password");
    }
    return "sessionToken123";
  }

  changeUserPassword(username, oldPassword, newPassword) {
    this._validateStringParam(username, "changeUserPassword");
    this._validateStringParam(oldPassword, "changeUserPassword");
    this._validateStringParam(newPassword, "changeUserPassword");

    const userIndex = R.findIndex(
      R.whereEq({ username, password: oldPassword })
    )(this.users);

    if (userIndex === -1) {
      throw new Error("Invalid username or password");
    }

    const passwordSchema = Joi.string()
      .min(8)
      .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
      .required();

    const validation = passwordSchema.validate(newPassword);
    if (validation.error) {
      throw new Error("New password is not strong enough");
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      password: newPassword,
    };
  }

  assignRoleToUser(username, role) {
    this._validateStringParam(username, "assignRoleToUser");
    this._validateStringParam(role, "assignRoleToUser");

    const roleSchema = Joi.string()
      .valid("user", "admin", "moderator")
      .required();
    const roleValidation = roleSchema.validate(role);
    
    if (roleValidation.error) {
      throw new Error("Invalid role");
    }

    const userIndex = R.findIndex(R.propEq(username, "username"))(this.users);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      role,
    };
  }

  getUsersByRole(role) {
    this._validateStringParam(role, "getUsersByRole");

    const usersWithRole = R.filter(R.propEq(role, "role"))(this.users);
    return usersWithRole.length === 0
      ? "No users found with the specified role"
      : usersWithRole;
  }

  validateEmail(email) {
    this._validateStringParam(email, "validateEmail");

    const emailSchema = Joi.string().email().required();
    const validation = emailSchema.validate(email);
    
    if (validation.error) {
      throw new Error("Invalid email format");
    }
    return true;
  }
}

module.exports = { UserAuthenticationSystem };