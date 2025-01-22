/**
 * Calculates the next recurrences based on the given start date, frequency, and count.
 * 
 * @param {Date} startDate The start date from which to calculate recurrences.
 * @param {number} frequency The interval in days between each recurrence.
 * @param {number} count The number of recurrences to calculate.
 * @param {boolean} [onlyWeekDays=false] If true, only consider weekdays (Monday to Friday).
 * @returns {Date[]} An array of dates representing the next recurrences.
 */
function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    // Check for invalid input values and throw errors
    if (startDate === null || startDate === undefined) {
        throw new Error("startDate cannot be null or undefined.");
    }
    if (!(startDate instanceof Date)) {
        throw new Error("startDate must be a valid Date object.");
    }
    if (isNaN(startDate.getTime())) {
        throw new Error("startDate is an invalid date.");
    }
    if (frequency <= 0) {
        throw new Error("frequency must be a positive number.");
    }
    if (count <= 0) {
        throw new Error("count must be a positive number.");
    }

    const recurrences = [];
    let currentDate = new Date(startDate);

    while (recurrences.length < count) {
        // If onlyWeekDays is true, check if the current date is a weekday
        if (onlyWeekDays && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
            // If it's a weekend, skip to the next day
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        // Add the current date to the recurrences array
        recurrences.push(new Date(currentDate));

        // Increment the current date by the frequency
        currentDate.setDate(currentDate.getDate() + frequency);
    }

    return recurrences;
}

module.exports = {
    getNextRecurrences
};