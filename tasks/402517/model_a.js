function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    if (startDate === null || startDate === undefined || isNaN(new Date(startDate).getTime())) {
        throw new Error("Invalid start date");
    }
    if (typeof frequency !== 'number' || frequency <= 0) {
        throw new Error("Frequency must be a positive number");
    }
    if (typeof count !== 'number' || count <= 0 || !Number.isInteger(count)) {
        throw new Error("Count must be a positive integer");
    }

    const recurrences = [];
    let currentDate = new Date(startDate);

    function isWeekday(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    while (recurrences.length < count) {
        if (!onlyWeekDays || isWeekday(currentDate)) {
            recurrences.push(new Date(currentDate));
        }

        if (onlyWeekDays) {
            do {
                currentDate = addDays(currentDate, 1);
            } while (!isWeekday(currentDate));

            const remainingDays = frequency - 1;
            for (let i = 0; i < remainingDays; i++) {
                currentDate = addDays(currentDate, 1);
                if (!isWeekday(currentDate)) {
                    i--;
                }
            }
        } else {
            currentDate = addDays(currentDate, frequency);
        }
    }

    return recurrences;
}

module.exports = {
    getNextRecurrences
};