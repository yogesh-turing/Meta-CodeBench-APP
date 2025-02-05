const { parse, isValid, differenceInDays } = require('date-fns');

function getDayAndWeekOfYear(dateStr, format = 'yyyy-MM-dd', startDateStr = null) {
    try {
        // Parse the input date
        const date = format === 'ISO' 
            ? new Date(dateStr)
            : parse(dateStr, format, new Date());

        // Validate parsed date
        if (!isValid(date)) {
            return { error: 'Invalid date input' };
        }

        // Handle start date
        let startDate;
        if (startDateStr) {
            startDate = format === 'ISO' 
                ? new Date(startDateStr)
                : parse(startDateStr, format, new Date());
            
            if (!isValid(startDate)) {
                return { error: 'Invalid start date' };
            }
        } else {
            // Default to first day of the year
            startDate = new Date(date.getFullYear(), 0, 1);
        }

        // Calculate day of year
        const dayOfYear = differenceInDays(date, startDate) + 1;

        // Calculate week of year
        const weekOfYear = Math.ceil((dayOfYear + startDate.getDay()) / 7);

        // Validate results
        if (dayOfYear < 1) {
            return { error: 'Date is before start date' };
        }

        return { 
            dayOfYear, 
            weekOfYear,
            startDate: startDate.toISOString(),
            calculatedDate: date.toISOString()
        };

    } catch (error) {
        return { 
            error: 'Error processing date: ' + error.message 
        };
    }
}

module.exports = { getDayAndWeekOfYear };