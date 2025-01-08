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
        const match = line.match(/^\[(.*?)\] "(.*?)" (\d+) (\d+)ms$/);
        if (!match) return null;

        const [timestamp, methodAndPath, statusCode, responseTime] = match.slice(1);

        return {
            timestamp: parseISO(timestamp),
            method: methodAndPath.split(' ')[0],
            path: methodAndPath.split(' ')[1],
            statusCode: parseInt(statusCode, 10),
            responseTime: parseInt(responseTime, 10),
        };
    }).filter(Boolean);

    // Group logs by path for average response time calculations
    const pathGroups = logs.reduce((acc, log) => {
        if (!acc[log.path]) acc[log.path] = [];
        acc[log.path].push(log);
        return acc;
    }, {});

    // Calculate average response times for each path
    const pathResponseTimes = Object.keys(pathGroups).map(path => {
        const group = pathGroups[path];
        const sum = group.reduce((acc, log) => acc + log.responseTime, 0);
        return {
            path,
            avgResponseTime: Math.round(sum / group.length),
        };
    });

    // Sort paths by average response time in descending order
    const sortedPaths = pathResponseTimes.sort((a, b) => b.avgResponseTime - a.avgResponseTime);

    // Select top 3 slowest endpoints
    const slowestEndpoints = sortedPaths.slice(0, 3);

    // Aggregate hourly request counts
    const hourlyRequestCounts = logs.reduce((acc, log) => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        if (!acc[hour]) acc[hour] = 0;
        acc[hour]++;
        return acc;
    }, {});

    // Detect anomalies (500 response code and average response time above 250ms)
    const anomalies = sortedPaths.filter(({ path, avgResponseTime }) => {
        const group = pathGroups[path];
        return group.some(log => log.statusCode === 500) && avgResponseTime > 250;
    });

    // Create response time histogram
    const histogram = logs.reduce((acc, log) => {
        const bucket = `${Math.floor(log.responseTime / 100) * 100}-${(Math.floor(log.responseTime / 100) + 1) * 100 - 1}`;
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