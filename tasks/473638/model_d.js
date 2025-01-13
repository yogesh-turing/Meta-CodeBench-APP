const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function next(currentMonth, currentYear) {
    if (!Number.isInteger(currentMonth) || !Number.isInteger(currentYear) ||
        currentMonth < 0 || currentMonth > 11) {
        throw new Error("Invalid month or year");
    }

    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    if (currentMonth === 11) {
        updatedMonth = 0;
        updatedYear += 1;
    } else {
        updatedMonth += 1;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function previous(currentMonth, currentYear) {
    if (!Number.isInteger(currentMonth) || !Number.isInteger(currentYear) ||
        currentMonth < 0 || currentMonth > 11) {
        throw new Error("Invalid month or year");
    }

    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    if (currentMonth === 0) {
        updatedMonth = 11;
        updatedYear -= 1;
    } else {
        updatedMonth -= 1;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function jump(selectMonth, selectYear) {
    if (!Number.isInteger(selectMonth) || !Number.isInteger(selectYear) ||
        selectMonth < 0 || selectMonth > 11 || selectYear < 1) {
        console.error("Invalid month or year selected");
        return null;
    }

    showCalendar(selectMonth, selectYear);
    return { month: selectMonth, year: selectYear };
}

function showCalendar(month, year) {
    if (!Number.isInteger(month) || !Number.isInteger(year) ||
        month < 0 || month > 11 || year < 1) {
        console.error("Invalid month or year");
        return;
    }

    console.log(`Calendar for ${months[month]} ${year}`);

    // Get current date for comparison
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Generate calendar days
    for (let day = 1; day <= totalDays; day++) {
        if (day === currentDay && month === currentMonth && year === currentYear) {
            console.log(`*Today's Date: ${day}`);
        } else {
            console.log(day);
        }
    }
}

module.exports = { next, previous, jump, showCalendar };