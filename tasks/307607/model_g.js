function getDayAndWeekOfYear(dateString, format = 'YYYY-MM-DD', startDateString) {
    let date;
    try {
        date = new Date(dateString);
    } catch (error) {
        return { error: 'Invalid date input' };
    }

    if (isNaN(date.getTime())) {
        return { error: 'Invalid date input' };
    }

    let startDate;
    if (startDateString) {
        try {
            startDate = new Date(startDateString);
        } catch (error) {
            return { error: 'Invalid start date input' };
        }

        if (isNaN(startDate.getTime())) {
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