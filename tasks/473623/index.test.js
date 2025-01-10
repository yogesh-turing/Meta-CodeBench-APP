const { filterAndTransformRequests } = require('./correct');
const moment = require('moment');

describe('filterAndTransformRequests', () => {
    test('should throw an error if requests is not an array of objects', () => {
        expect(() => filterAndTransformRequests(null)).toThrow(Error);
        expect(() => filterAndTransformRequests([1, 2, 3])).toThrow(Error);
    });

    test('should filter and transform requests correctly', () => {
        const requests = [
            {
                user: { isActive: true },
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                ticket: { name: 'Test Ticket', priority: 2, source: 'System' }
            },
            {
                user: { isActive: false },
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                ticket: { name: 'Inactive User Ticket', priority: 1, source: 'System' }
            },
            {
                user: { isActive: true },
                created_datetime: moment().subtract(3, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                ticket: { name: 'Old Ticket', priority: 1, source: 'System' }
            },
            {
                user: { isActive: true },
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@other.com' },
                ticket: { name: 'Other Domain Ticket', priority: 1, source: 'System' }
            }
        ];

        const result = filterAndTransformRequests(requests);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('TEST TICKET');
        expect(result[0].due_at).toBe(moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss'));
        expect(result[0].created_at).toBe(moment(requests[0].created_datetime).format('YYYY-MM-DD HH:mm:ss'));
        expect(result[0].assignee).toBe('user@turing.com');
        expect(result[0].source).toBe('system');
        expect(result[0].processed_at).toBe(moment().format('YYYY-MM-DD HH:mm:ss'));
    });

    test('should set fields to null if the corresponding value is not present in the request', () => {
        const requests = [
            {
                user: { isActive: true },
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' },
                ticket: { priority: 2 }
            }
        ];

        const result = filterAndTransformRequests(requests);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe(null);
        expect(result[0].due_at).toBe(moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss'));
        expect(result[0].created_at).toBe(moment(requests[0].created_datetime).format('YYYY-MM-DD HH:mm:ss'));
        expect(result[0].assignee).toBe('user@turing.com');
        expect(result[0].source).toBe(null);
        expect(result[0].processed_at).toBe(moment().format('YYYY-MM-DD HH:mm:ss'));
    });

    test('should handle missing fields in the request gracefully', () => {
        const requests = [
            {
                user: { isActive: true },
                created_datetime: moment().subtract(1, 'minutes').toISOString(),
                assignee: { email: 'user@turing.com' }
            }
        ];
        const result = filterAndTransformRequests(requests);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe(null);
        expect(result[0].due_at).toBe(null);
        expect(result[0].created_at).toBe(moment(requests[0].created_datetime).format('YYYY-MM-DD HH:mm:ss'));
        expect(result[0].assignee).toBe('user@turing.com');
        expect(result[0].source).toBe(null);
        expect(result[0].processed_at).toBe(moment().format('YYYY-MM-DD HH:mm:ss'));
    });
});