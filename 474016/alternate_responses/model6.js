class FlightScheduler {
  constructor() {
    this.flights = [];
  }

  addFlight(flightNumber, departure, arrival, duration) {
    this.flights.push({ flightNumber, departure, arrival, duration });
  }

  findFlightsByDeparture(departure) {
    return this.flights.filter((flight) => flight.departure === departure);
  }

  getFlightDuration(flightNumber) {
    const flight = this.flights.find((f) => f.flightNumber === flightNumber);
    return flight ? flight.duration : null;
  }

  findShortestRoute(start, destination) {
    const graph = {};
    for (const flight of this.flights) {
      if (!graph[flight.departure]) graph[flight.departure] = [];
      graph[flight.departure].push({
        arrival: flight.arrival,
        flightNumber: flight.flightNumber,
        duration: flight.duration,
      });
    }

    const visited = new Set();
    const queue = [{ city: start, path: [], duration: 0 }];

    while (queue.length) {
      const { city, path, duration } = queue.shift();
      if (city === destination) return path;

      visited.add(city);

      for (const next of graph[city] || []) {
        if (!visited.has(next.arrival)) {
          queue.push({
            city: next.arrival,
            path: [...path, next.flightNumber],
            duration: duration + next.duration,
          });
        }
      }

      queue.sort((a, b) => a.duration - b.duration);
    }

    return [];
  }

  getAllDestinationsFromCity(city) {
    const destinations = this.findFlightsByDeparture(city).map(
      (flight) => flight.arrival
    );
    return [...new Set(destinations)];
  }

  hasDirectFlight(start, destination) {
    return this.flights.some(
      (flight) => flight.departure === start && flight.arrival === destination
    );
  }

  getTotalFlightTime(route) {
    let totalDuration = 0;
    for (const flightNumber of route) {
      const duration = this.getFlightDuration(flightNumber);
      if (duration === null) return null;
      totalDuration += duration;
    }
    return totalDuration;
  }
}

module.exports = { FlightScheduler };
