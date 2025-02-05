const { parse, isValid, differenceInDays } = require('date-fns');

function getDayAndWeekOfYear(dateStr, format = 'yyyy-MM-dd', startDateStr = null) {
    try {
        // Validate and parse input date
        if (!dateStr || typeof dateStr !== 'string') {
            return { error: 'Date string is required' };
        }

        if (typeof format !== 'string') {
            return { error: 'Invalid format parameter' };
        }

        const date = parse(dateStr, format, new Date());
        if (!isValid(date)) {
            return { error: 'Invalid date input or format' };
        }

        // Handle start date
        let startDate;
        if (startDateStr) {
            if (typeof startDateStr !== 'string') {
                return { error: 'Invalid start date parameter' };
            }
            startDate = parse(startDateStr, format, new Date());
            if (!isValid(startDate)) {
                return { error: 'Invalid start date or format' };
            }
        } else {
            // Default to first day of the year
            startDate = new Date(date.getFullYear(), 0, 1);
        }

        // Calculate days
        const dayOfYear = differenceInDays(date, startDate) + 1;

        // Calculate weeks
        const weekOfYear = Math.ceil((dayOfYear + startDate.getDay()) / 7);

        // Validate results
        if (dayOfYear < 1) {
            return { error: 'Date is before start date' };
        }

        return {
            dayOfYear,
            weekOfYear
        };

    } catch (error) {
        return { error: `Calculation error: ${error.message}` };
    }
}

module.exports = { getDayAndWeekOfYear };