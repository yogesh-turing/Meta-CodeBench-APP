const { parse, isValid, differenceInDays } = require('date-fns');

function getDayAndWeekOfYear(dateStr, format = 'yyyy-MM-dd', startDateStr = null) {
    try {
        // Parse and validate the input date
        let date;
        if (dateStr instanceof Date) {
            date = dateStr;
        } else if (typeof dateStr === 'string') {
            date = parse(dateStr, format, new Date());
        } else {
            return { error: 'Date must be a string or Date object' };
        }

        if (!isValid(date)) {
            return { error: 'Invalid date input' };
        }

        // Handle start date
        let startDate;
        if (startDateStr) {
            if (typeof startDateStr === 'string') {
                startDate = parse(startDateStr, format, new Date());
                if (!isValid(startDate)) {
                    return { error: 'Invalid start date input' };
                }
            } else {
                return { error: 'Start date must be a string' };
            }
        } else {
            // Default to first day of the year
            startDate = new Date(date.getFullYear(), 0, 1);
        }

        // Calculate days difference
        const dayOfYear = differenceInDays(date, startDate) + 1;

        // Calculate week of year
        const weekOfYear = Math.ceil((dayOfYear + startDate.getDay()) / 7);

        return { dayOfYear, weekOfYear };
    } catch (error) {
        return { error: `Calculation error: ${error.message}` };
    }
}

module.exports = { getDayAndWeekOfYear };