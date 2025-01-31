const fs = require('fs');
const moment = require('moment');
const path = require('path');

function csvToJson(filePath, config) {
    
    return new Promise((resolve, reject) => {

        if (!config || typeof config !== 'object') {
            throw new Error('Invalid configuration');
        }

        if (!filePath || typeof filePath !== 'string') {
            reject(new Error('Invalid file path'));
            return;
        }

        const fullPath = path.resolve(filePath);
        if (!fs.existsSync(fullPath)) {
            reject(new Error('File does not exist'));
            return;
        }

        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            const lines = data.split('\n');
            if (lines.length < 2) {
                reject(new Error('Invalid CSV format'));
                return;
            }

            const headers = lines[0].split(',');
            if (headers.length === 0) {
                reject(new Error('Invalid CSV format'));
                return;
            }

            if (headers.length !== Object.keys(config).length) {
                reject(new Error('Invalid configuration'));
                return;
            }

            const result = [];
            for (let i = 1; i < lines.length; i++) {
                let obj = {};
                let values = lines[i].split(',');

                if (values.length !== headers.length) {
                    continue; // Skip malformed rows
                }

                for (let j = 0; j < headers.length; j++) {
                    let key = headers[j].trim();
                    let value = values[j].trim();

                    // Convert numbers properly
                    if (config[key].type === 'integer') {
                        value = Number(value);
                    } else if (config[key].type === 'decimal') {
                        value = parseFloat(value);
                    } else if (config[key].type === 'boolean') {
                        value = value.toLowerCase() === 'true';
                    } else if (config[key].type === 'string') {
                        value = value.toString();
                    } else if (config[key].type === 'date') {
                        value = moment(value).format(config[key].format || 'YYYY-MM-DD');
                    } else if (config[key].type === 'datetime') {
                        value = moment(value).format(config[key].format || 'YYYY-MM-DD HH:mm:ss');
                    } else if (config[key].type === 'currency') {
                        value = `${config[key].format || 'USD'} ${parseFloat(value).toFixed(2)}`;
                    }

                    obj[key] = value;
                }
                result.push(obj);
            }

            resolve(result);
        });
    });
}

module.exports = {
    csvToJson
};
