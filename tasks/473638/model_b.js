const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isValidMonth(month) {
    return month >= 0 && month <= 11;
}

function isValidYear(year) {
    return year >= 1900 && year <= 2100;
}

function next(currentMonth, currentYear) {
    if (!isValidMonth(currentMonth) || !isValidYear(currentYear)) {
        throw new Error("Invalid month or year");
    }

    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    if (currentMonth === 11) {
        updatedMonth = 0;
        updatedYear = currentYear + 1;
    } else {
        updatedMonth = currentMonth + 1;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function previous(currentMonth, currentYear) {
    if (!isValidMonth(currentMonth) || !isValidYear(currentYear)) {
        throw new Error("Invalid month or year");
    }

    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    if (currentMonth === 0) {
        updatedMonth = 11;
        updatedYear = currentYear - 1;
    } else {
        updatedMonth = currentMonth - 1;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function jump(selectMonth, selectYear) {
    if (!isValidMonth(selectMonth) || !isValidYear(selectYear)) {
        console.error("Invalid month or year selected");
        return null;
    }

    showCalendar(selectMonth, selectYear);
    return { month: selectMonth, year: selectYear };
}

function showCalendar(month, year) {
    if (!isValidMonth(month) || !isValidYear(year)) {
        console.error("Invalid month or year");
        return;
    }

    console.log(`Calendar for ${months[month]} ${year}`);

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get current date for comparison
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Display days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        if (day === currentDay && month === currentMonth && year === currentYear) {
            console.log(`*Today's Date: ${day}`);
        } else {
            console.log(day);
        }
    }
}

module.exports = { next, previous, jump, showCalendar };