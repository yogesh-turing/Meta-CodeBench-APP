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

    #validateLocation(location) {
        return location && 
               typeof location.lat === 'number' && 
               typeof location.lng === 'number';
    }

    #validateDriverId(driverId) {
        return driverId && typeof driverId === 'string';
    }

    #calculateDistance(point1, point2) {
        return Math.sqrt(
            Math.pow(point1.lat - point2.lat, 2) + 
            Math.pow(point1.lng - point2.lng, 2)
        );
    }

    registerDriver(driverId, location) {
        if (!this.#validateDriverId(driverId)) {
            return "Invalid driver ID";
        }
        
        if (!this.#validateLocation(location)) {
            return "Invalid location data";
        }

        const driver = new Driver(driverId, location);
        this.drivers.set(driverId, driver);
        return "Driver registered";
    }

    findNearestDriver(riderLocation) {
        if (!this.#validateLocation(riderLocation)) {
            return "Invalid rider location";
        }

        if (this.drivers.size === 0) {
            return "No drivers available";
        }

        let nearestDriver = null;
        let minDistance = Infinity;

        for (const [driverId, driver] of this.drivers) {
            const distance = this.#calculateDistance(riderLocation, driver.location);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestDriver = driverId;
            }
        }

        return {
            driverId: nearestDriver,
            distance: minDistance
        };
    }

    completeRide(driverId) {
        if (!this.drivers.has(driverId)) {
            return "Driver not found";
        }

        this.drivers.delete(driverId);
        return "Ride completed, driver removed";
    }
}

module.exports = { RideMatchingService };