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
        const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] "(\w+) (.+)" (\d{3}) (\d+)ms$/);
        if (!match) return null;
        const [, timestamp, method, path, statusCode, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            method,
            path,
            statusCode: parseInt(statusCode),
            responseTime: parseInt(responseTime),
        };
    }).filter(Boolean);

    // Group logs by endpoint
    const endpointLogs = logs.reduce((acc, log) => {
        if (!acc[log.path]) acc[log.path] = [];
        acc[log.path].push(log);
        return acc;
    }, {});

    // Calculate average response times for each endpoint
    const endpointAvgResponseTimes = Object.keys(endpointLogs).map(path => {
        const logs = endpointLogs[path];
        const sumResponseTime = logs.reduce((acc, log) => acc + log.responseTime, 0);
        const avgResponseTime = sumResponseTime / logs.length;
        return { path, avgResponseTime };
    });

    // Sort endpoints by average response time and take top 3
    const slowestEndpoints = endpointAvgResponseTimes.sort((a, b) => b.avgResponseTime - a.avgResponseTime).slice(0, 3);

    // Group logs by hour
    const hourlyLogs = logs.reduce((acc, log) => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        if (!acc[hour]) acc[hour] = 0;
        acc[hour]++;
        return acc;
    }, {});

    // Detect anomalies
    const anomalies = endpointAvgResponseTimes.filter(({ path, avgResponseTime }) => {
        const logs = endpointLogs[path];
        const errorLogs = logs.filter(log => log.statusCode >= 500);
        return errorLogs.length > 0 && avgResponseTime > 250;
    });

    // Create response time histogram
    const histogram = logs.reduce((acc, log) => {
        const bucket = Math.floor(log.responseTime / 100) * 100 + '-' + (Math.floor(log.responseTime / 100) + 1) * 100;
        if (!acc[bucket]) acc[bucket] = 0;
        acc[bucket]++;
        return acc;
    }, {});

    return {
        slowestEndpoints,
        hourlyRequestCounts: hourlyLogs,
        anomalies,
        histogram,
    };
}

module.exports = { analyzeLogs };