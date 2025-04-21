const { RideMatchingService } = require(process.env.TARGET_FILE);

// Unit test

describe("Real-Time Cab Booking System", () => {
  let rideService;

  beforeEach(() => {
    rideService = new RideMatchingService();
  });

  test("Should register drivers successfully", () => {
    expect(
      rideService.registerDriver("driver1", { lat: 12.9716, lng: 77.5946 })
    ).toBe("Driver registered");
    expect(
      rideService.registerDriver("driver2", { lat: 12.2958, lng: 76.6394 })
    ).toBe("Driver registered");
  });

  test("Should return error for invalid driver data", () => {
    expect(rideService.registerDriver(null, { lat: 12, lng: 77 })).toBe(
      "Invalid driver data"
    );
    expect(rideService.registerDriver("driver3", null)).toBe(
      "Invalid driver data"
    );
    expect(rideService.registerDriver("driver4", {})).toBe(
      "Invalid driver data"
    );
  });

  test("Should find the nearest driver correctly", () => {
    rideService.registerDriver("driver1", { lat: 12.9716, lng: 77.5946 });
    rideService.registerDriver("driver2", { lat: 12.2958, lng: 76.6394 });

    let result = rideService.findNearestDriver({ lat: 12.9, lng: 77.5 });
    expect(result).toHaveProperty("driverId");
    expect(result).toHaveProperty("distance");
  });

  test("Should return no drivers available when none are registered", () => {
    expect(rideService.findNearestDriver({ lat: 12, lng: 77 })).toBe(
      "No drivers available"
    );
  });

  test("Should return error for invalid rider location", () => {
    expect(rideService.findNearestDriver(null)).toBe("Invalid rider location");
    expect(rideService.findNearestDriver({})).toBe("Invalid rider location");
  });

  test("Should remove driver on ride completion", () => {
    rideService.registerDriver("driver1", { lat: 12.9716, lng: 77.5946 });
    expect(rideService.completeRide("driver1")).toBe(
      "Ride completed, driver removed"
    );
    expect(rideService.completeRide("driver1")).toBe("Driver not found");
  });

  test("Should return error for removing non-existent driver", () => {
    expect(rideService.completeRide("driverX")).toBe("Driver not found");
  });
});

describe("Object-Oriented Programming Check", () => {
  test("Should verify the use of classes and methods", () => {
    const RideMatchingServiceClass = RideMatchingService.prototype.constructor;

    // Check if RideMatchingService is a class
    expect(RideMatchingServiceClass.toString().startsWith("class")).toBe(true);

    // registerDriver should be a method of the class
    expect(
      typeof RideMatchingServiceClass.prototype.registerDriver
    ).toBe("function");
    // findNearestDriver should be a method of the class
    expect(
      typeof RideMatchingServiceClass.prototype.findNearestDriver
    ).toBe("function");
    // completeRide should be a method of the class
    expect(
      typeof RideMatchingServiceClass.prototype.completeRide
    ).toBe("function");
  });
});