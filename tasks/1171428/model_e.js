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
        // Get agent's last assigned ticket location or current location
        let startLocation = agent.location;
        const assignedTickets = agent.getAssignedTickets();
        let availableStartTime = new Date();

        // If agent has assigned tickets, use the location and completion time of the last ticket
        if (assignedTickets.length > 0) {
            const lastTicket = assignedTickets[assignedTickets.length - 1];
            startLocation = lastTicket.location;
            
            // Calculate when the agent will be available after completing current tickets
            let currentTime = availableStartTime;
            for (const assignedTicket of assignedTickets) {
                const { distance } = agent.getDistanceAndTravelCost(assignedTicket.location);
                const travelTimeMinutes = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
                currentTime = new Date(currentTime.getTime() + 
                    (travelTimeMinutes + assignedTicket.estimatedTimeToComplete) * 60000);
            }
            availableStartTime = currentTime;
        }

        // Calculate travel details to the new ticket location
        const { distance, cost: travelCost } = agent.getDistanceAndTravelCost(ticket.location);
        const travelTimeMinutes = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;

        // Calculate completion time
        const completionTime = new Date(availableStartTime.getTime() + 
            (travelTimeMinutes + ticket.estimatedTimeToComplete) * 60000);

        // Check if ticket can be completed before due date
        if (completionTime > new Date(ticket.dueAt)) {
            continue;
        }

        // Calculate total cost
        const travelingCost = (travelTimeMinutes / 60) * agent.hourlyRate;
        const laborCost = (ticket.estimatedTimeToComplete / 60) * agent.hourlyRate;
        const totalCost = travelCost + travelingCost + laborCost;

        // Update best agent if this agent has lower cost
        if (totalCost < lowestCost) {
            lowestCost = totalCost;
            bestAgent = agent;
        }
    }

    if (!bestAgent) {
        throw new Error("No agent can complete the ticket before its due date");
    }

    // Assign ticket to the best agent
    ticket.assignTo(bestAgent);
    const updatedTickets = [...bestAgent.getAssignedTickets(), ticket];
    bestAgent.setAssignedTickets(updatedTickets);

    return bestAgent;
}

module.exports = { Agent, Ticket, Location, assignTicketToAgent };