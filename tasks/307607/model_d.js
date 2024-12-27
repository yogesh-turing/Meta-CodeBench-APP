const { parse, differenceInDays, differenceInWeeks, startOfYear, isValid } = require('date-fns');

function getDayAndWeekOfYear(dateString, format, startDateString = null) {
    if (typeof dateString !== 'string' || typeof format !== 'string') {
        throw new Error('Date and format must be strings');
    }

    const date = parse(dateString, format, new Date());
    if (!isValid(date)) {
        throw new Error('Invalid date or format');
    }

    let startDate;
    if (startDateString) {
        startDate = parse(startDateString, format, new Date());
        if (!isValid(startDate)) {
            throw new Error('Invalid start date');
        }
    } else {
        startDate = startOfYear(date);
    }

    if (date < startDate) {
        throw new Error('Date cannot be earlier than the start date');
    }

    const dayOfYear = differenceInDays(date, startDate) + 1;
    const weekOfYear = Math.ceil(differenceInWeeks(date, startDate, { roundingMethod: 'ceil' }));

    return { dayOfYear, weekOfYear };
}

// Example usage:
// try {
//     const result = getDayAndWeekOfYear('2023-05-15', 'yyyy-MM-dd');
//     console.log(result);
// } catch (error) {
//     console.error('Error:', error.message);
// }

module.exports = {
    getDayAndWeekOfYear
}