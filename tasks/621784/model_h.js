class Event {
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

class EventScheduler {
    static maxPopularityScore(events) {
        // Check for invalid or empty input
        if (!events || events.length === 0) {
            return 0;
        }

        // Sort events by their end times
        events.sort((a, b) => a.end - b.end);

        // Initialize a dynamic programming table to store the maximum popularity score at each event
        const dp = new Array(events.length).fill(0);

        // Initialize the maximum popularity score for the first event
        dp[0] = events[0].popularity;

        // Iterate through the events to fill the dynamic programming table
        for (let i = 1; i < events.length; i++) {
            // Initialize the maximum popularity score for the current event to be the popularity of the current event
            let maxPopularity = events[i].popularity;

            // Iterate through the previous events to find the maximum popularity score that does not overlap with the current event
            for (let j = 0; j < i; j++) {
                // Check if the current event does not overlap with the previous event
                if (events[i].start >= events[j].end) {
                    // Update the maximum popularity score for the current event
                    maxPopularity = Math.max(maxPopularity, dp[j] + events[i].popularity);
                }
            }

            // Update the dynamic programming table with the maximum popularity score for the current event
            dp[i] = maxPopularity;
        }

        // Return the maximum popularity score from the dynamic programming table
        return Math.max(...dp);
    }
}

module.exports = { Event, EventScheduler };