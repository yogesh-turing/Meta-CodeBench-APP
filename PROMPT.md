Base Code:

```javascript
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
        // TODO: Implement log parsing logic
    }).filter(Boolean);

    // To Do: Implement the following logic:
    // Calculate top 3 slowest endpoints by average response time.
    // Aggregate hourly request counts.
    // Detect anomalous patterns as described.

    // Sample return structure
    return {
        slowestEndpoints: [], // To be implemented
        hourlyRequestCounts: {}, // To be implemented
        anomalies: [], // To be implemented
    };
}

module.exports = { analyzeLogs };
```
Prompt:

Please complete the function `analyzeLogs`,
1. Implement the log parsing logic:
    - The line in the log file follows the following format
        [YYYY-MM-DD HH:mm:ss] "GET /path/to/resource" 200 123ms
        e.g.
        [2025-01-01 12:00:00] "GET /api/users" 200 150ms
        [2025-01-01 12:01:00] "GET /api/orders" 500 300ms
        [2025-01-01 12:02:00] "GET /api/users" 200 90ms
    - If line is not in expected format ignore the line
2. Implement logic to analyze logs:
    - The function should return an object with the following details
        - slowestEndpoints (top three slowest endpoints): An array of paths with the highest average response times.
        - hourlyRequestCounts (hourly request count): An object where keys are hours (YYYY-MM-DD HH) and values are the total number of requests during that hour.
        - anomalies (anomalous patterns): paths with a 500 response code and an average response time above 250ms.
        - histogram (response time histogram): group all response times into buckets (e.g., 0-100ms, 101-200ms, etc.). There should be no limit on keys. 
    - Make sure the numbers are rounded to the nearest value.
    - Response should be in the following format:
        {
            "slowestEndpoints": [
                {
                    "path": "string", // The endpoint path
                    "avgResponseTime": "number", // The average response time in milliseconds
                },
            ],
            "hourlyRequestCounts": {
                "string": "number", // The hour (formatted as "YYYY-MM-DD HH") and the count of requests in that hour
            },
            "anomalies": [
                {
                    "path": "string", // The endpoint path
                    "avgResponseTime": "number", // The average response time in milliseconds
                },
            ],
            "histogram": {
                "0-100": "number",
                "101-200": "number",
                "201-300": "number",
                ...
            }
        }
    
