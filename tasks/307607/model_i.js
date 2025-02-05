const moment = require('moment');

function getDayAndWeekOfYear(date, format, startDate) {
    try {
        // Check if date is a valid string
        if (typeof date !== 'string') {
            throw new Error('Invalid date input');
        }

        // Check if format is a valid string
        if (typeof format !== 'string') {
            throw new Error('Invalid format input');
        }

        // Parse date string using moment.js
        const dateObject = moment(date, format);
        if (!dateObject.isValid()) {
            throw new Error('Invalid date input');
        }

        // If start date is not provided, set it to the first day of the year
        if (!startDate) {
            startDate = new Date(dateObject.year(), 0, 1);
        } else {
            // Parse start date string using moment.js
            startDate = moment(startDate, format);
            if (!startDate.isValid()) {
                throw new Error('Invalid start date input');
            }
            startDate = startDate.toDate();
        }

        // Calculate day of year
        const startOfYear = new Date(dateObject.year(), 0, 1);
        const dayOfYear = Math.floor((dateObject.toDate() - startOfYear) / (24 * 60 * 60 * 1000)) + 1;

        // Calculate week of year
        const startOfWeek = new Date(dateObject.year(), 0, 1);
        const weekOfYear = Math.ceil((((dateObject.toDate() - startOfWeek) / (24 * 60 * 60 * 1000)) + startOfWeek.getDay() + 1) / 7);

        // Return the result
        return { dayOfYear, weekOfYear };
    } catch (error) {
        // Return error message
        return { error: error.message };
    }
}

module.exports = {
    getDayAndWeekOfYear
}