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
    const cities = new Set(
      this.flights.flatMap((f) => [f.departure, f.arrival])
    );
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    for (const city of cities) {
      distances.set(city, Infinity);
      unvisited.add(city);
    }
    distances.set(start, 0);

    while (unvisited.size > 0) {
      // Find minimum distance city
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
        const alt = distances.get(current) + flight.duration;
        if (alt < distances.get(flight.arrival)) {
          distances.set(flight.arrival, alt);
          previous.set(flight.arrival, current);
        }
      }
    }

    // Reconstruct path
    if (!previous.has(destination)) return [];

    const path = [];
    let current = destination;
    while (current !== start) {
      const prev = previous.get(current);
      const flight = this.flights.find(
        (f) => f.departure === prev && f.arrival === current
      );
      path.unshift(flight.flightNumber);
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
    let total = 0;
    for (const flightNumber of route) {
      const duration = this.getFlightDuration(flightNumber);
      if (duration === null) return null;
      total += duration;
    }
    return total;
  }
}

module.exports = { FlightScheduler };
