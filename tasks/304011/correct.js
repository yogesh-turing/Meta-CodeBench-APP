const fs = require('fs').promises;
const path = require('path');

async function csvToJson(filePath, config) {
    if (!config || typeof config !== 'object') {
        throw new Error('Invalid configuration');
    }

    if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path');
    }

    const fullPath = path.resolve(filePath);

    try {
        const data = await fs.readFile(fullPath, 'utf8');
        return parseCSV(data, config);
    } catch (err) {
        throw new Error(`Error reading file: ${err.message}`);
    }
}

function parseCSV(data, config) {
    const lines = data.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('Invalid CSV format');
    }

    const headers = lines[0].split(',').map(header => header.trim());
    if (headers.length !== Object.keys(config).length) {
        throw new Error('Invalid configuration: header length mismatch');
    }

    return lines.slice(1).map(line => transformRow(line, headers, config)).filter(Boolean);
}

function transformRow(line, headers, config) {
    const values = line.split(',').map(value => value.trim());
    if (values.length !== headers.length) {
        return null; // Skip malformed rows
    }

    return headers.reduce((obj, key, index) => {
        obj[key] = formatValue(values[index], config[key]);
        return obj;
    }, {});
}

function formatValue(value, config) {
    if (!config || !config.type) return value;

    switch (config.type) {
        case 'integer': return parseInt(value, 10) || 0;
        case 'decimal': return parseFloat(value) || 0.0;
        case 'boolean': return value.toLowerCase() === 'true';
        case 'date': return new Date(value).toISOString().split('T')[0]; // YYYY-MM-DD
        case 'datetime': return new Date(value).toISOString(); // Full ISO format
        case 'currency': return `${config.format || 'USD'} ${parseFloat(value).toFixed(2)}`;
        default: return value.toString();
    }
}

module.exports = {
    csvToJson
};
