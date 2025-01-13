const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function next(currentMonth, currentYear) {
    let updatedMonth, updatedYear;

    if (currentMonth === "Dec") {
        updatedMonth = "Jan";
        updatedYear = currentYear + 1;
    } else {
        updatedMonth = months[months.indexOf(currentMonth) + 1];
        updatedYear = currentYear;
    }

    showCalendar(updatedMonth, updatedYear);
    return { updatedMonth, updatedYear };
}

function previous(currentMonth, currentYear) {
    let updatedMonth, updatedYear;

    if (currentMonth === "Jan") {
        updatedMonth = "Dec";
        updatedYear = currentYear - 1;
    } else {
        updatedMonth = months[months.indexOf(currentMonth) - 1];
        updatedYear = currentYear;
    }

    showCalendar(updatedMonth, updatedYear);
    return { updatedMonth, updatedYear };
}

function jump(selectMonth, selectYear) {
    if (!months.includes(selectMonth) || typeof selectYear !== "number" || selectYear < 1) {
        console.error("Invalid month or year selected");
        return;
    }

    showCalendar(selectMonth, selectYear);
    return { selectMonth, selectYear };
}

function showCalendar(month, year) {
    if (!months.includes(month) || typeof year !== "number" || year < 1) {
        console.error("Invalid month or year");
        return;
    }

    console.log(`Calendar for ${month} ${year}`);

    const date = new Date(year, months.indexOf(month), 1);
    const today = new Date();
    const daysInMonth = new Date(year, months.indexOf(month) + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, months.indexOf(month), day);
        if (dayDate.toDateString() === today.toDateString()) {
            console.log(`*Today's Date: ${day}`);
        } else {
            console.log(day);
        }
    }
}

module.exports = { next, previous, jump, showCalendar };