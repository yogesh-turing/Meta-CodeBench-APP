function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    if (!isValidDate(startDate)) {
        throw new Error('Invalid start date');
    }
    if (!isValidFrequency(frequency)) {
        throw new Error('Invalid frequency');
    }
    if (!isValidCount(count)) {
        throw new Error('Invalid count');
    }

    const recurrences = [];
    let currentDate = adjustToWeekday(new Date(startDate), onlyWeekDays);

    while (recurrences.length < count) {
        if (shouldAddDate(currentDate, onlyWeekDays)) {
            recurrences.push(new Date(currentDate));
        }
        currentDate = getNextDate(currentDate, frequency, onlyWeekDays);
    }

    return recurrences;
}

function isValidDate(date) {
    return date && !isNaN(new Date(date));
}

function isValidFrequency(frequency) {
    return typeof frequency === 'number' && frequency > 0;
}

function isValidCount(count) {
    return typeof count === 'number' && count > 0;
}

function adjustToWeekday(date, onlyWeekDays) {
    if (onlyWeekDays && (date.getDay() === 0 || date.getDay() === 6)) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}

function shouldAddDate(date, onlyWeekDays) {
    return !onlyWeekDays || (date.getDay() !== 0 && date.getDay() !== 6);
}

function getNextDate(date, frequency, onlyWeekDays) {
    for (let i = 0; i < frequency; i++) {
        date.setDate(date.getDate() + 1);
        if (onlyWeekDays) {
            while (date.getDay() === 0 || date.getDay() === 6) {
                date.setDate(date.getDate() + 1);
            }
        }
    }
    return date;
}

module.exports = {
    getNextRecurrences
}