const { registerUser, users } = require('./alternate_responses/model1');

describe("registerUser function", () => {
  beforeEach(() => {
    users.length = 0;
  });

  test("should register a user successfully with valid input", () => {
    const result = registerUser("John Doe", "john@example.com", "Strong@123");
    expect(result).toEqual({
      message: "Registration successful!",
      user: {
        name: "John Doe",
        email: "john@example.com",
      },
    });
    expect(users).toHaveLength(1);
  });

  test("should throw an error if name, email, or password is missing", () => {
    expect(() => registerUser("", "test@example.com", "Strong@123")).toThrow(
      "All fields are required."
    );
    expect(() => registerUser("John Doe", "", "Strong@123")).toThrow(
      "All fields are required."
    );
    expect(() => registerUser("John Doe", "test@example.com", "")).toThrow(
      "All fields are required."
    );
  });

  test("should throw an error for invalid email format", () => {
    expect(() =>
      registerUser("John Doe", "invalid-email", "Strong@123")
    ).toThrow("Invalid email format. Please enter a valid email address.");
    expect(() => registerUser("John Doe", "test@com", "Strong@123")).toThrow(
      "Invalid email format. Please enter a valid email address."
    );
  });

  test("should enforce case-insensitive email uniqueness", () => {
    registerUser("John Doe", "test@EMAIL.com", "Strong@123");
    expect(() =>
      registerUser("Jane Doe", "TEST@email.com", "Strong@123")
    ).toThrow("This email is already registered.");
  });

  test("should throw an error if email is already registered", () => {
    registerUser("John Doe", "test@example.com", "Strong@123");
    expect(() =>
      registerUser("Jane Doe", "test@example.com", "Strong@123")
    ).toThrow("This email is already registered.");
  });

  test("should throw an error for weak password", () => {
    expect(() => registerUser("John Doe", "john@example.com", "weak")).toThrow(
      "Password must be strong."
    );
    expect(() =>
      registerUser("John Doe", "john@example.com", "NoSpecial1")
    ).toThrow("Password must be strong.");
    expect(() =>
      registerUser("John Doe", "john@example.com", "nouppercase1@")
    ).toThrow("Password must be strong.");
    expect(() =>
      registerUser("John Doe", "john@example.com", "NOLOWERCASE1@")
    ).toThrow("Password must be strong.");
    expect(() =>
      registerUser("John Doe", "john@example.com", "NoNumber@")
    ).toThrow("Password must be strong.");
  });

  test("should throw an error for invalid name (numbers or special characters)", () => {
    expect(() =>
      registerUser("John123", "john@example.com", "Strong@123")
    ).toThrow(
      "Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces."
    );
    expect(() =>
      registerUser("John@Doe", "john@example.com", "Strong@123")
    ).toThrow(
      "Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces."
    );
  });

  test("should store registered users correctly", () => {
    registerUser("John Doe", "john@example.com", "Strong@123");
    registerUser("Jane Doe", "jane@example.com", "Strong@123");
    expect(users).toHaveLength(2);
    expect(users[0]).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
    });
    expect(users[1]).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
    });
  });

  test.only("should throw an error if name contains leading or trailing spaces", () => {
    expect(() =>
      registerUser("  John Doe  ", "john@example.com", "Strong@123")
    ).toThrow(
      "Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces."
    );
  });

  test("should throw an error if email contains leading or trailing spaces", () => {
    expect(() =>
      registerUser("John Doe", "  john@example.com  ", "Strong@123")
    ).toThrow("Invalid email format. Please enter a valid email address.");
  });

  test("should not return the password in the response", () => {
    const result = registerUser("John Doe", "john@example.com", "Strong@123");
    expect(result.user).not.toHaveProperty("password");
  });

  test("should throw an error if name is just spaces", () => {
    expect(() =>
      registerUser("     ", "john@example.com", "Strong@123")
    ).toThrow(
      "Invalid name. Name should only contain alphabets and cannot be empty or contain only spaces."
    );
  });

  test("should enforce case-insensitivity for the entire email, including domain", () => {
    registerUser("John Doe", "test@EXAMPLE.com", "Strong@123");
    expect(() =>
      registerUser("Jane Doe", "test@example.com", "Strong@123")
    ).toThrow("This email is already registered.");
  });

  test("should allow multiple users with unique emails", () => {
    registerUser("John Doe", "john@example.com", "Strong@123");
    registerUser("Jane Doe", "jane@example.com", "Strong@123");
    registerUser("Alice Smith", "alice@example.com", "Strong@123");

    expect(users).toHaveLength(3);
  });

  test("should throw an error if password is exactly 8 characters but does not meet strength requirements", () => {
    expect(() =>
      registerUser("John Doe", "john@example.com", "Weak1234")
    ).toThrow("Password must be strong.");
  });

  test("should allow a password with exactly 8 characters if it meets strength requirements", () => {
    expect(() =>
      registerUser("John Doe", "john@example.com", "A1@abcde")
    ).not.toThrow();
  });

  test("should allow different subdomains as unique emails", () => {
    registerUser("John Doe", "test@mail.example.com", "Strong@123");
    expect(() =>
      registerUser("Jane Doe", "test@example.com", "Strong@123")
    ).not.toThrow();
  });
});
