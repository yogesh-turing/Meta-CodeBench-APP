class Location {
    constructor(lat, lng) {
        if (!this.#isValidCoordinate(lat) || !this.#isValidCoordinate(lng)) {
            throw new Error("Invalid coordinates");
        }
        this.lat = lat;
        this.lng = lng;
    }

    #isValidCoordinate(coord) {
        return typeof coord === 'number' && !isNaN(coord);
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
        if (!id || typeof id !== 'string') {
            throw new Error("Invalid driver ID");
        }
        this.id = id;
        this.location = location;
    }
}

class RideMatchingService {
    #drivers = new Map();

    registerDriver(driverId, location) {
        try {
            const driverLocation = new Location(location.lat, location.lng);
            const driver = new Driver(driverId, driverLocation);
            this.#drivers.set(driverId, driver);
            return "Driver registered";
        } catch (error) {
            return "Invalid driver data";
        }
    }

    findNearestDriver(riderLocation) {
        try {
            const pickup = new Location(riderLocation.lat, riderLocation.lng);
            
            if (this.#drivers.size === 0) {
                return "No drivers available";
            }

            let nearestDriver = null;
            let minDistance = Infinity;

            this.#drivers.forEach((driver) => {
                const distance = driver.location.distanceTo(pickup);
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
        if (!this.#drivers.has(driverId)) {
            return "Driver not found";
        }
        this.#drivers.delete(driverId);
        return "Ride completed, driver removed";
    }
}

module.exports = { RideMatchingService };