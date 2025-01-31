const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');
const { join } = require('path');
const { EOL } = require('os');

/**
 * Converts a CSV file to JSON format
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<object[]>} - A promise resolving to an array of objects
 */
async function csvToJson(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error('File does not exist');
  }

  const readStream = createReadStream(fullPath, 'utf8');
  const headers = [];
  const result = [];

  for await (const chunk of readStream) {
    const lines = chunk.split(EOL);
    for (const line of lines) {
      if (headers.length === 0) {
        headers = line.split(',').map(header => header.trim());
      } else {
        const values = line.split(',');
        if (values.length !== headers.length) {
          continue; // Skip malformed rows
        }
        const obj = {};
        for (let i = 0; i < headers.length; i++) {
          let value = values[i].trim();
          if (!isNaN(value) && value !== '') {
            value = Number(value);
          } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            value = value.toLowerCase() === 'true';
          }
          obj[headers[i]] = value;
        }
        result.push(obj);
      }
    }
  }

  return result;
}

module.exports = {
  csvToJson
};