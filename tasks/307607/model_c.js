const { parse, isValid, differenceInDays, startOfWeek, getWeek } = require('date-fns');

function getDayAndWeekOfYear(dateString, format, startDate = null) {
    if (typeof dateString !== 'string' || typeof format !== 'string') {
        throw new Error('Date and format must be strings');
    }

    const date = parse(dateString, format, new Date());
    if (!isValid(date)) {
        throw new Error('Invalid date or format');
    }

    let yearStart;
    if (startDate) {
        yearStart = parse(startDate, format, new Date());
        if (!isValid(yearStart)) {
            throw new Error('Invalid start date');
        }
    } else {
        yearStart = new Date(date.getFullYear(), 0, 1);
    }

    if (date < yearStart) {
        throw new Error('Date cannot be earlier than the start date');
    }

    const dayOfYear = differenceInDays(date, yearStart) + 1;
    const weekOfYear = getWeek(date, { startOfWeek: 0, firstWeekContainsDate: 1 });

    return { dayOfYear, weekOfYear };
}

module.exports = {
    getDayAndWeekOfYear
}