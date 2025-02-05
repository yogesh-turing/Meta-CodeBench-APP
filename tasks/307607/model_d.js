const { parse, isValid, differenceInDays } = require('date-fns');

function getDayAndWeekOfYear(dateStr, format = 'yyyy-MM-dd', startDateStr = null) {
    try {
        // Parse the input date
        let date;
        if (dateStr instanceof Date) {
            date = dateStr;
        } else if (typeof dateStr === 'string') {
            date = parse(dateStr, format, new Date());
        } else {
            return { error: 'Date must be a string or Date object' };
        }

        // Validate parsed date
        if (!isValid(date)) {
            return { error: 'Invalid date or format' };
        }

        // Handle start date
        let startDate;
        if (startDateStr) {
            startDate = parse(startDateStr, format, new Date());
            if (!isValid(startDate)) {
                return { error: 'Invalid start date or format' };
            }
        } else {
            startDate = new Date(date.getFullYear(), 0, 1);
        }

        // Validate date range
        if (date < startDate) {
            return { error: 'Date cannot be earlier than start date' };
        }

        // Calculate day of year
        const dayOfYear = differenceInDays(date, startDate) + 1;

        // Calculate week of year
        const weekOfYear = Math.ceil((dayOfYear + startDate.getDay()) / 7);

        return {
            dayOfYear,
            weekOfYear
        };

    } catch (error) {
        return {
            error: `Calculation error: ${error.message}`
        };
    }
}

module.exports = { getDayAndWeekOfYear };