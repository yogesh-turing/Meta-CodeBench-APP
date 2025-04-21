class Location {
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

    distanceTo(otherLocation) {
        return Math.sqrt(
            Math.pow(this.lat - otherLocation.lat, 2) + 
            Math.pow(this.lng - otherLocation.lng, 2)
        );
    }

    isValid() {
        return typeof this.lat === 'number' && 
               typeof this.lng === 'number' && 
               !isNaN(this.lat) && 
               !isNaN(this.lng);
    }
}

class Driver {
    constructor(id, location) {
        this.id = id;
        this.location = location;
    }
}

class RideMatchingService {
    #drivers = new Map();

    #validateLocation(location) {
        if (!location || !location.lat || !location.lng) {
            throw new Error("Invalid location data");
        }
        return new Location(location.lat, location.lng);
    }

    #validateDriverId(driverId) {
        if (!driverId) {
            throw new Error("Invalid driver ID");
        }
        return String(driverId);
    }

    registerDriver(driverId, location) {
        try {
            const validatedLocation = this.#validateLocation(location);
            const validatedDriverId = this.#validateDriverId(driverId);

            if (!validatedLocation.isValid()) {
                return "Invalid driver data";
            }

            this.#drivers.set(
                validatedDriverId, 
                new Driver(validatedDriverId, validatedLocation)
            );
            return "Driver registered";
        } catch (error) {
            return "Invalid driver data";
        }
    }

    findNearestDriver(riderLocation) {
        try {
            const validatedLocation = this.#validateLocation(riderLocation);
            
            if (!validatedLocation.isValid() || this.#drivers.size === 0) {
                return "No drivers available";
            }

            let nearestDriver = null;
            let minDistance = Infinity;

            this.#drivers.forEach((driver) => {
                const distance = driver.location.distanceTo(validatedLocation);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestDriver = driver;
                }
            });

            return nearestDriver 
                ? { driverId: nearestDriver.id, distance: minDistance }
                : "No drivers available";
        } catch (error) {
            return "Invalid rider location";
        }
    }

    completeRide(driverId) {
        try {
            const validatedDriverId = this.#validateDriverId(driverId);
            
            if (!this.#drivers.has(validatedDriverId)) {
                return "Driver not found";
            }

            this.#drivers.delete(validatedDriverId);
            return "Ride completed, driver removed";
        } catch (error) {
            return "Driver not found";
        }
    }
}

module.exports = { RideMatchingService };