class Location {
    constructor(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }
  
    static isValid(location) {
      return (
        location &&
        typeof location.lat === "number" &&
        typeof location.lng === "number"
      );
    }
  
    distanceTo(otherLocation) {
      return Math.sqrt(
        Math.pow(this.lat - otherLocation.lat, 2) +
          Math.pow(this.lng - otherLocation.lng, 2)
      );
    }
  }
  
  class Driver {
    constructor(id, location) {
      this.id = id;
      this.location = location;
    }
  }
  
  class RideMatchingService {
    constructor() {
      this.drivers = new Map();
    }
  
    /**
     * Registers a new driver with their location
     * @param {string} driverId - The unique identifier for the driver
     * @param {Object} location - The location object containing lat and lng
     * @returns {string} - Status message
     */
    registerDriver(driverId, location) {
      if (!this.validateDriverData(driverId, location)) {
        return "Invalid driver data";
      }
  
      const driverLocation = new Location(location.lat, location.lng);
      this.drivers.set(driverId, new Driver(driverId, driverLocation));
      return "Driver registered";
    }
  
    /**
     * Finds the nearest driver to a rider's location
     * @param {Object} riderLocation - The location object containing lat and lng
     * @returns {Object|string} - Driver information or error message
     */
    findNearestDriver(riderLocation) {
      if (!Location.isValid(riderLocation)) {
        return "Invalid rider location";
      }
  
      if (this.drivers.size === 0) {
        return "No drivers available";
      }
  
      const riderLoc = new Location(riderLocation.lat, riderLocation.lng);
      let nearestDriver = null;
      let minDistance = Infinity;
  
      for (const [driverId, driver] of this.drivers) {
        const distance = driver.location.distanceTo(riderLoc);
        if (distance < minDistance) {
          minDistance = distance;
          nearestDriver = driverId;
        }
      }
  
      return {
        driverId: nearestDriver,
        distance: minDistance,
      };
    }
  
    /**
     * Completes a ride and removes the driver from available drivers
     * @param {string} driverId - The unique identifier for the driver
     * @returns {string} - Status message
     */
    completeRide(driverId) {
      if (!this.drivers.has(driverId)) {
        return "Driver not found";
      }
  
      this.drivers.delete(driverId);
      return "Ride completed, driver removed";
    }
  
    /**
     * Validates driver registration data
     * @private
     */
    validateDriverData(driverId, location) {
      return (
        driverId && typeof driverId === "string" && Location.isValid(location)
      );
    }
  }
  
  module.exports = { RideMatchingService };
  