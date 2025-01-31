function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    if (startDate == null || frequency == null || count == null) {
        throw new Error("Null or undefined input values are not allowed");
    }

    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error("Invalid date");
    }

    if (frequency < 0 || count < 0) {
        throw new Error("Negative frequency and count values are not allowed");
    }

    const recurrences = [];
    let currentDate = new Date(startDate);

    while (recurrences.length < count) {
        if (!onlyWeekDays || (currentDate.getDay() >= 1 && currentDate.getDay() <= 5)) {
            recurrences.push(new Date(currentDate));
        }

        currentDate.setDate(currentDate.getDate() + frequency);
    }

    return recurrences;
}

module.exports = {
    getNextRecurrences
};