const { validateSignUpFormData } = require("./solution");

describe("validateSignUpFormData", () => {
  test("should validate successful signup with complete address", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "Secure123",
      confirm_password: "Secure123",
      address: {
        house_no: "42",
        street_address: "Main Boulevard",
        city: "Lahore",
        state: "Punjab",
      },
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: true,
      message: null,
    });
  });

  test("should validate successful signup without address", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "Secure123",
      confirm_password: "Secure123",
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: true,
      message: null,
    });
  });

  test("should fail when firstname is missing", () => {
    const input = {
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "Secure123",
      confirm_password: "Secure123",
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message: "firstname is required.",
    });
  });

  test("should fail when address is provided but street_address is missing", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "Secure123",
      confirm_password: "Secure123",
      address: {
        house_no: "42",
        city: "Lahore",
        state: "Punjab",
      },
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message: "street_address is required.",
    });
  });

  test("should fail with invalid email domain", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@gmail.com",
      password: "StrongPass1",
      confirm_password: "StrongPass1",
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message: "Email must be in the '@finsol.pk' domain.",
    });
  });

  test("should fail with invalid email format", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "invalid.email",
      password: "Secure123",
      confirm_password: "Secure123",
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message: "Email must be in the '@finsol.pk' domain.",
    });
  });

  test("should fail when password does not meet requirements", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "weak",
      confirm_password: "weak",
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter and one numeric digit.",
    });
  });

  test("should fail when passwords do not match", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "Secure123",
      confirm_password: "Secure124",
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message: "Password and Confirm Password should match.",
    });
  });

  test("should fail with invalid state", () => {
    const input = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "Secure123",
      confirm_password: "Secure123",
      address: {
        house_no: "42",
        street_address: "Main Boulevard",
        city: "Lahore",
        state: "InvalidState",
      },
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message:
        "State must be one of: Punjab, Sindh, Balochistan, Kashmir, or KPK.",
    });
  });

  test("should fail with empty string in required field", () => {
    const input = {
      firstname: "",
      lastname: "Doe",
      email: "john.doe@finsol.pk",
      password: "Secure123",
      confirm_password: "Secure123",
    };

    expect(validateSignUpFormData(input)).toEqual({
      validation: false,
      message: "firstname is required.",
    });
  });
});