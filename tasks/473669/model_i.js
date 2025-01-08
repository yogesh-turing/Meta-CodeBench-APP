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
        const [_, timestamp, path, statusCode, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            path,
            statusCode: parseInt(statusCode),
            responseTime: parseInt(responseTime)
        };
    }).filter(Boolean);

    // Group logs by path to calculate average response times
    const pathGroups = logs.reduce((acc, log) => {
        if (!acc[log.path]) acc[log.path] = [];
        acc[log.path].push(log);
        return acc;
    }, {});

    // Calculate top 3 slowest endpoints by average response time
    const slowestEndpoints = Object.keys(pathGroups).map(path => {
        const group = pathGroups[path];
        const avgResponseTime = group.reduce((sum, log) => sum + log.responseTime, 0) / group.length;
        return { path, avgResponseTime };
    }).sort((a, b) => b.avgResponseTime - a.avgResponseTime).slice(0, 3);

    // Aggregate hourly request counts
    const hourlyRequestCounts = logs.reduce((acc, log) => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        if (!acc[hour]) acc[hour] = 0;
        acc[hour]++;
        return acc;
    }, {});

    // Detect anomalous patterns (500 status code and avg response time above 250ms)
    const anomalies = Object.keys(pathGroups).map(path => {
        const group = pathGroups[path];
        const avgResponseTime = group.reduce((sum, log) => sum + log.responseTime, 0) / group.length;
        if (group.some(log => log.statusCode === 500) && avgResponseTime > 250) {
            return { path, avgResponseTime };
        }
        return null;
    }).filter(Boolean);

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
        histogram
    };
}

module.exports = { analyzeLogs };