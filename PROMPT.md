Base Code:
```javascript
function convertCsvToJson(csvString) {
    const rows = csvString.split('\n');
    const headers = rows[0].split(',');
    let jsonData = [];

    for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue;
        const values = rows[i].split(',');
        let jsonObject = {};

        for (let j = 0; j < headers.length; j++) {
            let key = headers[j].trim();
            let value = values[j] ? values[j].trim() : '';

            if (key === "amount") {
                value = parseFloat(value) || 0;
            } else if (key === "date") {
                let parts = value.split('/');
                if (parts.length === 3) {
                    value = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
                }
            } else if (key === "category") {
                if (value === "1") {
                    value = "Food";
                } else if (value === "2") {
                    value = "Transport";
                } else if (value === "3") {
                    value = "Entertainment";
                } else {
                    value = "Other";
                }
            }

            jsonObject[key] = value;
        }

        jsonData.push(jsonObject);
    }
    return jsonData;
}

module.exports = {
    convertCsvToJson
};

```
Prompt:

The `convertCsvToJson` function parses CSV data into JSON format. It applies custom transformations for specific fields (e.g., date formatting, numeric conversion, and category mapping) and returnsa  JSON array.
Please help to refactor this function to improve its readability, maintainability, and efficiency. The function should produce the same output.
Consider the following points for refactoring:
1. Avoid nested loops, current functions have nested loops, making them harder to read and maintain.
2. Created helper functions for mapping transformations.
3. Use the `map`, and `reduce` functions instead of `for` loops.
4. Make the function more generic (e.g., allowing dynamic category mappings).