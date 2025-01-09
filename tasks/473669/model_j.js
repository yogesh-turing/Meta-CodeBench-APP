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
        const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})] "(GET|POST|PUT|DELETE) (.+)" (\d{3}) (\d+)ms$/);
        if (!match) return null;

        const timestamp = parseISO(match[1]);
        const hour = format(timestamp, 'yyyy-MM-dd HH');
        const method = match[2];
        const path = match[3];
        const status = parseInt(match[4]);
        const responseTime = parseInt(match[5]);

        return { timestamp, hour, method, path, status, responseTime };
    }).filter(Boolean);

    // Calculate top 3 slowest endpoints by average response time
    const endpointResponseTimes = {};
    logs.forEach(log => {
        if (!endpointResponseTimes[log.path]) {
            endpointResponseTimes[log.path] = [];
        }
        endpointResponseTimes[log.path].push(log.responseTime);
    });

    const slowestEndpoints = Object.keys(endpointResponseTimes).map(path => {
        const responseTimes = endpointResponseTimes[path];
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        return { path, avgResponseTime };
    }).sort((a, b) => b.avgResponseTime - a.avgResponseTime).slice(0, 3);

    // Aggregate hourly request counts
    const hourlyRequestCounts = {};
    logs.forEach(log => {
        if (!hourlyRequestCounts[log.hour]) {
            hourlyRequestCounts[log.hour] = 0;
        }
        hourlyRequestCounts[log.hour]++;
    });

    // Detect anomalous patterns
    const anomalies = logs.filter(log => log.status === 500 && log.responseTime > 250)
        .map(log => ({ path: log.path, avgResponseTime: log.responseTime }));

    // Response time histogram
    const histogram = {};
    logs.forEach(log => {
        const bucket = `${Math.floor(log.responseTime / 100) * 100}-${Math.floor(log.responseTime / 100) * 100 + 99}`;
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