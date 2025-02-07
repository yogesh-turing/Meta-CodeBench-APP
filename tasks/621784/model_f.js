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

        for (let event of events) {
            if (event.end < event.start) {
                return -1;
            }
        }

        events.sort((a, b) => a.end - b.end);

        let maxPopularity = 0;
        let lastEndTime = -1;

        for (let event of events) {
            if (event.start >= lastEndTime) {
                maxPopularity += event.popularity;
                lastEndTime = event.end;
            }
        }

        return maxPopularity;
    }
}

module.exports = { Event, EventScheduler };