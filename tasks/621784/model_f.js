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

        events.sort((a, b) => a.end - b.end);

        let dp = new Array(events.length).fill(0);

        dp[0] = events[0].popularity;

        for (let i = 1; i < events.length; i++) {
            let maxPopularity = 0;
            for (let j = 0; j < i; j++) {
                if (events[j].end <= events[i].start) {
                    maxPopularity = Math.max(maxPopularity, dp[j]);
                }
            }
            dp[i] = Math.max(dp[i - 1], maxPopularity + events[i].popularity);
        }

        return dp[events.length - 1];
    }
}

module.exports = { Event, EventScheduler };