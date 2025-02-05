function getDayAndWeekOfYear(date, format, startDate) {
    if (!date) {
        return { error: 'Date is required' };
    }

    if (format) {
        date = new Date(date);
    } else {
        date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return { error: 'Invalid date input' };
    }

    if (startDate) {
        startDate = new Date(startDate);
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            return { error: 'Invalid start date input' };
        }
    } else {
        startDate = new Date(date.getFullYear(), 0, 1);
    }

    const dayOfYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)) + 1;

    const startOfWeek = new Date(startDate);
    const weekOfYear = Math.ceil((((date - startOfWeek) / (24 * 60 * 60 * 1000)) + startOfWeek.getDay() + 1) / 7);

    return { dayOfYear, weekOfYear };
}

module.exports = {
    getDayAndWeekOfYear
}