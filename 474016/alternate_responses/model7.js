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
    const visited = new Set();
    const queue = [[start, []]];

    while (queue.length > 0) {
      const [currentCity, currentRoute] = queue.shift();

      if (currentCity === destination) {
        return currentRoute;
      }

      if (visited.has(currentCity)) {
        continue;
      }

      visited.add(currentCity);

      const flightsFromCurrentCity = this.findFlightsByDeparture(currentCity);

      for (const flight of flightsFromCurrentCity) {
        queue.push([flight.arrival, [...currentRoute, flight.flightNumber]]);
      }
    }

    return [];
  }

  getAllDestinationsFromCity(city) {
    const destinations = new Set();

    for (const flight of this.flights) {
      if (flight.departure === city) {
        destinations.add(flight.arrival);
      }
    }

    return Array.from(destinations);
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
