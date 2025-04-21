function RideMatchingService() {
    let drivers = {};

    return {
        registerDriver: function (driverId, location) {
            if (!driverId || !location || !location.lat || !location.lng) return "Invalid driver data";
            drivers[driverId] = location;
            return "Driver registered";
        },

        findNearestDriver: function (riderLocation) {
            if (!riderLocation || !riderLocation.lat || !riderLocation.lng) return "Invalid rider location";

            let nearestDriver = null;
            let minDistance = Infinity;

            for (let driverId in drivers) {
                let d = drivers[driverId];
                let distance = Math.sqrt(
                    Math.pow(riderLocation.lat - d.lat, 2) + Math.pow(riderLocation.lng - d.lng, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestDriver = driverId;
                }
            }
            return nearestDriver ? { driverId: nearestDriver, distance: minDistance } : "No drivers available";
        },

        completeRide: function (driverId) {
            if (!drivers[driverId]) return "Driver not found";
            delete drivers[driverId];
            return "Ride completed, driver removed";
        }
    };
}

module.exports = { RideMatchingService };