function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    if (startDate === null || startDate === undefined) {
        throw new Error("startDate cannot be null or undefined");
    }

    if (frequency < 0) {
        throw new Error("frequency cannot be negative");
    }

    if (count < 0) {
        throw new Error("count cannot be negative");
    }

    const recurrences = [];
    let currentDate = new Date(startDate);

    if (isNaN(currentDate.getTime())) {
        throw new Error("Invalid date");
    }

    for (let i = 0; i < count; i++) {
        let nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + frequency);

        if (onlyWeekDays) {
            while (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
                nextDate.setDate(nextDate.getDate() + 1);
            }
        }

        recurrences.push(nextDate);
        currentDate = nextDate;
    }

    return recurrences;
}

module.exports = {
    getNextRecurrences
};