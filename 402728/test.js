const { ReservationSystem } = require("./solution");

describe("ReservationSystem", () => {
  let system;

  beforeEach(() => {
    system = new ReservationSystem();
  });

  test("should return true for an available time slot", () => {
    expect(system.isAvailable("2024-02-17", "14:00")).toBe(true);
  });

  test("should return false for a booked time slot", () => {
    system.reserve("2024-02-17", "14:00", "America/New_York");
    expect(system.isAvailable("2024-02-17", "14:00")).toBe(false);
  });

  test("should throw error when booking an already reserved time slot", () => {
    system.reserve("2024-02-17", "14:00", "America/New_York");
    expect(() => {
      system.reserve("2024-02-17", "14:00", "America/New_York");
    }).toThrow();
  });

  test("should throw error when booking outside business hours", () => {
    expect(() => {
      system.reserve("2024-02-17", "07:59", "America/New_York");
    }).toThrow();

    expect(() => {
      system.reserve("2024-02-17", "17:01", "UTC");
    }).toThrow();
  });

  test("should convert time from UTC to specified time zone correctly", () => {
    expect(system.adjustToTimeZone("14:00", "America/New_York")).toBe("09:00");
    expect(system.adjustToTimeZone("17:00", "Europe/London")).toBe("17:00");
  });

  test("should throw an error for invalid time zone", () => {
    expect(() => {
      system.adjustToTimeZone("14:00", "Invalid/Timezone");
    }).toThrow();
  });

  test("should validate if the specified time zone exists", () => {
    expect(() =>
      system.adjustToTimeZone("12:00", "Asia/Kolkata")
    ).not.toThrow();
    expect(() =>
      system.adjustToTimeZone("12:00", "Europe/Berlin")
    ).not.toThrow();
  });

  test("should handle leap year correctly", () => {
    system.reserve("2024-02-29", "10:00", "UTC");
    expect(system.isAvailable("2024-02-29", "10:00")).toBe(false);
  });

  test("should throw an error if input format is incorrect", () => {
    expect(() => {
      system.reserve("2024-02-17", "invalidTime", "UTC");
    }).toThrow();

    expect(() => {
      system.reserve("invalidDate", "14:00", "UTC");
    }).toThrow();
  });

  test("should handle missing reservation parameters", () => {
    expect(() => system.reserve()).toThrow();
    expect(() => system.reserve("2024-02-17")).toThrow();
    expect(() => system.reserve("2024-02-17", "14:00")).toThrow();
  });

  test("should allow multiple reservations at different times on the same day", () => {
    system.reserve("2024-02-17", "09:00", "UTC");
    system.reserve("2024-02-17", "10:00", "UTC");
    system.reserve("2024-02-17", "11:00", "UTC");
    expect(system.isAvailable("2024-02-17", "09:00")).toBe(false);
    expect(system.isAvailable("2024-02-17", "10:00")).toBe(false);
    expect(system.isAvailable("2024-02-17", "11:00")).toBe(false);
  });

  test("should throw error for invalid date formats", () => {
    expect(() => {
      system.reserve("17-02-2024", "10:00", "UTC");
    }).toThrow();

    expect(() => {
      system.reserve("2024/02/17", "10:00", "UTC");
    }).toThrow();
  });

  test("should throw error if reservation is made with an empty time slot", () => {
    expect(() => {
      system.reserve("2024-02-17", "", "UTC");
    }).toThrow();
  });

  test("should throw an error if trying to adjust time with an empty time zone", () => {
    expect(() => {
      system.adjustToTimeZone("14:00", "");
    }).toThrow();
  });

  test("should prevent bookings for invalid UTC times", () => {
    expect(() => {
      system.reserve("2024-02-17", "25:00", "UTC");
    }).toThrow();

    expect(() => {
      system.reserve("2024-02-17", "13:60", "UTC");
    }).toThrow();
  });

  test("should reject reservations with invalid characters in time and date", () => {
    expect(() => {
      system.reserve("2024-02-17", "13:MM", "UTC");
    }).toThrow();

    expect(() => {
      system.reserve("202X-02-17", "13:00", "UTC");
    }).toThrow();
  });
});