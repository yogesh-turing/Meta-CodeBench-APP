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
        if (!events || events.length === 0) return 0;

        // Sort events by their end times
        events.sort((a, b) => a.end - b.end);

        // Initialize dp array
        let dp = new Array(events.length).fill(0);

        // Initialize the maximum total popularity score for the first event
        dp[0] = events[0].popularity;

        // Iterate through the rest of the events
        for (let i = 1; i < events.length; i++) {
            // Initialize the maximum total popularity score for the current event
            dp[i] = events[i].popularity;

            // Iterate through previous events to find the maximum total popularity score
            for (let j = 0; j < i; j++) {
                // Check if the current event does not overlap with the previous event
                if (events[i].start >= events[j].end) {
                    // Update the maximum total popularity score for the current event
                    dp[i] = Math.max(dp[i], dp[j] + events[i].popularity);
                }
            }
        }

        // Find the maximum total popularity score
        let maxPopularity = Math.max(...dp);

        return maxPopularity;
    }
}

module.exports = { Event, EventScheduler };