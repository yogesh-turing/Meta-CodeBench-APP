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
    const logRegex = /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] "GET ([^"]+)" (\d{3}) (\d+)ms$/;
    
    const logs = lines.map(line => {
        const match = line.match(logRegex);
        if (!match) return null;
        
        const [, timestamp, path, status, responseTime] = match;
        const responseTimeNum = parseInt(responseTime, 10);
        
        // Validate response time
        if (responseTimeNum > 5000) return null;
        
        return {
            timestamp: parseISO(timestamp),
            path,
            status: parseInt(status, 10),
            responseTime: responseTimeNum
        };
    }).filter(Boolean);

    // Calculate average response times per endpoint
    const endpointStats = {};
    logs.forEach(log => {
        if (!endpointStats[log.path]) {
            endpointStats[log.path] = { total: 0, count: 0, sum: 0 };
        }
        endpointStats[log.path].count++;
        endpointStats[log.path].sum += log.responseTime;
    });

    // Calculate slowest endpoints
    const slowestEndpoints = Object.entries(endpointStats)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.sum / stats.count)
        }))
        .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
        .slice(0, 3);

    // Calculate hourly request counts
    const hourlyRequestCounts = {};
    logs.forEach(log => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        hourlyRequestCounts[hour] = (hourlyRequestCounts[hour] || 0) + 1;
    });

    // Calculate anomalies (500 status and avg response time > 250ms)
    const errorEndpoints = {};
    logs.forEach(log => {
        if (log.status === 500) {
            if (!errorEndpoints[log.path]) {
                errorEndpoints[log.path] = { count: 0, sum: 0 };
            }
            errorEndpoints[log.path].count++;
            errorEndpoints[log.path].sum += log.responseTime;
        }
    });

    const anomalies = Object.entries(errorEndpoints)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.sum / stats.count)
        }))
        .filter(entry => entry.avgResponseTime > 250);

    // Create response time histogram
    const histogram = {};
    logs.forEach(log => {
        const bucket = Math.floor(log.responseTime / 100) * 100;
        const bucketKey = `${bucket}-${bucket + 99}`;
        histogram[bucketKey] = (histogram[bucketKey] || 0) + 1;
    });

    // Sort histogram keys numerically
    const sortedHistogram = Object.fromEntries(
        Object.entries(histogram)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    );

    return {
        slowestEndpoints,
        hourlyRequestCounts,
        anomalies,
        histogram: sortedHistogram
    };
}

module.exports = { analyzeLogs };