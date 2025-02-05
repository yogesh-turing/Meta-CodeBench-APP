function getDayAndWeekOfYear(date = new Date(), format = 'YYYY-MM-DD', startDate) {
    let dateObject;

    // Parse the date string into a Date object
    if (typeof date === 'string') {
        const dateParts = date.split(/[-/.]/);
        dateObject = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    } else if (date instanceof Date) {
        dateObject = date;
    } else {
        return { error: 'Invalid date input' };
    }

    // Validate the date object
    if (isNaN(dateObject.getTime())) {
        return { error: 'Invalid date input' };
    }

    // Set the start date to the first day of the year if not provided
    if (!startDate) {
        startDate = new Date(dateObject.getFullYear(), 0, 1);
    } else if (typeof startDate === 'string') {
        const startDateParts = startDate.split(/[-/.]/);
        startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);
    } else if (!(startDate instanceof Date)) {
        return { error: 'Invalid start date input' };
    }

    // Calculate the day and week of the year
    const dayOfYear = Math.floor((dateObject - startDate) / (24 * 60 * 60 * 1000)) + 1;
    const weekOfYear = Math.ceil((((dateObject - startDate) / (24 * 60 * 60 * 1000)) + startDate.getDay() + 1) / 7);

    return { dayOfYear, weekOfYear };
}

module.exports = {
    getDayAndWeekOfYear
}