const moment = require('moment-timezone');

class ReservationSystem {
  constructor() {
    this.reservations = {};
  }

  // Method to add a reservation
  reserve(date, time, timeZone) {
    const localTime = this.adjustToTimeZone(time, timeZone);
    if (!this.isWithinBusinessHours(localTime)) {
      throw new Error("Time is outside business hours");
    }

    if (this.isBooked(date, localTime)) {
      throw new Error("Time slot already booked");
    }

    if (!this.reservations[date]) {
      this.reservations[date] = [];
    }

    this.reservations[date].push(localTime);
  }

  // Method to check if a time slot is available
  isAvailable(date, time) {
    const localTime = this.adjustToTimeZone(time, 'UTC');
    return !this.isBooked(date, localTime);
  }

  // Method to check if a time slot is already booked
  isBooked(date, time) {
    if (!this.reservations[date]) {
      return false;
    }

    return this.reservations[date].includes(time);
  }

  // Method to check if a time is within business hours
  isWithinBusinessHours(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 8 && hours < 17;
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
}

module.exports = { ReservationSystem };