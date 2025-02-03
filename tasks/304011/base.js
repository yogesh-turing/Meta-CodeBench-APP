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
