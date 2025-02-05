/**
 * Represents an event with a start time, end time, and popularity score.
 */
class Event {
    /**
     * Constructs an Event object.
     *
     * @param {number} start - The start time of the event (must be non-negative).
     * @param {number} end - The end time of the event (must be greater than start).
     * @param {number} popularity - The popularity score of the event (must be non-negative).
     */
    constructor(start, end, popularity) {
        this.start = start;
        this.end = end;
        this.popularity = popularity;
    }
}

/**
 * A utility class for scheduling events to maximize the total popularity score of non-overlapping events.
 */
class EventScheduler {
    /**
     * Binary search to find the latest non-overlapping event
     * 
     * @private
     * @param {Array<Event>} events - The list of events
     * @param {number} currentIndex - The index of the current event
     * @returns {number} The index of the latest non-overlapping event, or -1 if none found
     */
    static #binarySearch(events, currentIndex) {
        let low = 0;
        let high = currentIndex - 1;
        let result = -1;
        
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (events[mid].end <= events[currentIndex].start) {
                result = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return result;
    }

    /**
     * Computes the maximum popularity score for a list of non-overlapping events.
     *
     * @param {Array<Event>} events - A list of events, where each event has a start time, end time, and popularity score.
     *                                The list must not contain null elements. Each event's start time must be less than its end time,
     *                                and all values must be non-negative.
     * @returns {number} The maximum popularity score of non-overlapping events.
     *                   Returns 0 if the input array is null or empty.
     *                   Returns -1 if the input contains invalid events (e.g., start >= end or negative values).
     */
    static maxPopularityScore(events) {
        // Handle edge cases
        if (!events || events.length === 0) {
            return 0;
        }

        // Validate input
        for (const event of events) {
            if (event.start >= event.end || event.start < 0 || event.popularity < 0) {
                return -1;
            }
        }

        // Sort events by end time
        events.sort((a, b) => a.end - b.end);
        
        const n = events.length;
        // dp[i] stores the maximum popularity score up to event i
        const dp = new Array(n);
        dp[0] = events[0].popularity;

        // For each event, find the maximum popularity score
        for (let i = 1; i < n; i++) {
            // Find the latest non-overlapping event
            const lastNonOverlap = this.#binarySearch(events, i);
            
            // Include current event
            let include = events[i].popularity;
            if (lastNonOverlap !== -1) {
                include += dp[lastNonOverlap];
            }
            
            // Exclude current event
            const exclude = dp[i-1];
            
            // Take maximum of including and excluding current event
            dp[i] = Math.max(include, exclude);
        }

        return dp[n-1];
    }
}

module.exports = { Event, EventScheduler };