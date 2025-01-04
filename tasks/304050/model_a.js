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

    let eligibleAgents = [];

    for (const agent of agents) {
        let startLocation = agent.location;
        let availableStartTime = new Date();

        // Consider previously assigned tickets
        const assignedTickets = agent.getAssignedTickets();
        if (assignedTickets.length > 0) {
            const lastTicket = assignedTickets[assignedTickets.length - 1];
            startLocation = lastTicket.location;

            // Calculate when agent will be free after completing assigned tickets
            let currentTime = new Date();
            for (const assignedTicket of assignedTickets) {
                const { distance: distanceToTicket } = agent.getDistanceAndTravelCost(assignedTicket.location);
                const travelTimeMinutes = (distanceToTicket / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
                currentTime = new Date(currentTime.getTime() + (travelTimeMinutes + assignedTicket.estimatedTimeToComplete) * 60000);
            }
            availableStartTime = currentTime;
        }

        // Calculate travel details from start location to ticket location
        const { distance, cost: travelCost } = agent.getDistanceAndTravelCost.call(
            { location: startLocation },
            ticket.location
        );

        // Calculate travel time in minutes
        const travelTimeMinutes = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;

        // Calculate completion time
        const completionTime = new Date(availableStartTime.getTime() + 
            ((travelTimeMinutes + ticket.estimatedTimeToComplete) * 60000));

        // Check if ticket can be completed before due date
        if (completionTime <= new Date(ticket.dueAt)) {
            // Calculate total cost
            const laborCost = (travelTimeMinutes + ticket.estimatedTimeToComplete) * 
                (agent.hourlyRate / 60); // Convert hourly rate to per minute rate
            const totalCost = travelCost + laborCost;

            eligibleAgents.push({
                agent,
                totalCost
            });
        }
    }

    if (eligibleAgents.length === 0) {
        throw new Error("No agent can complete the ticket before its due date");
    }

    // Find agent with lowest total cost
    const selectedAgent = eligibleAgents.reduce((prev, current) => 
        prev.totalCost < current.totalCost ? prev : current
    );

    // Assign ticket to selected agent
    ticket.assignTo(selectedAgent.agent);
    const updatedTickets = [...selectedAgent.agent.getAssignedTickets(), ticket];
    selectedAgent.agent.setAssignedTickets(updatedTickets);

    return selectedAgent.agent;
}

module.exports = { Agent, Ticket, Location, assignTicketToAgent };
