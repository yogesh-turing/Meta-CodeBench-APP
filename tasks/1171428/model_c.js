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
        const assignedTickets = agent.getAssignedTickets();
        let startLocation = agent.location;
        let availableStartTime = new Date();

        // Calculate total time needed for assigned tickets
        for (const assignedTicket of assignedTickets) {
            const { distance } = agent.getDistanceAndTravelCost(assignedTicket.location);
            const travelTimeMinutes = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
            availableStartTime = new Date(availableStartTime.getTime() + 
                (travelTimeMinutes + assignedTicket.estimatedTimeToComplete) * 60000);
            startLocation = assignedTicket.location;
        }

        // Calculate time needed for new ticket
        const { distance, cost: travelCost } = agent.getDistanceAndTravelCost.call(
            { location: startLocation },
            ticket.location
        );
        const travelTimeMinutes = (distance / 1000) * TRAVEL_TIME_PER_KM_IN_MINUTES;
        const totalTimeNeeded = travelTimeMinutes + ticket.estimatedTimeToComplete;
        
        // Calculate completion time
        const completionTime = new Date(availableStartTime.getTime() + totalTimeNeeded * 60000);
        
        // Check if ticket can be completed before due date
        if (completionTime <= new Date(ticket.dueAt)) {
            // Calculate total cost
            const laborCost = (totalTimeNeeded / 60) * agent.hourlyRate; // Convert minutes to hours
            const travelLaborCost = (travelTimeMinutes / 60) * agent.hourlyRate;
            const totalCost = travelCost + laborCost + travelLaborCost;

            eligibleAgents.push({
                agent,
                totalCost,
                completionTime
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