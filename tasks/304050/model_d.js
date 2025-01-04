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
    // Input validation
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
        // Get agent's last assigned ticket location
        const assignedTickets = agent.getAssignedTickets();
        const startLocation = assignedTickets.length > 0 
            ? assignedTickets[assignedTickets.length - 1].location 
            : agent.location;

        // Calculate travel details from start location to ticket location
        const travelDetails = agent.getDistanceAndTravelCost(ticket.location);
        
        // Calculate travel time in minutes
        const travelTimeMinutes = (travelDetails.distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;

        // Calculate total time needed for previously assigned tickets
        let totalTimeForPreviousTickets = 0;
        for (const assignedTicket of assignedTickets) {
            const prevTravelDetails = agent.getDistanceAndTravelCost(assignedTicket.location);
            const prevTravelTime = (prevTravelDetails.distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
            totalTimeForPreviousTickets += prevTravelTime + assignedTicket.estimatedTimeToComplete;
        }

        // Calculate when agent can start this ticket
        const now = new Date();
        const startTime = new Date(now.getTime() + totalTimeForPreviousTickets * 60000);
        
        // Calculate completion time
        const completionTime = new Date(startTime.getTime() + 
            (travelTimeMinutes + ticket.estimatedTimeToComplete) * 60000);

        // Check if ticket can be completed before due date
        if (completionTime > ticket.dueAt) {
            continue;
        }

        // Calculate total cost
        const laborCost = ((travelTimeMinutes + ticket.estimatedTimeToComplete) / 60) * agent.hourlyRate;
        const totalCost = travelDetails.cost + laborCost;

        // Update best agent if this is the lowest cost option
        if (totalCost < lowestCost) {
            lowestCost = totalCost;
            bestAgent = agent;
        }
    }

    if (!bestAgent) {
        throw new Error("No agent can complete the ticket before due date");
    }

    // Assign ticket to the best agent
    ticket.assignTo(bestAgent);
    const updatedTickets = [...bestAgent.getAssignedTickets(), ticket];
    bestAgent.setAssignedTickets(updatedTickets);

    return bestAgent;
}

module.exports = { Agent, Ticket, Location, assignTicketToAgent };