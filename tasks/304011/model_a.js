const defaultCategoryMap = {
    '1': 'Food',
    '2': 'Transport',
    '3': 'Entertainment'
};

const transformDate = (dateStr) => {
    const parts = dateStr.split('/');
    return parts.length === 3
        ? `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
        : dateStr;
};

const transformAmount = (amount) => {
    return parseFloat(amount) || 0;
};

const transformCategory = (category, categoryMap = defaultCategoryMap) => {
    return categoryMap[category] || 'Other';
};

const transformValue = (key, value) => {
    const transformers = {
        'amount': transformAmount,
        'date': transformDate,
        'category': transformCategory
    };

    return transformers[key]
        ? transformers[key](value)
        : value.trim();
};

function convertCsvToJson(csvString, options = {}) {
    const { categoryMap = defaultCategoryMap } = options;
    
    // Split into rows and filter out empty lines
    const rows = csvString.split('\n').filter(row => row.trim());
    
    if (rows.length === 0) {
        return [];
    }

    // Extract and clean headers
    const headers = rows[0].split(',').map(header => header.trim());

    // Process data rows
    return rows.slice(1).map(row => {
        const values = row.split(',');
        
        return headers.reduce((obj, header, index) => {
            const value = values[index] ? values[index].trim() : '';
            obj[header] = header === 'category'
                ? transformValue(header, value, categoryMap)
                : transformValue(header, value);
            return obj;
        }, {});
    });
}

module.exports = {
    convertCsvToJson
};