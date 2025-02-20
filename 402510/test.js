const { validatePhoneNumbers } = require("./solution");

describe("validatePhoneNumbers", () => {
  it("should correctly format valid international numbers", () => {
    expect(
      validatePhoneNumbers([
        "+1 212-555-0123", // US (New York)
        "+44 20 7946 0958", // UK
        "+91 98765 43210", // India
        "+33 1 70 18 99 79", // France
      ])
    ).toEqual([
      "+12125550123",
      "+442079460958",
      "+919876543210",
      "+33170189979",
    ]);
  });

  it("should correctly format US numbers without a country code", () => {
    expect(
      validatePhoneNumbers([
        "212-555-0123",
        "(305) 555-0123",
        "415.555.0132",
        "   2125550123  ",
      ])
    ).toEqual(["+12125550123", "+13055550123", "+14155550132", "+12125550123"]);
  });

  it("should return null for numbers with incorrect format", () => {
    expect(
      validatePhoneNumbers([
        "987654321", // Too short
        "12345", // Too short
        "abcdefghijk", // Not a number
        "123-45-67890", // Wrong format
        "999-999-99999999", // Too long
        "+1 999", // Not a valid phone number
        "+999999999999999", // Invalid country code
      ])
    ).toEqual([null, null, null, null, null, null, null]);
  });

  it("should return null for non-string inputs", () => {
    expect(
      validatePhoneNumbers([null, undefined, 1234567890, {}, [], () => {}])
    ).toEqual([null, null, null, null, null, null]);
  });

  it("should return an empty array if given an empty array", () => {
    expect(validatePhoneNumbers([])).toEqual([]);
  });

  it("should throw an error if the input is not an array", () => {
    expect(() => validatePhoneNumbers("212-555-0123")).toThrow();
    expect(() => validatePhoneNumbers(null)).toThrow();
    expect(() => validatePhoneNumbers(1234567890)).toThrow();
    expect(() => validatePhoneNumbers({})).toThrow();
  });

  it("should correctly handle additional valid international numbers", () => {
    expect(
      validatePhoneNumbers([
        "+49 30 901820", // Germany
        "+61 2 9374 4000", // Australia
        "+81 3-5321-1234", // Japan
      ])
    ).toEqual(["+4930901820", "+61293744000", "+81353211234"]);
  });

  it("should correctly handle valid numbers with spaces and mixed formatting", () => {
    expect(
      validatePhoneNumbers([
        "+1  212 555 0123",
        "+1-212.555.0123",
        "+44-20 7946-0958",
      ])
    ).toEqual(["+12125550123", "+12125550123", "+442079460958"]);
  });

  it("should return null for invalid but long phone numbers", () => {
    expect(
      validatePhoneNumbers([
        "+1 212-555-012345", // Too long
        "+999999999999999999", // Too many digits
      ])
    ).toEqual([null, null]);
  });

  it("should correctly format numbers from different continents", () => {
    expect(
      validatePhoneNumbers([
        "+55 11 99999-9999", // Brazil
        "+27 21 123 4567", // South Africa
        "+86 10 6552 9988", // China
      ])
    ).toEqual(["+5511999999999", "+27211234567", "+861065529988"]);
  });

  it("should correctly handle mixed valid and invalid numbers in an array", () => {
    expect(
      validatePhoneNumbers([
        "+1 212-555-0123", // Valid US
        "212-555-0123", // US assumed valid
        "+49 30 901820", // Valid Germany
        "abcdefg", // Invalid characters
        "+91 98765 43210", // Valid India
      ])
    ).toEqual([
      "+12125550123",
      "+12125550123",
      "+4930901820",
      null,
      "+919876543210",
    ]);
  });
});
