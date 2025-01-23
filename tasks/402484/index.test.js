const { processUsers } = require(process.env.TARGET_FILE);

describe('processUsers', () => {
    const users = [
        { id: 1, email: 'user1@example.com', isActive: true },
        { id: 2, email: 'user2@example.com', isActive: false },
        { id: 3, email: 'user3@example.com', isActive: true },
        { id: 4, email: 'user1@example.com', isActive: true },
    ];

    const fetchUserMetadata = jest.fn(async (id) => {
        return { metadata: `metadata for user ${id}` };
    });

    test('should filter active users', async () => {
        const result = await processUsers(users, 2, fetchUserMetadata);
        expect(result.length).toBe(1);
        expect(result[0].length).toBe(2);
        expect(result[0][0].email).toBe('user1@example.com');
        expect(result[0][1].email).toBe('user3@example.com');
    });

    test('should remove duplicate users based on email', async () => {
        const result = await processUsers(users, 2, fetchUserMetadata);
        expect(result[0].length).toBe(2);
        expect(result[0][0].email).toBe('user1@example.com');
        expect(result[0][1].email).toBe('user3@example.com');
    });

    test('should paginate results', async () => {
        const result = await processUsers(users, 1, fetchUserMetadata);
        expect(result.length).toBe(2);
        expect(result[0].length).toBe(1);
        expect(result[1].length).toBe(1);
    });

    test('should fetch additional metadata for each user', async () => {
        const result = await processUsers(users, 2, fetchUserMetadata);
        expect(result[0][0].metadata).toEqual({ metadata: 'metadata for user 1' });
        expect(result[0][1].metadata).toEqual({ metadata: 'metadata for user 3' });
    });

    test('should handle empty users', async () => {
        const result = await processUsers([], 2, fetchUserMetadata);
        expect(result).toEqual([]);
    });

    test('should handle empty fetchUserMetadata', async () => {
        const result = await processUsers(users, 2, async () => {});
        expect(result[0][0].metadata).toBeUndefined();
    });

    test('should handle empty pageSize', async () => {
        const result = await processUsers(users, 0, fetchUserMetadata);
        expect(result).toEqual([]);
    });

    test('should handle empty users and fetchUserMetadata', async () => {
        const result = await processUsers([], 2, async () => {});
        expect(result).toEqual([]);
    });

    test('should handle large dataset', async () => {
        const users = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            email: `john+${i}@example.com`,
            isActive: i % 2 === 0,
        }));

        let result = await processUsers(users, 10, fetchUserMetadata);
        expect(result.length).toBe(50);
        expect(result[0].length).toBe(10);

        result = await processUsers(users, 100, fetchUserMetadata);
        expect(result.length).toBe(5);
        expect(result[0].length).toBe(100);
    });
});