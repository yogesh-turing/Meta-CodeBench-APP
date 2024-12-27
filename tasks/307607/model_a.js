const { parse, differenceInDays, startOfWeek, getWeek } = require('date-fns');

function getDayAndWeekOfYear(dateString, format, startDate = null) {
    try {
        // Parse the input date
        const date = parse(dateString, format, new Date());

        if (isNaN(date.getTime())) {
            throw new Error('Invalid date or format');
        }

        // Set start date to the first day of the year if not provided
        const calculationStartDate = startDate 
            ? parse(startDate, format, new Date()) 
            : new Date(date.getFullYear(), 0, 1);

        if (isNaN(calculationStartDate.getTime())) {
            throw new Error('Invalid start date or format');
        }

        // Calculate day of year
        const dayOfYear = differenceInDays(date, calculationStartDate) + 1;

        // Calculate week of year
        const weekOfYear = getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 }) - 
                           getWeek(calculationStartDate, { weekStartsOn: 1, firstWeekContainsDate: 4 }) + 1;

        return { dayOfYear, weekOfYear };
    } catch (error) {
        console.error('Error in getDayAndWeekOfYear:', error.message);
        return { error: error.message };
    }
}

module.exports = {
    getDayAndWeekOfYear
}