class RideMatchingService {
    #drivers;
  
    constructor() {
      this.#drivers = {};
    }
  
    registerDriver(driverId, location) {
      if (!this.isValidLocation(location)) return "Invalid driver data";
      if (!driverId) return "Invalid driver data";
  
      this.#drivers[driverId] = location;
      return "Driver registered";
    }
  
    findNearestDriver(riderLocation) {
      if (!this.isValidLocation(riderLocation)) return "Invalid rider location";
  
      let nearestDriver = null;
      let minDistance = Infinity;
  
      for (let driverId in this.#drivers) {
        let distance = this.calculateDistance(
          riderLocation,
          this.#drivers[driverId]
        );
  
        if (distance < minDistance) {
          minDistance = distance;
          nearestDriver = driverId;
        }
      }
      return nearestDriver
        ? { driverId: nearestDriver, distance: minDistance }
        : "No drivers available";
    }
  
    completeRide(driverId) {
      if (!this.#drivers[driverId]) return "Driver not found";
      delete this.#drivers[driverId];
      return "Ride completed, driver removed";
    }
  
    #calculateDistance(loc1, loc2) {
      return Math.sqrt(
        Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2)
      );
    }
  
    #isValidLocation(location) {
      return location && location.lat && location.lng;
    }
  }
  
  module.exports = { RideMatchingService };
  