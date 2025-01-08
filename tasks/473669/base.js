const express = require('express');
const _ = require('lodash');
const moment = require('moment');

const app = express();

// Mock Database of available cabs
const cabs = [
  { id: 1, lat: 12.9716, lon: 77.5946, status: 'available' }, // Bangalore
  { id: 2, lat: 19.0760, lon: 72.8777, status: 'available' }, // Mumbai
  { id: 3, lat: 28.7041, lon: 77.1025, status: 'busy' },      // Delhi
  { id: 4, lat: 13.0827, lon: 80.2707, status: 'available' }, // Chennai
];

const userLocation = { lat: 12.9716, lon: 77.5946 }; // Bangalore

// Calculate the distance in kilometers between two lat/lon points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Function to find an available cab
const findAvailableCab = async () => {
  try {
    const availableCabs = cabs.filter(cab => cab.status === 'available');
    if (availableCabs.length === 0) {
      throw new Error('No available cabs at the moment.');
    }

    const cabWithDistance = availableCabs.map(cab => {
      const distance = calculateDistance(userLocation.lat, userLocation.lon, cab.lat, cab.lon);
      return { ...cab, distance };
    });

    // Sort cabs by distance
    cabWithDistance.sort((a, b) => a.distance - b.distance);

    // Simulate an async operation to calculate time to reach
    const timeToReach = await new Promise((resolve, reject) => {
      const timeInMinutes = cabWithDistance[0].distance / 50 * 60; // Assuming average speed 50 km/h
      setTimeout(() => resolve(timeInMinutes), 2000); // Simulating network delay
    });

    // Check if the nearest cab is available within 30 minutes
    if (timeToReach > 30) {
      throw new Error('No cabs available within 30 minutes.');
    }

    return `Cab ${cabWithDistance[0].id} will arrive in ${timeToReach.toFixed(2)} minutes.`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
};

// Start the Express server
app.get('/book-ride', async (req, res) => {
  const result = await findAvailableCab();
  res.send(result);
});

module.exports = {
  app,
  cabs,
  userLocation,
  calculateDistance,
  findAvailableCab
}
