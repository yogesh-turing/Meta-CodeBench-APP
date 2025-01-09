const { filterAndTransformRequests } = require('./model_a');
const moment = require('moment');

describe('filterAndTransformRequests', () => {
    it('should filter and transform requests correctly', () => {
        const requests = [
            {
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                user: { isActive: true },
                ticket: { name: 'Test Ticket', priority: 2, source: 'Email' }
            },
            {
                created_datetime: moment().subtract(3, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                user: { isActive: true },
                ticket: { name: 'Old Ticket', priority: 1, source: 'Chat' }
            },
            {
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@other.com' },
                user: { isActive: true },
                ticket: { name: 'Other Ticket', priority: 3, source: 'Phone' }
            },
            {
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                user: { isActive: false },
                ticket: { name: 'Inactive User Ticket', priority: 1, source: 'Email' }
            }
        ];

        const expectedOutput = [
            {
                name: 'TEST TICKET',
                due_at: moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
                created_at: moment(requests[0].created_datetime).format('YYYY-MM-DD HH:mm:ss'),
                assignee: 'user@turing.com',
                source: 'email'
            }
        ];

        const result = filterAndTransformRequests(requests);
        expect(result).toEqual(expectedOutput);
    });

    it('should return an empty array if no requests match the criteria', () => {
        const requests = [
            {
                created_datetime: moment().subtract(3, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                user: { isActive: true },
                ticket: { name: 'Old Ticket', priority: 1, source: 'Chat' }
            },
            {
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@other.com' },
                user: { isActive: true },
                ticket: { name: 'Other Ticket', priority: 3, source: 'Phone' }
            },
            {
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                user: { isActive: false },
                ticket: { name: 'Inactive User Ticket', priority: 1, source: 'Email' }
            }
        ];

        const result = filterAndTransformRequests(requests);
        expect(result).toEqual([]);
    });
});