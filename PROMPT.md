
Base Code:
```javascript
const TRAVEL_COST_PER_KM = 10;
class Location {
    constructor(id, name, latitude, longitude) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

class Agent {
    #assignedTickets = [];
        constructor(id, name, location) {
        this.id = id;
        this.name = name;
        this.location = location;
    }

    getDistanceAndTravelCost(location) {

        // TODO: complete the function to calculate distance and cost
        // Use TRAVEL_COST_PER_KM to calculate the traveling cost

        return { distance: distanceMeters, cost: travelCost };
    }

}

module.exports = { Agent, Ticket, Location, assignTicketToAgent };
```

Prompt:
Please complete the following function
1. Complete `getDistanceAndTravelCost` function: 
    - This function should return the distance and cost.
    - Use TRAVEL_COST_PER_KM to calculate the traveling cost
    