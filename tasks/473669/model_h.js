const fs = require('fs').promises;
const { parseISO, format } = require('date-fns');

async function analyzeLogs(filePath) {

    if (!filePath) throw new Error('File path is required');

    try {
        await fs.access(filePath);
    } catch (error) {
        throw new Error('File not found');
    }

    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.split('\n').filter(Boolean);

    // Parse log lines into structured objects
    const logs = lines.map(line => {
        // Log format: [YYYY-MM-DD HH:mm:ss] "GET /path/to/resource" 200 123ms
        const regex = /\[(.*?)\] "(.*?)" (\d+) (\d+)ms/;
        const match = line.match(regex);
        if (!match) return null; // Ignore lines not in expected format

        const [_, timestamp, path, statusCode, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            path,
            statusCode: parseInt(statusCode),
            responseTime: parseInt(responseTime),
        };
    }).filter(Boolean);

    // Group logs by path for calculating average response times
    const pathGroups = logs.reduce((acc, log) => {
        if (!acc[log.path]) acc[log.path] = [];
        acc[log.path].push(log);
        return acc;
    }, {});

    // Calculate average response time for each path
    const pathAverages = Object.keys(pathGroups).map(path => {
        const group = pathGroups[path];
        const sum = group.reduce((acc, log) => acc + log.responseTime, 0);
        const avgResponseTime = Math.round(sum / group.length);
        return { path, avgResponseTime };
    });

    // Find top 3 slowest endpoints
    const slowestEndpoints = pathAverages.sort((a, b) => b.avgResponseTime - a.avgResponseTime).slice(0, 3);

    // Aggregate hourly request counts
    const hourlyRequestCounts = logs.reduce((acc, log) => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        if (!acc[hour]) acc[hour] = 0;
        acc[hour]++;
        return acc;
    }, {});

    // Detect anomalous patterns (500 status code and avg response time above 250ms)
    const anomalies = pathAverages.filter(({ path, avgResponseTime }) => {
        const group = pathGroups[path];
        const has500Error = group.some(log => log.statusCode === 500);
        return has500Error && avgResponseTime > 250;
    });

    // Create response time histogram
    const histogram = logs.reduce((acc, log) => {
        const bucket = `${Math.floor(log.responseTime / 100) * 100}-${Math.ceil(log.responseTime / 100) * 100}`;
        if (!acc[bucket]) acc[bucket] = 0;
        acc[bucket]++;
        return acc;
    }, {});

    return {
        slowestEndpoints,
        hourlyRequestCounts,
        anomalies,
        histogram,
    };
}

module.exports = { analyzeLogs };