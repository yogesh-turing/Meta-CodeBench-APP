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
    this.flights.forEach((flight) => {
      if (!graph[flight.departure]) {
        graph[flight.departure] = [];
      }
      graph[flight.departure].push({
        arrival: flight.arrival,
        flightNumber: flight.flightNumber,
        duration: flight.duration,
      });
    });

    const shortestRoute = (start, destination, visited = new Set()) => {
      if (start === destination) {
        return { route: [], duration: 0 };
      }
      if (visited.has(start)) {
        return { route: null, duration: Infinity };
      }
      visited.add(start);

      let shortest = { route: null, duration: Infinity };
      if (graph[start]) {
        graph[start].forEach((neighbor) => {
          const result = shortestRoute(neighbor.arrival, destination, visited);
          if (
            result.route !== null &&
            result.duration + neighbor.duration < shortest.duration
          ) {
            shortest = {
              route: [neighbor.flightNumber, ...result.route],
              duration: result.duration + neighbor.duration,
            };
          }
        });
      }
      visited.delete(start);
      return shortest;
    };

    const result = shortestRoute(start, destination);
    return result.route !== null ? result.route : [];
  }

  getAllDestinationsFromCity(city) {
    return [
      ...new Set(
        this.flights
          .filter((flight) => flight.departure === city)
          .map((flight) => flight.arrival)
      ),
    ];
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
      if (duration === null) {
        return null;
      }
      totalDuration += duration;
    }
    return totalDuration;
  }
}

module.exports = { FlightScheduler };
