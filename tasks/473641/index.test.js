const { createTicket } = require(process.env.TARGET_FILE);

jest.mock('crypto', () => ({
    randomBytes: jest.fn(() => Buffer.from('12345678901234567890123456789012'))
}));

describe('createTicket', () => {
    test('should create a ticket with valid data', () => {
        const ticket = {
            name: 'Task 1',
            start_date: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
            due_date: new Date(Date.now() + 172800000).toISOString() // 2 days in the future
        };
        const result = createTicket(ticket);
        expect(result._id.length > 0).toBe(true);
        delete result._id;
        expect(result.name).toBe(ticket.name);
        expect(new Date(result.start_date).getTime()).toBe(new Date(ticket.start_date).getTime());
        expect(new Date(result.due_date).getTime()).toBe(new Date(ticket.due_date).getTime());
    });

    test('should create a ticket with valid data and _id', () => {
      const ticket = {
          _id: '12345678901234567890123456789012',
          name: 'Task 1',
          start_date: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
          due_date: new Date(Date.now() + 172800000).toISOString() // 2 days in the future
      };
      const result = createTicket(ticket);
      expect(result._id.length > 0).toBe(true);
      expect(result._id).toBe(ticket._id);      
      expect(result.name).toBe(ticket.name);
      expect(new Date(result.start_date).getTime()).toBe(new Date(ticket.start_date).getTime());
      expect(new Date(result.due_date).getTime()).toBe(new Date(ticket.due_date).getTime());
  });

    test('should throw an error if the name is too short', () => {
        const ticket = {
            name: 'T',
            start_date: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
            due_date: new Date(Date.now() + 172800000).toISOString() // 2 days in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if the name is too long', () => {
        const ticket = {
            name: 'T'.repeat(101),
            start_date: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
            due_date: new Date(Date.now() + 172800000).toISOString() // 2 days in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if the name is missing', () => {
        const ticket = {
            start_date: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
            due_date: new Date(Date.now() + 172800000).toISOString() // 2 days in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if the name is null', () => {
        const ticket = {
            name: null,
            start_date: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
            due_date: new Date(Date.now() + 172800000).toISOString() // 2 days in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if the start date is not in the future', () => {
        const ticket = {
            name: 'Task 1',
            start_date: new Date(Date.now() - 86400000).toISOString(), // 1 day in the past
            due_date: new Date(Date.now() + 172800000).toISOString() // 2 days in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if the due date is not in the future', () => {
        const ticket = {
            name: 'Task 1',
            start_date: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
            due_date: new Date(Date.now() - 86400000).toISOString() // 1 day in the past
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if only start date is provided', () => {
        const ticket = {
            name: 'Task 1',
            start_date: new Date(Date.now() + 86400000).toISOString() // 1 day in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if only due date is provided', () => {
        const ticket = {
            name: 'Task 1',
            due_date: new Date(Date.now() + 86400000).toISOString() // 1 day in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if due date is before start date', () => {
        const ticket = {
            name: 'Task 1',
            start_date: new Date(Date.now() + 172800000).toISOString(), // 2 days in the future
            due_date: new Date(Date.now() + 86400000).toISOString() // 1 day in the future
        };
        expect(() => createTicket(ticket)).toThrow(Error);
    });

    test('should throw an error if ticket is not provided', () => {
        expect(() => createTicket()).toThrow(Error);
    });
});