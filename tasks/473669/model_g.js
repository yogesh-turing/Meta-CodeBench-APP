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

        const [, timestamp, path, statusCode, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            path,
            statusCode: parseInt(statusCode),
            responseTime: parseInt(responseTime),
        };
    }).filter(Boolean);

    // Calculate top 3 slowest endpoints by average response time.
    const endpointResponseTimes = {};
    logs.forEach(log => {
        if (!endpointResponseTimes[log.path]) {
            endpointResponseTimes[log.path] = [];
        }
        endpointResponseTimes[log.path].push(log.responseTime);
    });
    const slowestEndpoints = Object.keys(endpointResponseTimes)
        .map(path => ({
            path,
            avgResponseTime: Math.round(endpointResponseTimes[path].reduce((a, b) => a + b, 0) / endpointResponseTimes[path].length),
        }))
        .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
        .slice(0, 3);

    // Aggregate hourly request counts.
    const hourlyRequestCounts = {};
    logs.forEach(log => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        if (!hourlyRequestCounts[hour]) {
            hourlyRequestCounts[hour] = 0;
        }
        hourlyRequestCounts[hour]++;
    });

    // Detect anomalous patterns as described.
    const anomalies = logs
        .filter(log => log.statusCode === 500 && log.responseTime > 250)
        .map(log => ({
            path: log.path,
            avgResponseTime: log.responseTime,
        }));

    // Create response time histogram.
    const histogram = {};
    logs.forEach(log => {
        const bucket = `${Math.floor(log.responseTime / 100) * 100}-${Math.floor(log.responseTime / 100) * 100 + 100}`;
        if (!histogram[bucket]) {
            histogram[bucket] = 0;
        }
        histogram[bucket]++;
    });

    return {
        slowestEndpoints,
        hourlyRequestCounts,
        anomalies,
        histogram,
    };
}

module.exports = { analyzeLogs };