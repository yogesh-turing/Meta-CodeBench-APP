class Event {
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

class EventScheduler {
    static maxPopularityScore(events) {
        // Handle null/empty cases
        if (!events || events.length === 0) {
            return 0;
        }

        // Validate event times
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

        const n = events.length;
        const dp = new Array(n).fill(0);
        
        // Base case: first event
        dp[0] = events[0].popularity;

        // Build up solution for each subsequent event
        for (let i = 1; i < n; i++) {
            // Find the latest non-overlapping event before current event
            let lastNonOverlap = -1;
            for (let j = i - 1; j >= 0; j--) {
                if (events[j].end <= events[i].start) {
                    lastNonOverlap = j;
                    break;
                }
            }

            // Maximum popularity including current event
            const includeEvent = events[i].popularity + 
                (lastNonOverlap !== -1 ? dp[lastNonOverlap] : 0);
            
            // Maximum popularity excluding current event
            const excludeEvent = dp[i - 1];

            // Take maximum of including or excluding current event
            dp[i] = Math.max(includeEvent, excludeEvent);
        }

        return dp[n - 1];
    }
}

module.exports = { Event, EventScheduler };