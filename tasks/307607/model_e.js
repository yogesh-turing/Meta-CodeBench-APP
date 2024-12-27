const { parse, isValid, differenceInDays, startOfYear, getDay } = require('date-fns');

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
    const weekOfYear = Math.ceil((dayOfYear + getDay(startDate)) / 7);

    return { dayOfYear, weekOfYear };
}

module.exports = {
    getDayAndWeekOfYear
}