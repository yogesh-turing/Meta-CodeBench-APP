const fs = require('fs').promises;
const { parseISO, format } = require('date-fns');

/**
 * Analyzes server logs and generates a performance summary.
 * @param {string} filePath - Path to the log file.
 * @returns {Promise<object>} - Performance summary.
 */
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
    const logs = lines
        .map(line => {
            const match = line.match(/\[(.+)\] "GET (.+)" (\d+) (\d+)ms/);
            if (!match) return null;
            const [_, timestamp, path, status, responseTime] = match;
            return {
                timestamp: parseISO(timestamp),
                path,
                status: parseInt(status, 10),
                responseTime: parseInt(responseTime, 10),
            };
        })
        .filter(Boolean);

    // Group logs by path for performance analysis
    const logsByPath = logs.reduce((acc, log) => {
        if (!acc[log.path]) {
            acc[log.path] = [];
        }
        acc[log.path].push(log);
        return acc;
    }, {});

    // 1. Calculate top 3 slowest endpoints by average response time
    const slowestEndpoints = Object.keys(logsByPath)
        .map(path => {
            const entries = logsByPath[path];
            const avgResponseTime = Math.round(entries.reduce((sum, log) => sum + log.responseTime, 0) / entries.length);
            return { path, avgResponseTime };
        })
        .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
        .slice(0, 3);

    // 2. Aggregate hourly request counts
    const hourlyRequestCounts = logs.reduce((acc, log) => {
        const hour = format(log.timestamp, 'yyyy-MM-dd HH');
        if (!acc[hour]) {
            acc[hour] = 0;
        }
        acc[hour]++;
        return acc;
    }, {});

    // 3. Detect anomalous patterns
    const anomalies = Object.keys(logsByPath)
        .map(path => {
            const entries = logsByPath[path];
            const avgResponseTime = entries.reduce((sum, log) => sum + log.responseTime, 0) / entries.length;
            const hasAnomaly = entries.some(log => log.status === 500 && avgResponseTime > 250);
            if (hasAnomaly) {
                return { path, avgResponseTime: Math.round(avgResponseTime) };
            }
            return null;
        })
        .filter(Boolean);

    // 4. Generate response time histogram
    const histogram = logs.reduce((acc, log) => {
        const bucket = Math.round(log.responseTime / 100) * 100;
        let start = bucket - 99;
        if (start < 100) start = 0;
        const bucketLabel = `${start}-${bucket}`;
        if (!acc[bucketLabel]) {
            acc[bucketLabel] = 0;
        }
        acc[bucketLabel]++;
        return acc;
    }, {});

    // Return the result
    return {
        slowestEndpoints,
        hourlyRequestCounts,
        anomalies,
        histogram 
    };
}

module.exports = { analyzeLogs };