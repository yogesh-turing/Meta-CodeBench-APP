function getNextRecurrences(startDate, frequency, count) {
    const recurrences = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < count; i++) {
        recurrences.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + frequency);
    }

    return recurrences;
}

module.exports = {
    getNextRecurrences
}