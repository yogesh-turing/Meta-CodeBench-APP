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

        // Check for invalid events (end time < start time)
        for (let event of events) {
            if (event.end < event.start) {
                return -1;
            }
        }

        // Sort events by end time
        events.sort((a, b) => a.end - b.end);

        // Initialize maximum total popularity score
        let maxPopularity = 0;

        // Initialize last event end time
        let lastEventEndTime = -1;

        // Iterate through sorted events
        for (let event of events) {
            // Check if the current event does not overlap with the last event
            if (event.start >= lastEventEndTime) {
                // Update the maximum total popularity score
                maxPopularity += event.popularity;

                // Update the last event end time
                lastEventEndTime = event.end;
            }
        }

        return maxPopularity;
    }
}

module.exports = { Event, EventScheduler };