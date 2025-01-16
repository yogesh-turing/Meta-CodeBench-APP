function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    if (startDate == null || isNaN(new Date(startDate).getTime())) {
        throw new Error("Invalid or null start date");
    }
    if (typeof frequency !== 'number' || frequency <= 0) {
        throw new Error("Frequency must be a positive number");
    }
    if (typeof count !== 'number' || count <= 0) {
        throw new Error("Count must be a positive number");
    }

    const recurrences = [];
    let currentDate = new Date(startDate);

    function isWeekday(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    }

    function getNextWeekday(date) {
        do {
            date.setDate(date.getDate() + 1);
        } while (!isWeekday(date));
        return date;
    }

    for (let i = 0; i < count; i++) {
        if (!onlyWeekDays || isWeekday(currentDate)) {
            recurrences.push(new Date(currentDate));
        }

        if (onlyWeekDays) {
            do {
                currentDate.setDate(currentDate.getDate() + 1);
                if (isWeekday(currentDate)) {
                    frequency--;
                }
            } while (frequency > 0);
        } else {
            currentDate.setDate(currentDate.getDate() + frequency);
        }

        if (onlyWeekDays && !isWeekday(currentDate)) {
            currentDate = getNextWeekday(currentDate);
        }
    }

    return recurrences;
}

module.exports = {
    getNextRecurrences
};