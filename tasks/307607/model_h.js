function getDayAndWeekOfYear(dateString, dateFormat, startDateString) {
    try {
        // Parse date string into a Date object
        const date = parseDate(dateString, dateFormat);
        if (!(date instanceof Date)) {
            throw new Error('Invalid date input');
        }

        // Parse start date string into a Date object if provided
        let startDate;
        if (startDateString) {
            startDate = parseDate(startDateString, dateFormat);
            if (!(startDate instanceof Date)) {
                throw new Error('Invalid start date input');
            }
        } else {
            // Set start date to the first day of the year if not provided
            startDate = new Date(date.getFullYear(), 0, 1);
        }

        // Calculate day and week of the year
        const dayOfYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)) + 1;
        const weekOfYear = Math.ceil((((date - startDate) / (24 * 60 * 60 * 1000)) + startDate.getDay() + 1) / 7);

        return { dayOfYear, weekOfYear };
    } catch (error) {
        return { error: error.message };
    }
}

// Helper function to parse date string into a Date object
function parseDate(dateString, dateFormat) {
    // Use a library like moment.js to parse date string in various formats
    // For simplicity, this example assumes the date format is 'YYYY-MM-DD'
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) {
        return null;
    }
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based in JavaScript
    const day = parseInt(dateParts[2], 10);
    return new Date(year, month, day);
}

module.exports = {
    getDayAndWeekOfYear
}