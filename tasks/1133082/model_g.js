class RideMatchingService {
    /**
     * Creates an instance of RideMatchingService.
     */
    constructor() {
      this.drivers = {};
    }
  
    /**
     * Registers a driver with their location.
     *
     * @param {string} driverId - Unique identifier for the driver.
     * @param {Object} location - Location of the driver.
     * @param {number} location.lat - Latitude of the driver's location.
     * @param {number} location.lng - Longitude of the driver's location.
     * @returns {string} Success message or error message if driver data is invalid.
     */
    registerDriver(driverId, location) {
      if (!this.isValidLocation(location) || !driverId) {
        return "Invalid driver data";
      }
  
      this.drivers[driverId] = location;
      return "Driver registered";
    }
  
    /**
     * Finds the nearest driver to the rider's location.
     *
     * @param {Object} riderLocation - Location of the rider.
     * @param {number} riderLocation.lat - Latitude of the rider's location.
     * @param {number} riderLocation.lng - Longitude of the rider's location.
     * @returns {Object|string} Details of the nearest driver or error message if no drivers are available.
     */
    findNearestDriver(riderLocation) {
      if (!this.isValidLocation(riderLocation)) {
        return "Invalid rider location";
      }
  
      let nearestDriver = null;
      let minDistance = Infinity;
  
      for (const driverId in this.drivers) {
        const distance = this.calculateDistance(riderLocation, this.drivers[driverId]);
  
        if (distance < minDistance) {
          minDistance = distance;
          nearestDriver = driverId;
        }
      }
  
      return nearestDriver
        ? { driverId: nearestDriver, distance: minDistance }
        : "No drivers available";
    }
  
    /**
     * Completes a ride and removes the driver from the service.
     *
     * @param {string} driverId - Unique identifier for the driver.
     * @returns {string} Success message or error message if driver is not found.
     */
    completeRide(driverId) {
      if (!this.drivers[driverId]) {
        return "Driver not found";
      }
  
      delete this.drivers[driverId];
      return "Ride completed, driver removed";
    }
  
    /**
     * Checks if a location object is valid (contains lat and lng properties).
     *
     * @param {Object} location - Location object to validate.
     * @returns {boolean} True if the location is valid, false otherwise.
     */
    isValidLocation(location) {
      return location && typeof location.lat === "number" && typeof location.lng === "number";
    }
  
    /**
     * Calculates the Euclidean distance between two points.
     *
     * @param {Object} point1 - First point with lat and lng properties.
     * @param {Object} point2 - Second point with lat and lng properties.
     * @returns {number} Euclidean distance between the two points.
     */
    calculateDistance(point1, point2) {
      return Math.sqrt(
        Math.pow(point1.lat - point2.lat, 2) + Math.pow(point1.lng - point2.lng, 2)
      );
    }
  }
  
  module.exports = { RideMatchingService };