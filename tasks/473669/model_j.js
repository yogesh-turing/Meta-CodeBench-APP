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
        const [_, timestamp, method, path, statusCode, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            method,
            path,
            statusCode: parseInt(statusCode),
            responseTime: parseInt(responseTime),
        };
    }).filter(Boolean);

    // Calculate top 3 slowest endpoints by average response time
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

    // Aggregate hourly request counts
    const hourlyRequestCounts = {};
    logs.forEach(log => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        if (!hourlyRequestCounts[hour]) {
            hourlyRequestCounts[hour] = 0;
        }
        hourlyRequestCounts[hour]++;
    });

    // Detect anomalous patterns
    const anomalies = [];
    Object.keys(endpointResponseTimes).forEach(path => {
        const responseTimes = endpointResponseTimes[path];
        const avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
        if (avgResponseTime > 250 && logs.some(log => log.path === path && log.statusCode === 500)) {
            anomalies.push({
                path,
                avgResponseTime,
            });
        }
    });

    // Response time histogram
    const histogram = {};
    logs.forEach(log => {
        const responseTime = log.responseTime;
        const bucket = `${Math.floor(responseTime / 100) * 100}-${Math.floor(responseTime / 100) * 100 + 100}`;
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