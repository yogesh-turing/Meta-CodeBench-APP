const TRAVEL_COST_PER_KM = 10;
const TRAVEL_TIME_PER_KM_IN_MINUTES = 15;

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
    
    constructor(id, name, location, hourlyRate) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.#assignedTickets = [];
        this.hourlyRate = hourlyRate;
    }

    getDistanceAndTravelCost(location) {
        const toRadians = (degree) => degree * (Math.PI / 180);
        const earthRadiusKm = 6371;

        const dLat = toRadians(location.latitude - this.location.latitude);
        const dLon = toRadians(location.longitude - this.location.longitude);

        const lat1 = toRadians(this.location.latitude);
        const lat2 = toRadians(location.latitude);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        const distanceKm = earthRadiusKm * c;
        const distanceMeters = distanceKm * 1000;
        const travelCost = distanceKm * TRAVEL_COST_PER_KM;

        return { distance: distanceMeters, cost: travelCost };
    }

    setAssignedTickets(tickets) {
        this.#assignedTickets = tickets;
    }

    getAssignedTickets() {
        return this.#assignedTickets;
    }
}

class Ticket {
    constructor(id, location, estimatedTimeToComplete, dueAt) {
        this.id = id;
        this.location = location;
        this.estimatedTimeToComplete = estimatedTimeToComplete;
        this.dueAt = dueAt;
    }

    assignTo(agent) {
        this.agent = agent;
    }
}

function assignTicketToAgent(agents, ticket) {
    if (!Array.isArray(agents) || agents.some(agent => !(agent instanceof Agent))) {
        throw new Error("Invalid agents array");
    }
    if (!(ticket instanceof Ticket)) {
        throw new Error("Invalid ticket");
    }
    if (ticket.agent) {
        throw new Error("Ticket is already assigned");
    }

    let bestAgent = null;
    let lowestCost = Infinity;

    for (const agent of agents) {
        let lastLocation = agent.location;
        let totalTravelTime = 0;

        for (const assignedTicket of agent.getAssignedTickets()) {
            const { distance } = agent.getDistanceAndTravelCost(assignedTicket.location);
            totalTravelTime += (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES + assignedTicket.estimatedTimeToComplete;
            lastLocation = assignedTicket.location;
        }

        const { distance, cost: travelCost } = agent.getDistanceAndTravelCost(ticket.location);
        const travelTime = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
        const totalTime = totalTravelTime + travelTime + ticket.estimatedTimeToComplete;

        if (new Date(Date.now() + totalTime * 60000) > new Date(ticket.dueAt)) {
            continue;
        }

        const totalCost = (agent.hourlyRate * (totalTime / 60)) + travelCost;

        if (totalCost < lowestCost) {
            lowestCost = totalCost;
            bestAgent = agent;
        }
    }

    if (!bestAgent) {
        throw new Error("No agent available to complete the ticket before due date");
    }

    ticket.assignTo(bestAgent);
    bestAgent.setAssignedTickets([...bestAgent.getAssignedTickets(), ticket]);
}

module.exports = { Agent, Ticket, Location, assignTicketToAgent };