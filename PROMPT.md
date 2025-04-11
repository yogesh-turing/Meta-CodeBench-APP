Base Code:
```javascript
class Event {
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

class EventScheduler {
    static maxPopularityScore(events) {
        // Function to find the maximum total popularity score achievable 
        // by attending non-overlapping events
    }
}
module.exports = { Event, EventScheduler };
```
Prompt:
Create a function called maxPopularityScore for the EventScheduler class. This function determines the maximum total popularity score obtainable by attending a set of events during non-overlapping time intervals. 

Input:
- An integer N representing the number of events.
- An array of N objects, where each object contains:
- start: A non-negative integer indicating the event's start time.
- end: A non-negative integer indicating the event's end time.
- popularity: A non-negative integer indicating the event's popularity score.

Output:
- Return the maximum total popularity score achievable by attending non-overlapping events.
- Return -1 if the input is invalid (e.g., if an event's end time is less than its start time).
- Return 0 if the input is empty or null.

Constraints:
- Events may overlap partially or completely.
- An attendee can only attend one event at any given time.
- The goal is to select the set of non-overlapping events that maximize the total popularity score.

Example Input:
```
const N = 4;
const events = [
  { start: 1, end: 3, popularity: 5 },
  { start: 2, end: 5, popularity: 6 },
  { start: 4, end: 6, popularity: 5 },
  { start: 6, end: 7, popularity: 4 }
];
```
Example Output: 14

Explanation:
- Attend Event 1 (From time 1 to 3, popularity = 5).
- Attend Event 3 (From time 4 to 6, popularity = 5).
- Attend Event 4 (From time 6 to 7, popularity = 4).
- Total Popularity = 5 + 5 + 4 = 14.

Notes:
- Ensure invalid inputs, such as an end time earlier than the start time, are handled correctly by returning -1.
- If the input is empty or null, return 0.
- Do not modify the function or class names.
- Use additional helper functions or imports if necessary.