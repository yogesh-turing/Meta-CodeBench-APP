class Event {
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

class EventScheduler {
    static maxPopularityScore(events) {
        if (!events || events.length === 0) {
            return 0;
        }

        // Sort the events by their end times
        events.sort((a, b) => a.end - b.end);

        // Check for invalid events (end time < start time)
        for (const event of events) {
            if (event.end < event.start) {
                return -1;
            }
        }

        // Initialize dynamic programming table
        const dp = new Array(events.length).fill(0);

        // Fill dynamic programming table
        dp[0] = events[0].popularity;
        for (let i = 1; i < events.length; i++) {
            let maxScore = events[i].popularity;
            for (let j = 0; j < i; j++) {
                if (events[i].start >= events[j].end) {
                    maxScore = Math.max(maxScore, dp[j] + events[i].popularity);
                }
            }
            dp[i] = maxScore;
        }

        // Return the maximum total popularity score
        return Math.max(...dp);
    }
}
module.exports = { Event, EventScheduler };