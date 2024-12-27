function getDayAndWeekOfYear(dateString, format, startDateString) {
    let date, startDate;

    try {
        date = parseDate(dateString, format);
    } catch (error) {
        return { error: `Invalid date input: ${error.message}` };
    }

    if (startDateString) {
        try {
            startDate = parseDate(startDateString, format);
        } catch (error) {
            return { error: `Invalid start date input: ${error.message}` };
        }
    } else {
        startDate = new Date(date.getFullYear(), 0, 1);
    }

    const dayOfYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)) + 1;

    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekOfYear = Math.ceil((((date - startOfWeek) / (24 * 60 * 60 * 1000)) + startOfWeek.getDay() + 1) / 7);

    return { dayOfYear, weekOfYear };
}

// Helper function to parse date strings
function parseDate(dateString, format) {
    const moment = require('moment');
    const date = moment(dateString, format);

    if (!date.isValid()) {
        throw new Error(`Invalid date format. Please use the format: ${format}`);
    }

    return date.toDate();
}

module.exports = {
    getDayAndWeekOfYear
}