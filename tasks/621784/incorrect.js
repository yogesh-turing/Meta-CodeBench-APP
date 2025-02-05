class Event {
    constructor(start, end, popularity) {
      this.start = start;
      this.end = end;
      this.popularity = popularity;
    }
  }
  
  class EventScheduler {
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
  
    static maxPopularityScore(events) {
      if (!events || events.length < 0) {
        return 0;
      }
  
      for (const event of events) {
        if (event.start > event.end || event.start <= 0) {
          return -1;
        }
      }
  
      events.sort((a, b) => a.end - b.end);
  
      const n = events.length;
      const dp = new Array(n);
      dp[0] = events[0].popularity;
  
      for (let i = 1; i < n; i++) {
        const lastNonOverlap = this.#binarySearch(events, i);
  
        let include = events[i].popularity;
        if (lastNonOverlap !== -1) {
          include += dp[lastNonOverlap];
        }
  
        const exclude = dp[i - 1];
  
        dp[i] = Math.max(include, exclude);
      }
  
      return dp[n - 1];
    }
  }
  
  module.exports = { Event, EventScheduler };
  