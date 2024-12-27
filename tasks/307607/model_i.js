function getDayAndWeekOfYear(dateString, dateFormat, startDateString) {
    // Check if date string is provided
    if (!dateString) {
        throw new Error('Date string is required');
    }

    // Parse the date string into a Date object
    let date;
    try {
        date = parseDate(dateString, dateFormat);
    } catch (error) {
        throw new Error(`Invalid date string: ${error.message}`);
    }

    // Check if start date string is provided
    let startDate;
    if (startDateString) {
        try {
            startDate = parseDate(startDateString, dateFormat);
        } catch (error) {
            throw new Error(`Invalid start date string: ${error.message}`);
        }
    } else {
        // Set start date to the first day of the year if not provided
        startDate = new Date(date.getFullYear(), 0, 1);
    }

    // Calculate day and week of the year
    const dayOfYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)) + 1;
    const weekOfYear = Math.ceil((((date - startDate) / (24 * 60 * 60 * 1000)) + startDate.getDay() + 1) / 7);

    return { dayOfYear, weekOfYear };
}

// Helper function to parse date string into a Date object
function parseDate(dateString, dateFormat) {
    // Use a library like moment.js to parse the date string
    // For simplicity, this example uses the Date constructor
    return new Date(dateString);
}

module.exports = {
    getDayAndWeekOfYear
}