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
        
        const [, timestamp, path, status, responseTime] = match;
        return {
            timestamp: parseISO(timestamp),
            path,
            status: parseInt(status),
            responseTime: parseInt(responseTime)
        };
    }).filter(Boolean);

    // Calculate path statistics
    const pathStats = {};
    logs.forEach(log => {
        if (!pathStats[log.path]) {
            pathStats[log.path] = {
                totalTime: 0,
                count: 0,
                error500Count: 0,
                error500TotalTime: 0
            };
        }
        pathStats[log.path].totalTime += log.responseTime;
        pathStats[log.path].count += 1;
        
        if (log.status === 500) {
            pathStats[log.path].error500Count += 1;
            pathStats[log.path].error500TotalTime += log.responseTime;
        }
    });

    // Calculate slowest endpoints
    const slowestEndpoints = Object.entries(pathStats)
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

    // Detect anomalies (500 errors with avg response time > 250ms)
    const anomalies = Object.entries(pathStats)
        .filter(([, stats]) => stats.error500Count > 0)
        .map(([path, stats]) => ({
            path,
            avgResponseTime: Math.round(stats.error500TotalTime / stats.error500Count)
        }))
        .filter(anomaly => anomaly.avgResponseTime > 250);

    // Create response time histogram
    const histogram = {};
    logs.forEach(log => {
        const bucketStart = Math.floor(log.responseTime / 100) * 100;
        const bucketKey = `${bucketStart}-${bucketStart + 99}`;
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