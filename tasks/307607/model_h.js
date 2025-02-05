function getDayAndWeekOfYear(date = new Date(), format = 'YYYY-MM-DD', startDate = null) {
    try {
        // Check if date is a string and parse it to Date object
        if (typeof date === 'string') {
            date = parseDate(date, format);
        }

        // Check if date is a valid Date object
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error('Invalid date input');
        }

        // Set start date to the first day of the year of the date parameter if not provided
        if (!startDate) {
            startDate = new Date(date.getFullYear(), 0, 1);
        } else {
            // Check if start date is a string and parse it to Date object
            if (typeof startDate === 'string') {
                startDate = parseDate(startDate, format);
            }

            // Check if start date is a valid Date object
            if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
                throw new Error('Invalid start date input');
            }
        }

        // Calculate day of the year
        const dayOfYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)) + 1;

        // Calculate week of the year
        const startOfWeek = new Date(startDate.getFullYear(), 0, 1);
        const weekOfYear = Math.ceil((((date - startOfWeek) / (24 * 60 * 60 * 1000)) + startOfWeek.getDay() + 1) / 7);

        return { dayOfYear, weekOfYear };
    } catch (error) {
        return { error: error.message };
    }
}

// Helper function to parse date string to Date object
function parseDate(dateString, format) {
    const dateParts = dateString.split(/[-/.]/);
    const year = dateParts[0];
    const month = dateParts[1] - 1; // Month is zero-based
    const day = dateParts[2];
    return new Date(year, month, day);
}

module.exports = {
    getDayAndWeekOfYear
}