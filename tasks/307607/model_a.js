const { parse, isValid, differenceInDays } = require('date-fns');

function getDayAndWeekOfYear(dateStr, format = 'yyyy-MM-dd', startDate = null) {
    try {
        // Parse the input date string
        const date = format ? parse(dateStr, format, new Date()) : new Date(dateStr);

        // Validate parsed date
        if (!isValid(date)) {
            return { error: 'Invalid date input' };
        }

        // Set default start date if not provided
        let calculationStartDate;
        if (startDate) {
            calculationStartDate = format ? 
                parse(startDate, format, new Date()) : 
                new Date(startDate);

            if (!isValid(calculationStartDate)) {
                return { error: 'Invalid start date' };
            }
        } else {
            calculationStartDate = new Date(date.getFullYear(), 0, 1);
        }

        // Validate date order
        if (calculationStartDate > date) {
            return { error: 'Start date cannot be after the input date' };
        }

        // Calculate day of year
        const dayOfYear = differenceInDays(date, calculationStartDate) + 1;

        // Calculate week of year
        const weekOfYear = Math.ceil((dayOfYear + calculationStartDate.getDay()) / 7);

        return { dayOfYear, weekOfYear };
    } catch (error) {
        return { 
            error: 'Error processing date: ' + 
                (error.message || 'Unknown error occurred') 
        };
    }
}

module.exports = { getDayAndWeekOfYear };