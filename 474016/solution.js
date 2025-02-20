class FlightScheduler {
  constructor() {
    // We store flights in one Map.
    // For each departure city, we keep an array of flights.
    // Also, each flight is stored by its flight number for quick lookup.
    this.flights = new Map();
  }

  addFlight(flightNumber, departure, arrival, duration) {
    // Validate input types and values.
    if (
      typeof flightNumber !== "string" ||
      typeof departure !== "string" ||
      typeof arrival !== "string" ||
      typeof duration !== "number" ||
      duration <= 0
    ) {
      throw new Error("Invalid flight data");
    }

    flightNumber = flightNumber.trim();
    departure = departure.trim().toUpperCase();
    arrival = arrival.trim().toUpperCase();

    const cityRegex = /^[A-Za-z]+$/;
    if (!cityRegex.test(departure) || !cityRegex.test(arrival)) {
      throw new Error("City names must contain only letters");
    }
    if (!flightNumber) {
      throw new Error("Flight number cannot be empty");
    }

    // Flight numbers must be unique.
    if (this.flights.has(flightNumber)) {
      throw new Error("Flight number must be unique");
    }

    // Store flight in the “by departure” part.
    if (!this.flights.has(departure)) {
      this.flights.set(departure, []);
    }
    this.flights.get(departure).push({ flightNumber, arrival, duration });

    // Also store the flight by its flight number for quick lookup.
    this.flights.set(flightNumber, { departure, arrival, duration });
  }

  findFlightsByDeparture(departure) {
    if (typeof departure !== "string")
      throw new Error("Invalid departure city");
    departure = departure.trim().toUpperCase();
    return this.flights.get(departure) || [];
  }

  getFlightDuration(flightNumber) {
    if (typeof flightNumber !== "string")
      throw new Error("Invalid flight number");
    const flight = this.flights.get(flightNumber);
    return flight ? flight.duration : null;
  }

  hasDirectFlight(start, destination) {
    if (typeof start !== "string" || typeof destination !== "string")
      throw new Error("Invalid city names");
    start = start.trim().toUpperCase();
    destination = destination.trim().toUpperCase();

    // Look up all flights from start and filter those arriving at destination.
    const directFlights = (this.flights.get(start) || []).filter(
      (f) => f.arrival === destination
    );
    return directFlights.length > 0;
  }

  getAllDestinationsFromCity(city) {
    if (typeof city !== "string") throw new Error("Invalid city name");
    city = city.trim().toUpperCase();
    const flights = this.flights.get(city) || [];
    const destinations = flights.map((f) => f.arrival);
    return [...new Set(destinations)];
  }

  getTotalFlightTime(route) {
    if (!Array.isArray(route)) throw new Error("Route must be an array");
    let total = 0;
    for (const flightNumber of route) {
      const flight = this.flights.get(flightNumber);
      if (!flight) return null;
      total += flight.duration;
    }
    return total;
  }

  /* 
      findShortestRoute:
      • We first build an undirected graph from the flights.
        For every flight A → B, we add an edge A→B and also a “reverse” edge B→A
        (using the same flight number and duration). This lets us “flip” a flight if needed.
      • We then perform a breadth-first search (BFS) so that we favor routes with fewer flights.
      • If more than one route uses the same number of legs, we pick the one with the least total duration.
    */
  findShortestRoute(start, destination) {
    if (typeof start !== "string" || typeof destination !== "string")
      throw new Error("Invalid city names");

    start = start.trim().toUpperCase();
    destination = destination.trim().toUpperCase();
    if (start === destination) return [];

    // Build an undirected graph.
    // Each key is a city; each value is an array of edge objects:
    // { flightNumber, neighbor, duration }
    const graph = new Map();
    for (const [key, value] of this.flights.entries()) {
      // Only process keys that represent departure cities (stored as arrays)
      if (Array.isArray(value)) {
        // key is a departure city; value is an array of flights from that city.
        for (const flight of value) {
          // Add edge from departure to arrival.
          if (!graph.has(key)) graph.set(key, []);
          graph.get(key).push({
            flightNumber: flight.flightNumber,
            neighbor: flight.arrival,
            duration: flight.duration,
          });
          // Also add the reverse edge from arrival to departure.
          if (!graph.has(flight.arrival)) graph.set(flight.arrival, []);
          graph.get(flight.arrival).push({
            flightNumber: flight.flightNumber,
            neighbor: key,
            duration: flight.duration,
          });
        }
      }
    }

    // We'll use BFS where each node in the queue includes:
    // { city, route (an array of flightNumbers), totalTime, visited (set of cities) }
    let queue = [
      { city: start, route: [], totalTime: 0, visited: new Set([start]) },
    ];
    let foundRoutes = [];
    let foundLevel = Infinity;
    let level = 0;

    while (queue.length > 0) {
      let nextQueue = [];
      level++;
      for (const node of queue) {
        const { city, route, totalTime, visited } = node;
        const neighbors = graph.get(city) || [];
        for (const edge of neighbors) {
          const nextCity = edge.neighbor;
          if (visited.has(nextCity)) continue; // avoid cycles
          const newRoute = route.concat(edge.flightNumber);
          const newTime = totalTime + edge.duration;
          const newVisited = new Set(visited);
          newVisited.add(nextCity);
          if (nextCity === destination) {
            foundRoutes.push({ route: newRoute, totalTime: newTime });
            foundLevel = level;
          } else if (level < foundLevel) {
            nextQueue.push({
              city: nextCity,
              route: newRoute,
              totalTime: newTime,
              visited: newVisited,
            });
          }
        }
      }
      if (foundRoutes.length > 0) break;
      queue = nextQueue;
    }

    if (foundRoutes.length === 0) return [];
    // Choose the route (among those with the fewest legs) that has the least total time.
    let best = foundRoutes[0];
    for (const r of foundRoutes) {
      if (r.totalTime < best.totalTime) {
        best = r;
      }
    }
    return best.route;
  }
}

module.exports = { FlightScheduler };
