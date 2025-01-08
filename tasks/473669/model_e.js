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
    const logRegex = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] "GET ([^"]+)" (\d{3}) (\d+)ms/;
    
    const logs = lines.map(line => {
        const match = line.match(logRegex);
        if (!match) return null;
        
        const [, timestamp, path, statusCode, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            path,
            statusCode: parseInt(statusCode),
            responseTime: parseInt(responseTime)
        };
    }).filter(Boolean);

    // Calculate average response times per endpoint
    const endpointStats = logs.reduce((acc, log) => {
        if (!acc[log.path]) {
            acc[log.path] = { total: 0, count: 0, sum: 0 };
        }
        acc[log.path].count++;
        acc[log.path].sum += log.responseTime;
        acc[log.path].total = Math.round(acc[log.path].sum / acc[log.path].count);
        return acc;
    }, {});

    // Get top 3 slowest endpoints
    const slowestEndpoints = Object.entries(endpointStats)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: stats.total
        }))
        .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
        .slice(0, 3);

    // Calculate hourly request counts
    const hourlyRequestCounts = logs.reduce((acc, log) => {
        const hourKey = format(log.timestamp, 'yyyy-MM-dd HH');
        acc[hourKey] = (acc[hourKey] || 0) + 1;
        return acc;
    }, {});

    // Find anomalies (500 status and avg response time > 250ms)
    const anomalyStats = logs
        .filter(log => log.statusCode === 500)
        .reduce((acc, log) => {
            if (!acc[log.path]) {
                acc[log.path] = { count: 0, sum: 0 };
            }
            acc[log.path].count++;
            acc[log.path].sum += log.responseTime;
            return acc;
        }, {});

    const anomalies = Object.entries(anomalyStats)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.sum / stats.count)
        }))
        .filter(anomaly => anomaly.avgResponseTime > 250);

    // Create response time histogram
    const histogram = logs.reduce((acc, log) => {
        const bucket = Math.floor(log.responseTime / 100) * 100;
        const bucketKey = `${bucket}-${bucket + 99}`;
        acc[bucketKey] = (acc[bucketKey] || 0) + 1;
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