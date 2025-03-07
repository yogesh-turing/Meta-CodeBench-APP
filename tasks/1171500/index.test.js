const { UserAuthenticationSystem } = require(process.env.TARGET_FILE);

describe("UserAuthenticationSystem", () => {
  let system;

  beforeEach(() => {
    system = new UserAuthenticationSystem();
  });

  // Test 1: Register User
  test("should register a user successfully", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    const users = system.users;
    expect(users.length).toBe(1);
    expect(users[0].username).toBe("john123");
    expect(users[0].email).toBe("john@example.com");
    expect(users[0].role).toBe("user");
  });

  test("should throw error if username is invalid not having length between 4 to 20 characters", () => {
    expect(() => {
      system.registerUser("jo", "Password123", "john@example.com", "user");
    }).toThrow("Invalid username format");
  });

  test("should throw error if username is invalid not having length between 4 to 20 characters", () => {
    expect(() => {
      system.registerUser("jo", "Password123", "john@example.com", "user");
    }).toThrow("Invalid username format");
  });

  test("should throw error if username is invalid having character other than alphanumeric", () => {
    expect(() => {
      system.registerUser(
        "jo#1234555*",
        "Password123",
        "john@example.com",
        "user"
      );
    }).toThrow("Invalid username format");
  });

  test("should throw error if password is not strong enough", () => {
    expect(() => {
      system.registerUser("john123", "pass", "john@example.com", "user");
    }).toThrow("Password is not strong enough");
  });

  test("should throw error if email is invalid", () => {
    expect(() => {
      system.registerUser("john123", "Password123", "invalid-email", "user");
    }).toThrow("Invalid email format");
  });

  test("should throw error if role is invalid", () => {
    expect(() => {
      system.registerUser(
        "john123",
        "Password123",
        "john@example.com",
        "guest"
      );
    }).toThrow("Invalid role");
  });

  test("should throw error if user already exists", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    expect(() => {
      system.registerUser("john123", "Password123", "john@example.com", "user");
    }).toThrow("User already exists");
  });

  // Test 2: Login User
  test("should login successfully with correct credentials", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    const token = system.loginUser("john123", "Password123");
    expect(token).toBe("sessionToken123");
  });

  test("should throw error on invalid username or password", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    expect(() => {
      system.loginUser("john123", "WrongPassword");
    }).toThrow("Invalid username or password");
  });

  // Test 3: Change User Password
  test("should change user password successfully", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    system.changeUserPassword("john123", "Password123", "NewPassword123");
    const user = system.users.find((user) => user.username === "john123");
    expect(user.password).toBe("NewPassword123");
  });

  test("should throw error if old password is incorrect", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    expect(() => {
      system.changeUserPassword(
        "john123",
        "WrongOldPassword",
        "NewPassword123"
      );
    }).toThrow("Invalid username or password");
  });

  test("should throw error if new password is not strong enough", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    expect(() => {
      system.changeUserPassword("john123", "Password123", "new");
    }).toThrow("New password is not strong enough");
  });

  // Test 4: Assign Role to User
  test("should assign a new role to user", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    system.assignRoleToUser("john123", "admin");
    const user = system.users.find((user) => user.username === "john123");
    expect(user.role).toBe("admin");
  });

  test("should throw error if user not found", () => {
    expect(() => {
      system.assignRoleToUser("nonexistentuser", "admin");
    }).toThrow("User not found");
  });

  test("should throw error if role is invalid", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    expect(() => {
      system.assignRoleToUser("john123", "superuser");
    }).toThrow("Invalid role");
  });

  // Test 5: Get Users by Role
  test("should return users with specified role", () => {
    system.registerUser("john123", "Password123", "john@example.com", "user");
    system.registerUser(
      "admin123",
      "AdminPassword123",
      "admin@example.com",
      "admin"
    );
    const users = system.getUsersByRole("user");
    expect(users.length).toBe(1);
    expect(users[0].username).toBe("john123");
  });

  test("should return 'No users found with the specified role' if no users are found", () => {
    const result = system.getUsersByRole("moderator");
    expect(result).toBe("No users found with the specified role");
  });

  // Test 6: Validate User Email
  test("should validate email format correctly", () => {
    expect(system.validateEmail("valid@example.com")).toBe(true);
  });

  test("should throw error on invalid email format", () => {
    expect(() => {
      system.validateEmail("invalid-email");
    }).toThrow("Invalid email format");
  });
});