const { Agent, Ticket, Location, assignTicketToAgent } = require('./model_e');

const TEN_HOURS = 10 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

describe('Location', () => {
    it('should create a Location instance', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        expect(location.id).toBe(1);
        expect(location.name).toBe('Test Location');
        expect(location.latitude).toBe(10);
        expect(location.longitude).toBe(20);
    });
});

describe('Agent', () => {
    it('should create an Agent instance', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const agent = new Agent(1, 'Test Agent', location, 50);
        expect(agent.id).toBe(1);
        expect(agent.name).toBe('Test Agent');
        expect(agent.location).toBe(location);
        expect(agent.hourlyRate).toBe(50);
    });

    it('should calculate distance and travel cost', () => {
        const location1 = new Location(1, 'Location 1', 10, 20);
        const location2 = new Location(2, 'Location 2', 30, 40);
        const agent = new Agent(1, 'Test Agent', location1, 50);
        const { distance, cost } = agent.getDistanceAndTravelCost(location2);
        expect(distance).toBeGreaterThan(0);
        expect(cost).toBeGreaterThan(0);
    });

    it('should set and get assigned tickets', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const agent = new Agent(1, 'Test Agent', location, 50);
        const tickets = [new Ticket(1, location, 2, new Date())];
        agent.setAssignedTickets(tickets);
        expect(agent.getAssignedTickets()).toBe(tickets);
    });
});

describe('Ticket', () => {
    it('should create a Ticket instance', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const ticket = new Ticket(1, location, 2, new Date());
        expect(ticket.id).toBe(1);
        expect(ticket.location).toBe(location);
        expect(ticket.estimatedTimeToComplete).toBe(2);
        expect(ticket.dueAt).toBeInstanceOf(Date);
    });

    it('should assign an agent to a ticket', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const agent = new Agent(1, 'Test Agent', location, 50);
        const ticket = new Ticket(1, location, 2, new Date());
        ticket.assignTo(agent);
        expect(ticket.agent).toBe(agent);
    });
});

describe('assignTicketToAgent', () => {
    it('should assign the best agent to a ticket', () => {
        const location1 = new Location(1, 'Location 1', 10, 20);
        const location2 = new Location(2, 'Location 2', 30, 40);
        const agent1 = new Agent(1, 'Agent 1', location1, 50);
        const agent2 = new Agent(2, 'Agent 2', location2, 40);
        const ticket = new Ticket(1, location1, 2, new Date(Date.now() + TEN_HOURS));
        assignTicketToAgent([agent1, agent2], ticket);
        expect(ticket.agent).toBe(agent1);
    });

    it('should throw an error if agents array is invalid', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const ticket = new Ticket(1, location, 2, new Date());
        expect(() => assignTicketToAgent(null, ticket)).toThrow(Error);
        expect(() => assignTicketToAgent([{}], ticket)).toThrow(Error);
    });

    it('should throw an error if ticket is invalid', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const agent = new Agent(1, 'Test Agent', location, 50);
        expect(() => assignTicketToAgent([agent], null)).toThrow(Error);
    });

    it('should throw an error if ticket is already assigned', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const agent = new Agent(1, 'Test Agent', location, 50);
        const ticket = new Ticket(1, location, 2, new Date());
        ticket.assignTo(agent);
        expect(() => assignTicketToAgent([agent], ticket)).toThrow(Error);
    });

    it('should throw an error if no agent is available to complete the ticket before due date', () => {
        const location = new Location(1, 'Test Location', 10, 20);
        const agent = new Agent(1, 'Test Agent', location, 50);
        const ticket = new Ticket(1, location, 2, new Date(Date.now() - TEN_HOURS));
        expect(() => assignTicketToAgent([agent], ticket)).toThrow(Error);
    });

    // test case for following scenario:
    // agent1 is closer to ticket location than agent2
    // agent1 has a higher hourly rate than agent2
    // agent2 has a lower hourly rate than agent1
    it('should assign the best agent to a ticket based on total cost', () => {
        const location1 = new Location(1, 'Location 1', 10, 20);
        const location2 = new Location(2, 'Location 2', 30, 40);
        const agent1 = new Agent(1, 'Agent 1', location1, 50);
        const agent2 = new Agent(2, 'Agent 2', location2, 40);
        const ticket = new Ticket(1, location1, 2, new Date(Date.now() + TEN_HOURS));
        assignTicketToAgent([agent1, agent2], ticket);
        expect(ticket.agent).toBe(agent1);
    });


    it('Scenario 1: should assign the best agent to a ticket based on total cost and time needed', () => {
        const location1 = new Location(1, 'Location 1', 10, 20);
        const location2 = new Location(2, 'Location 2', 30, 40);
        const agent1 = new Agent(1, 'Agent 1', location1, 50);
        const agent2 = new Agent(2, 'Agent 2', location2, 40);
        const ticket1 = new Ticket(1, location1, 2, new Date(Date.now() + ONE_HOUR));
        const ticket2 = new Ticket(2, location2, 2, new Date(Date.now() + ONE_HOUR));
        agent1.setAssignedTickets([ticket1]);
        assignTicketToAgent([agent1, agent2], ticket2);
        expect(ticket2.agent).toBe(agent2);
    });

    it('Scenario 2: should assign the best agent to a ticket based on total cost and time needed', () => {
        const location1 = new Location(1, 'Location 1', 10, 20);
        const location2 = new Location(2, 'Location 2', 30, 40);
        const agent1 = new Agent(1, 'Agent 1', location1, 50);
        const agent2 = new Agent(2, 'Agent 2', location2, 50);
        const ticket1 = new Ticket(1, location1, 2, new Date(Date.now() + ONE_HOUR));
        const ticket2 = new Ticket(2, location2, 2, new Date(Date.now() + ONE_HOUR));
        agent1.setAssignedTickets([ticket1]);
        agent2.setAssignedTickets([ticket2]);
        assignTicketToAgent([agent1, agent2], ticket2);
        expect(ticket2.agent).toBe(agent2);
    });

    it('Scenario 3: should assign the best agent to a ticket based on total cost and time needed', () => {
        const location1 = new Location(1, 'Location 1', 10, 20);
        const location2 = new Location(2, 'Location 2', 10.1, 20); // distance is 1 km
        const agent1 = new Agent(1, 'Agent 1', location1, 10);
        const agent2 = new Agent(2, 'Agent 2', location2, 5000);
        const ticket1 = new Ticket(1, location1, 2, new Date(Date.now() + ONE_HOUR));
        const ticket2 = new Ticket(2, location2, 2, new Date(Date.now() + TEN_HOURS));
        agent1.setAssignedTickets([ticket1]);
        assignTicketToAgent([agent1, agent2], ticket2);
        expect(ticket2.agent).toBe(agent1);
    });
});