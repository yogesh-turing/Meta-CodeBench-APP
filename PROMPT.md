Base Code:

``` javascript

const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calendar = [];

function getMonthlyCalendar(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) throw new Error("Year and month must be valid numbers");
    if (year <= 0 || month <= 0 || month > 12) throw new Error("Invalid year or month value");
    for (let i = new Date(year, month - 1, 1).getDay() - 1; i >= 0; i--) 
        calendar.push({date: new Date(year, month - 1, 0).getDate() - i, day: daysInWeek[(new Date(year, month - 1, 1).getDay() - i - 1 + 7) % 7], month: month - 1 === 0 ? 12 : month - 1,  year: month - 1 === 0 ? year - 1 : year});
    for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) 
        calendar.push({date: day,day: daysInWeek[new Date(year, month - 1, day).getDay()],month: month,year: year});
    for (let i = 1; i <= (42 - calendar.length); i++)
        calendar.push({date: i,day: daysInWeek[(firstDayOfMonth.getDay() + new Date(year, month, 0).getDate() + i - 1) % 7],month: month + 1 > 12 ? 1 : month + 1,year: month + 1 > 12 ? year + 1 : year});
    return calendar;
}

module.exports = {
    getMonthlyCalendar
};

```

Prompt:

The `getMonthlyCalendar` function returns a 6-week calendar. It returns the days from the provided year and month. Fill in days from the previous month and next month so that the output can be used to display days on the calendar. The current function is poorly structured and lacks readability.

Please help to refactor the code, consider rthe  following points while refactoring:
1. Break Down the Code into Modular Functions:
2. Adopt Efficient Methods:
    - Replace manual loops (for) with modern JavaScript methods like forEach(), map(), or reduce() where applicable.
3. Input Validation:
    - Ensure all input validation logic is encapsulated in the validateInput function.
    - Validate inputs early to prevent errors and unnecessary computation.
4. Scope Variables:
    - Use let and const to declare variables.
    - Avoid global variables and pass required data as arguments to functions.

Please note: Month is 1st based index, 1 for January, 2 for Feb, 12 for Dec. The output functions should be testable using jest. Make sure the original functionality remains the same. Also export `getMonthlyCalendar` function.