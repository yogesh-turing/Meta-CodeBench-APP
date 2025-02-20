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
    // Create graph representation
    const cities = new Set(
      this.flights.flatMap((f) => [f.departure, f.arrival])
    );
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    const flightPaths = new Map();

    // Initialize distances
    for (const city of cities) {
      distances.set(city, Infinity);
      unvisited.add(city);
    }
    distances.set(start, 0);

    while (unvisited.size > 0) {
      // Find city with minimum distance
      let currentCity = Array.from(unvisited).reduce((a, b) =>
        distances.get(a) < distances.get(b) ? a : b
      );

      if (currentCity === destination) break;

      unvisited.delete(currentCity);

      // Get all flights from current city
      const possibleFlights = this.findFlightsByDeparture(currentCity);

      for (const flight of possibleFlights) {
        const newDistance = distances.get(currentCity) + flight.duration;

        if (newDistance < distances.get(flight.arrival)) {
          distances.set(flight.arrival, newDistance);
          previous.set(flight.arrival, currentCity);
          flightPaths.set(
            `${currentCity}-${flight.arrival}`,
            flight.flightNumber
          );
        }
      }
    }

    // Reconstruct path
    if (!previous.has(destination)) return [];

    const path = [];
    let current = destination;
    while (current !== start) {
      const prev = previous.get(current);
      path.unshift(flightPaths.get(`${prev}-${current}`));
      current = prev;
    }

    return path;
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
