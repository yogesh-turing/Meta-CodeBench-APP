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
    // Initialize data structures for Dijkstra's algorithm
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    const flightPaths = new Map();

    // Initialize all cities from flights
    this.flights.forEach((flight) => {
      unvisited.add(flight.departure);
      unvisited.add(flight.arrival);
      if (!distances.has(flight.departure)) {
        distances.set(flight.departure, Infinity);
        flightPaths.set(flight.departure, []);
      }
    });

    distances.set(start, 0);

    while (unvisited.size > 0) {
      // Find the unvisited city with minimum distance
      let current = null;
      let minDistance = Infinity;
      for (const city of unvisited) {
        if (distances.get(city) < minDistance) {
          minDistance = distances.get(city);
          current = city;
        }
      }

      if (current === null || current === destination) break;

      unvisited.delete(current);

      // Check all flights from current city
      const possibleFlights = this.findFlightsByDeparture(current);
      for (const flight of possibleFlights) {
        const newDistance = distances.get(current) + flight.duration;
        if (newDistance < (distances.get(flight.arrival) || Infinity)) {
          distances.set(flight.arrival, newDistance);
          previous.set(flight.arrival, current);
          const currentPath = [...flightPaths.get(current)];
          currentPath.push(flight.flightNumber);
          flightPaths.set(flight.arrival, currentPath);
        }
      }
    }

    return flightPaths.get(destination) || [];
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
      if (duration === null) return null;
      totalDuration += duration;
    }
    return totalDuration;
  }
}

module.exports = { FlightScheduler };
