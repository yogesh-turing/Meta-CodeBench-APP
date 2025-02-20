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
    let shortestRoute = null;
    let shortestDuration = Infinity;

    while (queue.length > 0) {
      const [currentCity, currentRoute] = queue.shift();

      if (currentCity === destination) {
        const routeDuration = this.getTotalFlightTime(currentRoute);
        if (routeDuration < shortestDuration) {
          shortestRoute = currentRoute;
          shortestDuration = routeDuration;
        }
      }

      if (visited.has(currentCity)) {
        continue;
      }

      visited.add(currentCity);

      const flightsFromCity = this.findFlightsByDeparture(currentCity);
      for (const flight of flightsFromCity) {
        queue.push([flight.arrival, [...currentRoute, flight.flightNumber]]);
      }
    }

    return shortestRoute || [];
  }

  getAllDestinationsFromCity(city) {
    const destinations = new Set();
    const flightsFromCity = this.findFlightsByDeparture(city);
    for (const flight of flightsFromCity) {
      destinations.add(flight.arrival);
    }
    return Array.from(destinations);
  }

  hasDirectFlight(start, destination) {
    return this.findFlightsByDeparture(start).some(
      (flight) => flight.arrival === destination
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
