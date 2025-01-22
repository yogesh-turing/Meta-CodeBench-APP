const { bid, canExtend } = require(process.env.TARGET_FILE);

describe('bid', () => {
    let auction;
    let user;

    beforeEach(() => {
        auction = {
            endDate: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
            extensions: {
                count: 2,
                time: 5,
                extended_count: 0
            },
            bids: []
        };
        user = { id: 1, name: 'Test User' };
    });

    test('should close the auction if endDate is in the past', async () => {
        auction.endDate = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
        const result = await bid(auction, 100, user);
        expect(result.status).toBe('closed');
    });

    test('should extend the auction if it can be extended', async () => {
        auction.endDate = new Date(Date.now() + 30 * 1000); // 30 seconds from now
        const result = await bid(auction, 100, user);
        expect(result.endDate.getTime()).toBeGreaterThan(Date.now());
        expect(result.extensions.extended_count).toBe(1);
    });

    test('should not extend the auction if it cannot be extended', async () => {
        auction.extensions.count = 0;
        const result = await bid(auction, 100, user);
        expect(result.endDate.getTime()).toBeLessThanOrEqual(Date.now() + 10 * 60 * 1000);
        expect(result.extensions.extended_count).toBe(0);
    });

    test('should add a bid to the auction', async () => {
        const result = await bid(auction, 100, user);
        expect(result.bids.length).toBe(1);
        expect(result.bids[0].amount).toBe(100);
        expect(result.bids[0].createdBy).toBe(user);
    });

    test('should initialize bids array if it does not exist', async () => {
        delete auction.bids;
        const result = await bid(auction, 100, user);
        expect(result.bids).toBeDefined();
        expect(result.bids.length).toBe(1);
    });
});

describe('canExtend', () => {
    it('should return false if auction extensions count is 0', async () => {
        const auction = {
            extensions: {
                count: 0,
                extended_count: 0
            },
            endDate: new Date(Date.now() + 60000)
        };
        const now = new Date();
        const result = await canExtend(auction, now);
        expect(result).toBe(false);
    });

    it('should return false if auction is already extended to allowed number of times', async () => {
        const auction = {
            extensions: {
                count: 1,
                extended_count: 1
            },
            endDate: new Date(Date.now() + 60000)
        };
        const now = new Date();
        const result = await canExtend(auction, now);
        expect(result).toBe(false);
    });

    it('should return false if time left for auction end is more than one minute', async () => {
        const auction = {
            extensions: {
                count: 1,
                extended_count: 0
            },
            endDate: new Date(Date.now() + 5 * 60 * 1000)
        };
        const now = new Date();
        const result = await canExtend(auction, now);
        expect(result).toBe(false);
    });

    it('should return true if auction can be extended', async () => {
        const auction = {
            extensions: {
                count: 1,
                extended_count: 0
            },
            endDate: new Date(Date.now() + 30000)
        };
        const now = new Date();
        const result = await canExtend(auction, now);
        expect(result).toBe(true);
    });
});

