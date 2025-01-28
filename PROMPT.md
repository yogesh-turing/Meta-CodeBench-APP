Base Code:

``` javascript
const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function getMonthlyCalendar(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month) ||year <= 0 || month <= 0 || month > 12) throw new Error("Invalid year or month value");
    const calendar = [];    
    for (let i = (new Date(year, month - 1, 1).getDay()) - 1; i >= 0; i--)  calendar.push({ date: (new Date(year, month - 1, 0).getDate()) - i, day: daysInWeek[((new Date(year, month - 1, 1).getDay()) - i - 1 + 7) % 7], month: (month - 1 === 0 ? 12 : month - 1), year: (month - 1 === 0 ? year - 1 : year) });
    for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) calendar.push({ date: day, day: daysInWeek[(new Date(year, month - 1, day)).getDay()], month: month, year: year });
    let nextMonthDays = 42 - calendar.length;
    for (let i = 1; i <= nextMonthDays; i++)  calendar.push({ date: i, day: daysInWeek[(new Date(year, month - 1, 1).getDay() + (new Date(year, month, 0).getDate()) + i - 1) % 7], month: (month + 1 > 12 ? 1 : month + 1), year: (month + 1 > 12 ? year + 1 : year)});
    return calendar;
}
module.exports = { getMonthlyCalendar };
```

Prompt:

The `getMonthlyCalendar` function returns a 6-week calendar. It returns the days from the provided month. Fill in days from the previous month and next month so that the output can be used to display days on the calendar. The current function is poorly structured and lacks readability.

Please help to refactor the code, consider the following points while refactoring:
1. Break Down the Code into Modular Functions.
2. Adopt Efficient Methods:
    - Replace manual loops (for) with modern JavaScript methods like forEach(), map(), or reduce() where applicable.
3. Input Validation:
    - Move input validation logic with a separate helper function to improve clarity.
    - Ensure all input validated correctly and returns appropriete message.
    - Validate inputs early to prevent errors and unnecessary computation.
4. Reduce Repeated Calculations:
    - Avoid redundant `new Date()` calls by caching results in variables. This will make the code easier to read and reduce unnecessary computations.
5. Use Descriptive Variable Names
6. Format the code for better readability and logical grouping.

Please note: Month is a first-based index: 1 for January, 2 for February, and 12 for December.
Make sure the original functionality remains the same and export the `getMonthlyCalendar` function.