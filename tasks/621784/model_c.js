class Event {
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

class EventScheduler {
    static maxPopularityScore(events) {
        // Handle null or empty input
        if (!events || events.length === 0) {
            return 0;
        }

        // Validate events
        for (let event of events) {
            if (event.end < event.start || 
                event.start < 0 || 
                event.end < 0 || 
                event.popularity < 0) {
                return -1;
            }
        }

        // Sort events by end time
        events.sort((a, b) => a.end - b.end);

        // dp[i] represents the maximum popularity score achievable
        // considering events from 0 to i
        const dp = new Array(events.length);
        dp[0] = events[0].popularity;

        for (let i = 1; i < events.length; i++) {
            // Find the latest non-overlapping event before current event
            let lastNonOverlap = -1;
            for (let j = i - 1; j >= 0; j--) {
                if (events[j].end <= events[i].start) {
                    lastNonOverlap = j;
                    break;
                }
            }

            // Maximum popularity including current event
            const includeCurrent = events[i].popularity + 
                (lastNonOverlap !== -1 ? dp[lastNonOverlap] : 0);
            
            // Maximum popularity excluding current event
            const excludeCurrent = dp[i - 1];

            // Take maximum of including or excluding current event
            dp[i] = Math.max(includeCurrent, excludeCurrent);
        }

        return dp[events.length - 1];
    }
}

module.exports = { Event, EventScheduler };