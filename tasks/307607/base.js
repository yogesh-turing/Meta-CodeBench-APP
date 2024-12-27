
function getDayAndWeekOfYear(date = new Date()) {
    if (!(date instanceof Date)) {
        throw new Error('Invalid date input');
    }

    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;

    const startOfWeek = new Date(date.getFullYear(), 0, 1);
    const weekOfYear = Math.ceil((((date - startOfWeek) / (24 * 60 * 60 * 1000)) + startOfWeek.getDay() + 1) / 7);

    return { dayOfYear, weekOfYear };
}

module.exports = {getDayAndWeekOfYear};