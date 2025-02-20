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
    // Create a dictionary to store the shortest distance from the start to each city
    const distances = { [start]: 0 };
    // Create a dictionary to store the previous city in the shortest path
    const previous = {};
    // Create a set of all unvisited cities
    const unvisited = new Set([start]);
    // Create a dictionary to store the flights that make up the shortest path
    const shortestPathFlights = {};

    while (unvisited.size > 0) {
      // Find the unvisited city with the shortest distance from the start
      let currentCity = null;
      let shortestDistance = Infinity;
      for (const city of unvisited) {
        if (distances[city] < shortestDistance) {
          currentCity = city;
          shortestDistance = distances[city];
        }
      }

      // If the current city is the destination, we've found the shortest path
      if (currentCity === destination) {
        // Build the shortest path by backtracking from the destination to the start
        const path = [];
        while (currentCity !== start) {
          path.push(shortestPathFlights[currentCity]);
          currentCity = previous[currentCity];
        }
        // Return the shortest path in the correct order
        return path.reverse();
      }

      // Mark the current city as visited
      unvisited.delete(currentCity);

      // For each neighbor of the current city that hasn't been visited yet
      for (const flight of this.findFlightsByDeparture(currentCity)) {
        const neighbor = flight.arrival;
        if (!unvisited.has(neighbor)) continue;

        // Calculate the tentative distance from the start to the neighbor
        const distance = distances[currentCity] + flight.duration;

        // If this path is shorter than the current shortest path to the neighbor, update the distances and previous city
        if (!(neighbor in distances) || distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = currentCity;
          shortestPathFlights[neighbor] = flight.flightNumber;
          unvisited.add(neighbor);
        }
      }
    }

    // If we've reached this point, there is no path from the start to the destination
    return [];
  }

  getAllDestinationsFromCity(city) {
    // Find all flights departing from the given city
    const flights = this.findFlightsByDeparture(city);
    // Return a set of all unique destinations
    return [...new Set(flights.map((flight) => flight.arrival))];
  }

  hasDirectFlight(start, destination) {
    // Find all flights departing from the start city
    const flights = this.findFlightsByDeparture(start);
    // Return true if any of these flights arrive at the destination city
    return flights.some((flight) => flight.arrival === destination);
  }

  getTotalFlightTime(route) {
    // Calculate the total duration of the route
    let totalDuration = 0;
    for (const flightNumber of route) {
      const duration = this.getFlightDuration(flightNumber);
      if (duration === null) return null; // If any flight doesn't exist, return null
      totalDuration += duration;
    }
    return totalDuration;
  }
}

module.exports = { FlightScheduler };
