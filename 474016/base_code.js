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

  // TODO: Implement the following methods
  findShortestRoute(start, destination) {
    // Find the shortest route (based on duration) between start and destination
  }

  getAllDestinationsFromCity(city) {
    // Return a list of all unique cities reachable directly from the given city
  }

  hasDirectFlight(start, destination) {
    // Return true if there is a direct flight from start to destination, false otherwise
  }

  getTotalFlightTime(route) {
    // Given an array of flight numbers, return the total duration of that route
  }
}
module.exports = { FlightScheduler };
