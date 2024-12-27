function getDayAndWeekOfYear(dateString, dateFormat, startDateString) {
    // Validate input parameters
    if (typeof dateString !== 'string' || !dateString.trim()) {
        throw new Error('Invalid date string input');
    }

    if (dateFormat && typeof dateFormat !== 'string') {
        throw new Error('Invalid date format input');
    }

    if (startDateString && typeof startDateString !== 'string') {
        throw new Error('Invalid start date string input');
    }

    // Parse date string to Date object
    let date;
    try {
        date = parseDate(dateString, dateFormat);
    } catch (error) {
        throw new Error('Invalid date string or format');
    }

    // Set start date to first day of the year if not provided
    let startDate;
    if (!startDateString) {
        startDate = new Date(date.getFullYear(), 0, 1);
    } else {
        try {
            startDate = parseDate(startDateString, dateFormat);
        } catch (error) {
            throw new Error('Invalid start date string or format');
        }
    }

    // Calculate day and week of the year
    const dayOfYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)) + 1;
    const weekOfYear = Math.ceil((((date - startDate) / (24 * 60 * 60 * 1000)) + startDate.getDay() + 1) / 7);

    return { dayOfYear, weekOfYear };
}

// Helper function to parse date string to Date object
function parseDate(dateString, dateFormat) {
    // Use a library like moment.js or date-fns to parse date string
    // For simplicity, we'll use the built-in Date.parse method
    // which supports a limited set of formats (e.g. ISO 8601, RFC 2822)
    const date = new Date(Date.parse(dateString));
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string or format');
    }
    return date;
}