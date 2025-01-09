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

  const logs = lines.map(line => {
    const regex = /\[(.*?)\] "(.*?)" (\d+) (\d+)ms/;
    const match = line.match(regex);
    if (!match) return null;

    const date = parseISO(match[1]);
    const path = match[2];
    const statusCode = parseInt(match[3]);
    const responseTime = parseInt(match[4]);

    return { date, path, statusCode, responseTime };
  }).filter(Boolean);

  const endpointResponseTimes = {};
  const hourlyRequestCounts = {};
  const anomalies = {};
  const histogram = {};

  logs.forEach(log => {
    const hour = format(log.date, 'yyyy-MM-dd HH');
    hourlyRequestCounts[hour] = (hourlyRequestCounts[hour] || 0) + 1;

    if (!endpointResponseTimes[log.path]) {
      endpointResponseTimes[log.path] = [];
    }
    endpointResponseTimes[log.path].push(log.responseTime);

    if (log.statusCode === 500 && log.responseTime > 250) {
      if (!anomalies[log.path]) {
        anomalies[log.path] = [];
      }
      anomalies[log.path].push(log.responseTime);
    }

    const bucket = `${Math.floor(log.responseTime / 100) * 100}-${Math.ceil(log.responseTime / 100) * 100}`;
    histogram[bucket] = (histogram[bucket] || 0) + 1;
  });

  const slowestEndpoints = Object.keys(endpointResponseTimes)
    .map(path => ({
      path,
      avgResponseTime: Math.round(endpointResponseTimes[path].reduce((sum, time) => sum + time, 0) / endpointResponseTimes[path].length),
    }))
    .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
    .slice(0, 3);

  const anomaliesList = Object.keys(anomalies)
    .map(path => ({
      path,
      avgResponseTime: Math.round(anomalies[path].reduce((sum, time) => sum + time, 0) / anomalies[path].length),
    }));

  return {
    slowestEndpoints,
    hourlyRequestCounts,
    anomalies: anomaliesList,
    histogram,
  };
}

module.exports = { analyzeLogs };