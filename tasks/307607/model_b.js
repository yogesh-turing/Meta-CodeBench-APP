import { parse, differenceInDays, differenceInWeeks, startOfYear, isValid } from 'date-fns';

function getDayAndWeekOfYear(dateString, format, startDateString = null) {
    try {
        // Parse the input date
        const date = parse(dateString, format, new Date());
        if (!isValid(date)) {
            throw new Error('Invalid date or format');
        }

        // Determine the start date
        let startDate;
        if (startDateString) {
            startDate = parse(startDateString, format, new Date());
            if (!isValid(startDate)) {
                throw new Error('Invalid start date or format');
            }
        } else {
            startDate = startOfYear(date);
        }

        // Ensure start date is not after the given date
        if (startDate > date) {
            throw new Error('Start date cannot be after the given date');
        }

        // Calculate day and week
        const dayOfYear = differenceInDays(date, startDate) + 1;
        const weekOfYear = Math.ceil(differenceInWeeks(date, startDate, { roundingMethod: 'ceil' }));

        return { dayOfYear, weekOfYear };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    getDayAndWeekOfYear
}