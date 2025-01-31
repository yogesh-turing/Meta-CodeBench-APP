Base Code:
```javascript
const fs = require('fs');
const path = require('path');

function csvToJson(filePath) {
    return new Promise((resolve, reject) => {
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
                    if (!isNaN(value) && value !== '') {
                        value = Number(value);
                    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                        value = value.toLowerCase() === 'true';
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
```
Prompt:

Refactor the `csvToJson` function, to improve readability, maintainability, and performance while ensuring that all functionality remains intact. The function must:
1. Efficiently parse a CSV file into JSON format
2. Handle various data types dynamically
3. Remove redundant logic and unnecessary loops
4. Improve error handling and logging
5. Ensure testability with Jest

For refactoring the function consider the following:
1. Use streaming for efficient large file processing
2. Identify and remove duplicate code
3. Use async/await instead of callbacks
4. Improve data type detection
