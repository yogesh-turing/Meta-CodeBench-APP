Base Code:
```javascript

function getNextRecurrences(startDate, frequency, count) {
    const recurrences = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < count; i++) {
        recurrences.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + frequency);
    }

    return recurrences;
}

```

Prompt:

Modify the getNextRecurrences function to include a new parameter, onlyWeekDays. If onlyWeekDays is true, the function should calculate the next recurrences while considering only weekdays (Monday to Friday).

Add a parameter named onlyWeekDays to the function. The default value should be false.

If onlyWeekDays is true, skip any dates on weekends (Saturday or Sunday). Ensure the next recurrence is pushed only if it falls on a weekday.

If onlyWeekDays is false, maintain the original behavior where the function calculates recurrences based on the frequency parameter without considering weekdays.

Ensure edge cases like crossing a weekend when adding frequency are handled properly.

The new function should work for frequencies greater than 5, 15, 30, etc.

Ensure the function throws errors for null, undefined input values, and invalid dates.

Ensure the function throws errors for negative frequency and count values.