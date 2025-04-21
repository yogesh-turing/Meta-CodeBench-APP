class RideMatchingService {
    /**
     * Initialize the RideMatchingService instance.
     */
    constructor() {
      this.drivers = {};
    }
  
    /**
     * Register a driver with their location.
     * 
     * @param {string} driverId - Unique ID of the driver.
     * @param {object} location - Location of the driver with lat and lng properties.
     * @returns {string} - Success message or error message if driver data is invalid.
     */
    registerDriver(driverId, location) {
      if (!this.isValidLocation(location)) {
        return "Invalid driver data";
      }
      this.drivers[driverId] = location;
      return "Driver registered";
    }
  
    /**
     * Find the nearest driver to the rider's location.
     * 
     * @param {object} riderLocation - Location of the rider with lat and lng properties.
     * @returns {object|string} - Nearest driver's ID and distance or error message if no drivers are available.
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
  
      return nearestDriver ? { driverId: nearestDriver, distance: minDistance } : "No drivers available";
    }
  
    /**
     * Complete the ride and remove the driver from the list.
     * 
     * @param {string} driverId - Unique ID of the driver.
     * @returns {string} - Success message or error message if driver is not found.
     */
    completeRide(driverId) {
      if (!this.drivers[driverId]) {
        return "Driver not found";
      }
      delete this.drivers[driverId];
      return "Ride completed, driver removed";
    }
  
    /**
     * Check if the location object has valid lat and lng properties.
     * 
     * @param {object} location - Location object with lat and lng properties.
     * @returns {boolean} - True if location is valid, false otherwise.
     */
    isValidLocation(location) {
      return location && typeof location.lat === 'number' && typeof location.lng === 'number';
    }
  
    /**
     * Calculate the Euclidean distance between two points.
     * 
     * @param {object} point1 - First point with lat and lng properties.
     * @param {object} point2 - Second point with lat and lng properties.
     * @returns {number} - Euclidean distance between the two points.
     */
    calculateDistance(point1, point2) {
      return Math.sqrt(Math.pow(point1.lat - point2.lat, 2) + Math.pow(point1.lng - point2.lng, 2));
    }
  }
  
  module.exports = { RideMatchingService };