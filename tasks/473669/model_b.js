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

        const [_, timestamp, path, statusCode, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            path,
            statusCode: parseInt(statusCode),
            responseTime: parseInt(responseTime)
        };
    }).filter(Boolean);

    // Calculate endpoint statistics
    const endpointStats = {};
    const hourlyStats = {};
    const histogram = {};

    logs.forEach(log => {
        // Endpoint statistics
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
        if (log.statusCode === 500) {
            endpointStats[log.path].errorCount += 1;
            endpointStats[log.path].totalErrorTime += log.responseTime;
        }

        // Hourly request counts
        const hourKey = format(log.timestamp, 'yyyy-MM-dd HH');
        hourlyStats[hourKey] = (hourlyStats[hourKey] || 0) + 1;

        // Response time histogram
        const bucketKey = `${Math.floor(log.responseTime / 100) * 100}-${Math.floor(log.responseTime / 100) * 100 + 99}`;
        histogram[bucketKey] = (histogram[bucketKey] || 0) + 1;
    });

    // Calculate slowest endpoints
    const slowestEndpoints = Object.entries(endpointStats)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.totalTime / stats.count)
        }))
        .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
        .slice(0, 3);

    // Calculate anomalies
    const anomalies = Object.entries(endpointStats)
        .filter(([_, stats]) => stats.errorCount > 0)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.totalErrorTime / stats.errorCount)
        }))
        .filter(anomaly => anomaly.avgResponseTime > 250);

    // Sort histogram keys numerically
    const sortedHistogram = Object.fromEntries(
        Object.entries(histogram)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    );

    return {
        slowestEndpoints,
        hourlyRequestCounts: hourlyStats,
        anomalies,
        histogram: sortedHistogram
    };
}

module.exports = { analyzeLogs };