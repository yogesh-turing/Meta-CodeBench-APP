const fs = require('fs').promises;
const path = require('path');

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

const formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        throw new ValidationError('Invalid date format');
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: format.includes('HH') ? '2-digit' : undefined,
        minute: format.includes('mm') ? '2-digit' : undefined,
        second: format.includes('ss') ? '2-digit' : undefined
    });

    return formatter.format(d).replace(/\//g, '-');
};

const transformValue = (value, config) => {
    if (value === '') return null;
    
    switch (config.type) {
        case 'integer':
            const int = parseInt(value, 10);
            if (isNaN(int)) throw new ValidationError(`Invalid integer: ${value}`);
            return int;

        case 'decimal':
            const float = parseFloat(value);
            if (isNaN(float)) throw new ValidationError(`Invalid decimal: ${value}`);
            return float;

        case 'boolean':
            return value.toLowerCase() === 'true';

        case 'string':
            return value.toString();

        case 'date':
            return formatDate(value, config.format);

        case 'datetime':
            return formatDate(value, config.format || 'YYYY-MM-DD HH:mm:ss');

        case 'currency':
            const amount = parseFloat(value);
            if (isNaN(amount)) throw new ValidationError(`Invalid currency amount: ${value}`);
            return `${config.format || 'USD'} ${amount.toFixed(2)}`;

        default:
            throw new ValidationError(`Unsupported type: ${config.type}`);
    }
};

const parseCSV = (data) => {
    const lines = data.trim().split('\n').map(line => 
        line.split(',').map(value => value.trim())
    );
    
    if (lines.length < 2) {
        throw new ValidationError('CSV must contain headers and at least one data row');
    }

    return {
        headers: lines[0],
        rows: lines.slice(1)
    };
};

const transformRow = (headers, row, config) => {
    if (row.length !== headers.length) {
        throw new ValidationError('Row length does not match headers length');
    }

    return headers.reduce((obj, header, index) => {
        try {
            obj[header] = transformValue(row[index], config[header]);
            return obj;
        } catch (error) {
            throw new ValidationError(`Error transforming ${header}: ${error.message}`);
        }
    }, {});
};

const validateConfig = (config, headers) => {
    if (!config || typeof config !== 'object') {
        throw new ValidationError('Invalid configuration object');
    }

    if (Object.keys(config).length !== headers.length) {
        throw new ValidationError('Configuration keys do not match CSV headers');
    }

    headers.forEach(header => {
        if (!config[header] || !config[header].type) {
            throw new ValidationError(`Missing configuration for header: ${header}`);
        }
    });
};

async function csvToJson(filePath, config) {
    try {
        if (!filePath || typeof filePath !== 'string') {
            throw new ValidationError('Invalid file path');
        }

        const fullPath = path.resolve(filePath);
        const fileContent = await fs.readFile(fullPath, 'utf8');
        const { headers, rows } = parseCSV(fileContent);

        validateConfig(config, headers);

        return rows.map((row, index) => {
            try {
                return transformRow(headers, row, config);
            } catch (error) {
                console.warn(`Warning: Skipping row ${index + 1}: ${error.message}`);
                return null;
            }
        }).filter(row => row !== null);

    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new ValidationError('File does not exist');
        }
        throw error;
    }
}

module.exports = { csvToJson };