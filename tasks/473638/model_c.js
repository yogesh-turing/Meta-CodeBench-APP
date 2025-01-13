const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isValidDate(month, year) {
    return month >= 0 && month <= 11 && year >= 1900 && year <= 2100;
}

function next(currentMonth, currentYear) {
    if (!isValidDate(currentMonth, currentYear)) {
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
    if (!isValidDate(currentMonth, currentYear)) {
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
    if (!isValidDate(selectMonth, selectYear)) {
        console.error("Invalid month or year selected");
        return null;
    }

    showCalendar(selectMonth, selectYear);
    return { month: selectMonth, year: selectYear };
}

function showCalendar(month, year) {
    if (!isValidDate(month, year)) {
        console.error("Invalid month or year");
        return;
    }

    console.log(`Calendar for ${months[month]} ${year}`);

    const today = new Date();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day && 
                       today.getMonth() === month && 
                       today.getFullYear() === year;

        if (isToday) {
            console.log(`*Today's Date: ${day}`);
        } else {
            console.log(day);
        }
    }
}

module.exports = { next, previous, jump, showCalendar };