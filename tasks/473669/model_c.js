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
    const logRegex = /\[(.*?)\] "GET (.*?)" (\d{3}) (\d+)ms/;
    const logs = lines.map(line => {
        const match = line.match(logRegex);
        if (!match) return null;

        const [, timestamp, path, status, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            path,
            status: parseInt(status),
            responseTime: parseInt(responseTime)
        };
    }).filter(Boolean);

    // Calculate slowest endpoints
    const endpointStats = {};
    logs.forEach(log => {
        if (!endpointStats[log.path]) {
            endpointStats[log.path] = {
                totalTime: 0,
                count: 0,
                errorCount: 0,
                totalErrorTime: 0
            };
        }
        endpointStats[log.path].totalTime += log.responseTime;
        endpointStats[log.path].count += 1;
        if (log.status === 500) {
            endpointStats[log.path].errorCount += 1;
            endpointStats[log.path].totalErrorTime += log.responseTime;
        }
    });

    const slowestEndpoints = Object.entries(endpointStats)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.totalTime / stats.count)
        }))
        .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
        .slice(0, 3);

    // Calculate hourly request counts
    const hourlyRequestCounts = {};
    logs.forEach(log => {
        const hourKey = format(log.timestamp, 'yyyy-MM-dd HH');
        hourlyRequestCounts[hourKey] = (hourlyRequestCounts[hourKey] || 0) + 1;
    });

    // Detect anomalies (500 status and avg response time > 250ms)
    const anomalies = Object.entries(endpointStats)
        .filter(([, stats]) => stats.errorCount > 0 && 
            (stats.totalErrorTime / stats.errorCount) > 250)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.totalErrorTime / stats.errorCount)
        }));

    // Create response time histogram
    const histogram = {};
    logs.forEach(log => {
        const bucket = Math.floor(log.responseTime / 100) * 100;
        const bucketKey = `${bucket}-${bucket + 99}`;
        histogram[bucketKey] = (histogram[bucketKey] || 0) + 1;
    });

    return {
        slowestEndpoints,
        hourlyRequestCounts,
        anomalies,
        histogram
    };
}

module.exports = { analyzeLogs };