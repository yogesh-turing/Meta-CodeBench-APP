// Array to represent months of the year
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Navigates to the next month.
 * If it's December, it moves to January of the next year.
 * @param {number} currentMonth - The current month (0-based index).
 * @param {number} currentYear - The current year.
 * @returns {object} - Contains the updated month and year.
 */
function next(currentMonth, currentYear) {
    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    // If it's December, move to January and increment the year
    if (updatedMonth === 11) { // December
        updatedMonth = 0; // January
        updatedYear++;
    } else {
        updatedMonth++;
    }
    // Display the updated calendar
    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

/**
 * Navigates to the previous month.
 * If it's January, it moves to December of the previous year.
 * @param {number} currentMonth - The current month (0-based index).
 * @param {number} currentYear - The current year.
 * @returns {object} - Contains the updated month and year.
 */
function previous(currentMonth, currentYear) {
    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    // If it's January, move to December and decrement the year
    if (updatedMonth === 0) { // January
        updatedMonth = 11; // December
        updatedYear--;
    } else {
        updatedMonth--;
    }
    // Display the updated calendar
    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

/**
 * Allows jumping to a specific month and year.
 * Logs an error if the month or year is invalid.
 * @param {number} selectMonth - The month to jump to (0-based index).
 * @param {number} selectYear - The year to jump to.
 * @returns {object} - Contains the selected month and year if valid.
 */
function jump(selectMonth, selectYear) {
    // Check for invalid month or year
    if (selectYear < 0 || selectMonth < 0 || selectMonth > 11) {
        console.error("Invalid month or year selected");
        return;
    }
    // Display the selected calendar
    showCalendar(selectMonth, selectYear);
    return { month: selectMonth, year: selectYear };
}

/**
 * Displays the calendar for a specific month and year.
 * Logs the days of the month and marks today's date.
 * @param {number} month - The month to display (0-based index).
 * @param {number} year - The year to display.
 */
function showCalendar(month, year) {
    console.log(`Calendar for ${months[month]} ${year}`);
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month
    const today = new Date();

    // Loop through the days of the month and log each day
    for (let day = 1; day <= daysInMonth; day++) {
        // Mark today's date with a special message
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            console.log(`*Today's Date: ${day}`);
        } else {
            console.log(day);
        }
    }
}

// Export functions for testing or other uses
module.exports = { next, previous, jump, showCalendar };
