class Event {
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

class EventScheduler {
    static maxPopularityScore(events) {
        // Handle invalid input
        if (!events || events.length === 0) {
            return 0;
        }

        // Sort events by end time
        events.sort((a, b) => a.end - b.end);

        // Initialize dynamic programming array
        let dp = new Array(events.length).fill(0);

        // Initialize maximum popularity score
        let maxPopularity = 0;

        // Iterate through events
        for (let i = 0; i < events.length; i++) {
            // Check if event is valid (end time >= start time)
            if (events[i].end < events[i].start) {
                return -1;
            }

            // Initialize popularity score for current event
            let popularity = events[i].popularity;

            // Check for non-overlapping events
            for (let j = 0; j < i; j++) {
                if (events[i].start >= events[j].end) {
                    popularity = Math.max(popularity, dp[j] + events[i].popularity);
                }
            }

            // Update dynamic programming array
            dp[i] = popularity;

            // Update maximum popularity score
            maxPopularity = Math.max(maxPopularity, popularity);
        }

        return maxPopularity;
    }
}

module.exports = { Event, EventScheduler };