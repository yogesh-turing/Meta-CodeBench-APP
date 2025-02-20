const moment = require('moment-timezone');

class ReservationSystem {
  constructor() {
    this.reservations = {};
  }

  // Method to add a reservation
  reserve(date, time, timeZone) {
    const localTime = this.adjustToTimeZone(time, timeZone);
    if (!this.isWithinBusinessHours(localTime)) {
      throw new Error('Time is outside business hours');
    }
    if (this.isBooked(date, localTime)) {
      throw new Error('Time slot already booked');
    }
    this.bookReservation(date, localTime);
  }

  // Method to check if a time slot is available
  isAvailable(date, time) {
    const localTime = this.adjustToTimeZone(time, 'UTC'); // assuming UTC as default time zone
    return !this.isBooked(date, localTime);
  }

  // Method to adjust time to a given time zone
  adjustToTimeZone(time, timeZone) {
    try {
      const momentTime = moment.tz(time, 'HH:mm', timeZone);
      return momentTime.format('HH:mm');
    } catch (error) {
      throw new Error(`Invalid time zone: ${timeZone}`);
    }
  }

  // Helper method to check if a time is within business hours
  isWithinBusinessHours(time) {
    const [hour, minute] = time.split(':').map(Number);
    return hour >= 8 && hour < 17;
  }

  // Helper method to check if a time slot is already booked
  isBooked(date, time) {
    return this.reservations[date] && this.reservations[date].includes(time);
  }

  // Helper method to book a reservation
  bookReservation(date, time) {
    if (!this.reservations[date]) {
      this.reservations[date] = [];
    }
    this.reservations[date].push(time);
  }
}

module.exports = { ReservationSystem };