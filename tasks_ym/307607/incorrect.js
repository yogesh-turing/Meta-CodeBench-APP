function getDayAndWeekOfYear(dateStr, dateFormat, startDateStr) {
    let date, startDate;

    // Check if dateStr is provided
    if (!dateStr) {
        throw new Error('Date is required');
    }

    // Try to parse dateStr using the provided dateFormat
    try {
        date = parseDate(dateStr, dateFormat);
    } catch (error) {
        throw new Error(`Invalid date or format: ${error.message}`);
    }

    // If startDateStr is provided, try to parse it
    if (startDateStr) {
        try {
            startDate = parseDate(startDateStr, dateFormat);
        } catch (error) {
            throw new Error(`Invalid start date or format: ${error.message}`);
        }
    } else {
        // If no startDateStr is provided, set startDate to the first day of the year of the date
        startDate = new Date(date.getFullYear(), 0, 1);
    }

    // Calculate day and week of year
    const dayOfYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)) + 1;
    const weekOfYear = Math.ceil((((date - startDate) / (24 * 60 * 60 * 1000)) + startDate.getDay() + 1) / 7);

    return { dayOfYear, weekOfYear };
}

// Helper function to parse date strings
function parseDate(dateStr, dateFormat) {
    const formats = {
        'YYYY-MM-DD': (str) => new Date(str),
        'DD-MM-YYYY': (str) => {
            const parts = str.split('-');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        },
        'MM-DD-YYYY': (str) => {
            const parts = str.split('-');
            return new Date(parts[2], parts[0] - 1, parts[1]);
        }
    };

    if (!formats[dateFormat]) {
        throw new Error(`Unsupported date format: ${dateFormat}`);
    }

    return formats[dateFormat](dateStr);
}


module.exports = {
    getDayAndWeekOfYear
};