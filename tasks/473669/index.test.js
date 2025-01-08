const fs = require('fs').promises;
const path = require('path');
const {analyzeLogs} = require(process.env.TARGET_FILE);

const testLogFilePath = path.join(__dirname, 'mockLogs.txt');

describe('analyzeLogs', () => {

    beforeEach(async () => {
        const sampleLogs = `
    [2025-01-01 12:00:00] "GET /api/users" 200 150ms
    [2025-01-01 12:01:00] "GET /api/orders" 500 300ms
    [2025-01-01 12:02:00] "GET /api/users" 200 90ms
    [2025-01-01 13:00:00] "GET /api/products" 200 200ms
    [2025-01-01 13:15:00] "GET /api/users" 200 100ms
    [2025-01-01 13:30:00] "GET /api/orders" 500 350ms
        `;
        await fs.writeFile(testLogFilePath, sampleLogs.trim());
    });
    
    afterEach(async () => {
        await fs.unlink(testLogFilePath);
    });

    // file path is empty or not provided
    it('should throw an error if file path is not provided', async () => {
        await expect(analyzeLogs()).rejects.toThrow(Error);
    });

    // file does not exist
    it('should throw an error if the file does not exist', async () => {
        await expect(analyzeLogs('nonexistent.log')).rejects.toThrow(Error);
    });

    it('should return the top 3 slowest endpoints by average response time', async () => {
        const result = await analyzeLogs(testLogFilePath);
        expect(result.slowestEndpoints).toEqual([
            { path: '/api/orders', avgResponseTime: 325 }, // Slower than /api/products and /api/users
            { path: '/api/products', avgResponseTime: 200 },
            { path: '/api/users', avgResponseTime: 113 }, // Rounded average
        ]);
    });

    it('should correctly calculate hourly request counts', async () => {
        const result = await analyzeLogs(testLogFilePath);
        expect(result.hourlyRequestCounts).toEqual({
            '2025-01-01 12': 3, // 3 requests in hour 12:00
            '2025-01-01 13': 3, // 3 requests in hour 13:00
        });
    });

    it('should correct calculate histograms', async () => {
        const result = await analyzeLogs(testLogFilePath);
        expect(result.histogram ).toEqual({
            "0-100": 2, // 2 requests with response time between 0 and 100ms
            "101-200": 2, // 2 requests with response time between 101 and 200ms
            "201-300": 1, // 1 request with response time between 201 and 300ms
            "301-400": 1, // 1 request with response time between 301 and 400ms
        });
    }); 


    it('should detect anomalies based on status code and average response time', async () => {
        const result = await analyzeLogs(testLogFilePath);
        expect(result.anomalies).toEqual([
            { path: '/api/orders', avgResponseTime: 325 }, // Meets both criteria: 500 status and avg > 250ms
        ]);
    });

    it('should handle an empty log file gracefully', async () => {
        await fs.writeFile(testLogFilePath, '');
        const result = await analyzeLogs(testLogFilePath);
        expect(result.slowestEndpoints).toEqual([]);
        expect(result.hourlyRequestCounts).toEqual({});
        expect(result.anomalies).toEqual([]);
    });

    it('should skip improperly formatted log lines', async () => {
        const badLogs = `
[2025-01-01 12:00:00] "GET /api/users" 200 150ms
INVALID LOG LINE
[2025-01-01 12:01:00] "GET /api/orders" 500 300ms
`;
        await fs.writeFile(testLogFilePath, badLogs.trim());
        const result = await analyzeLogs(testLogFilePath);
        expect(result.slowestEndpoints).toEqual([
            { path: '/api/orders', avgResponseTime: 300 },
            { path: '/api/users', avgResponseTime: 150 },
        ]);
        expect(result.hourlyRequestCounts).toEqual({
            '2025-01-01 12': 2,
        });
        expect(result.anomalies).toEqual([
            { path: '/api/orders', avgResponseTime: 300 },
        ]);
    });

});
