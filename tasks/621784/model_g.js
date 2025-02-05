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

        let maxPopularity = 0;
        let lastEndTime = -1;

        for (let event of events) {
            if (event.start < event.end) {
                if (event.start >= lastEndTime) {
                    maxPopularity += event.popularity;
                    lastEndTime = event.end;
                }
            } else {
                return -1;
            }
        }

        return maxPopularity;
    }
}
module.exports = { Event, EventScheduler };