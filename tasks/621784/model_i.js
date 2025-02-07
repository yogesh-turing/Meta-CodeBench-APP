class Event {
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

class EventScheduler {
    static maxPopularityScore(events) {
        // Check for invalid input
        if (!events || events.length === 0) {
            return 0;
        }

        // Sort events by their end times
        events.sort((a, b) => a.end - b.end);

        // Initialize a dynamic programming array to store the maximum popularity score
        // for each event
        const dp = new Array(events.length).fill(0);

        // Initialize the maximum popularity score for the first event
        dp[0] = events[0].popularity;

        // Iterate through the events to fill the dynamic programming array
        for (let i = 1; i < events.length; i++) {
            // Find the maximum popularity score for the current event by considering
            // all previous non-overlapping events
            let maxScore = 0;
            for (let j = 0; j < i; j++) {
                if (events[j].end <= events[i].start) {
                    maxScore = Math.max(maxScore, dp[j]);
                }
            }

            // Update the maximum popularity score for the current event
            dp[i] = Math.max(maxScore + events[i].popularity, dp[i - 1]);
        }

        // Return the maximum popularity score for the last event
        return dp[events.length - 1];
    }
}
module.exports = { Event, EventScheduler };