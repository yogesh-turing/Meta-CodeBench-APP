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

    let selectedAgent = null;
    let lowestTotalCost = Infinity;

    for (const agent of agents) {
        // Get agent's current tasks completion time
        const assignedTickets = agent.getAssignedTickets();
        let currentTime = new Date();
        let agentLocation = agent.location;

        // Calculate completion time for all assigned tickets
        for (const assignedTicket of assignedTickets) {
            const { distance } = agent.getDistanceAndTravelCost(assignedTicket.location);
            const travelTimeMinutes = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
            currentTime = new Date(currentTime.getTime() + (travelTimeMinutes + assignedTicket.estimatedTimeToComplete) * 60000);
            agentLocation = assignedTicket.location;
        }

        // Calculate travel details from last location to new ticket location
        const { distance, cost: travelCost } = agent.getDistanceAndTravelCost.call(
            { location: agentLocation },
            ticket.location
        );

        // Calculate travel time to the new ticket
        const travelTimeMinutes = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
        const ticketStartTime = new Date(currentTime.getTime() + travelTimeMinutes * 60000);
        const ticketEndTime = new Date(ticketStartTime.getTime() + ticket.estimatedTimeToComplete * 60000);

        // Check if ticket can be completed before due date
        if (ticketEndTime > new Date(ticket.dueAt)) {
            continue;
        }

        // Calculate total cost including travel and work
        const travelTimeCost = (travelTimeMinutes / 60) * agent.hourlyRate;
        const workCost = (ticket.estimatedTimeToComplete / 60) * agent.hourlyRate;
        const totalCost = travelCost + travelTimeCost + workCost;

        // Update selected agent if this agent has lower total cost
        if (totalCost < lowestTotalCost) {
            lowestTotalCost = totalCost;
            selectedAgent = agent;
        }
    }

    if (!selectedAgent) {
        throw new Error("No agent can complete the ticket before its due date");
    }

    // Assign ticket to selected agent
    ticket.assignTo(selectedAgent);
    selectedAgent.setAssignedTickets([...selectedAgent.getAssignedTickets(), ticket]);

    return selectedAgent;
}

module.exports = { Agent, Ticket, Location, assignTicketToAgent };