const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Validates input year and month
const validateInput = (year, month) => {
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
};

// Fills calendar with days from previous month
const fillPrevMonthDays = (year, month, firstDayOfMonth, lastDayOfPrevMonth) => {
    const prevMonthDays = firstDayOfMonth.getDay();
    return Array.from({ length: prevMonthDays }, (_, i) => {
        const prevMonth = month - 1 === 0 ? 12 : month - 1;
        const prevYear = month - 1 === 0 ? year - 1 : year;
        return {
            date: lastDayOfPrevMonth - prevMonthDays + i + 1,
            day: daysInWeek[(i + 7) % 7],
            month: prevMonth,
            year: prevYear
        };
    });
};

// Fills calendar with days from current month
const fillCurrentMonthDays = (year, month, daysInMonth) => {
    return Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month - 1, i + 1);
        return {
            date: i + 1,
            day: daysInWeek[date.getDay()],
            month: month,
            year: year
        };
    });
};

// Fills calendar with days from next month
const fillNextMonthDays = (year, month, firstDayOfMonth, daysInMonth, currentLength) => {
    const nextMonthDays = 42 - currentLength;
    return Array.from({ length: nextMonthDays }, (_, i) => {
        const nextMonth = month + 1 > 12 ? 1 : month + 1;
        const nextYear = month + 1 > 12 ? year + 1 : year;
        return {
            date: i + 1,
            day: daysInWeek[(firstDayOfMonth.getDay() + daysInMonth + i) % 7],
            month: nextMonth,
            year: nextYear
        };
    });
};

// Main function to generate monthly calendar
const getMonthlyCalendar = (year, month) => {
    validateInput(year, month);

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const lastDayOfPrevMonth = new Date(year, month - 1, 0).getDate();

    const calendar = [
        ...fillPrevMonthDays(year, month, firstDayOfMonth, lastDayOfPrevMonth),
        ...fillCurrentMonthDays(year, month, daysInMonth)
    ];

    return [
        ...calendar,
        ...fillNextMonthDays(year, month, firstDayOfMonth, daysInMonth, calendar.length)
    ];
};

module.exports = {
    getMonthlyCalendar,
    validateInput,
    fillPrevMonthDays,
    fillCurrentMonthDays,
    fillNextMonthDays
};
