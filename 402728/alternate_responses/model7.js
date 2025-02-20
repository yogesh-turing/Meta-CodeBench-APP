const moment = require('moment-timezone');

class ReservationSystem {
  constructor() {
    this.reservations = {};
  }

  // Method to add a reservation
  reserve(date, time, timeZone) {
    const adjustedTime = this.adjustToTimeZone(time, timeZone);
    if (!this.isWithinBusinessHours(adjustedTime)) {
      throw new Error('Time is outside business hours');
    }
    if (this.isBooked(date, adjustedTime)) {
      throw new Error('Time slot already booked');
    }
    if (!this.reservations[date]) {
      this.reservations[date] = {};
    }
    this.reservations[date][adjustedTime] = true;
  }

  // Method to check if a time slot is available
  isAvailable(date, time) {
    const adjustedTime = this.adjustToTimeZone(time, 'UTC');
    return !this.isBooked(date, adjustedTime);
  }

  // Method to adjust time to a given time zone
  adjustToTimeZone(time, timeZone) {
    const momentTime = moment.utc(`${moment().format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');
    if (!momentTime.tz(timeZone).isValid()) {
      throw new Error('Invalid time zone');
    }
    return momentTime.tz(timeZone).format('HH:mm');
  }

  // Helper method to check if time is within business hours
  isWithinBusinessHours(time) {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 8 && hour < 17;
  }

  // Helper method to check if time slot is already booked
  isBooked(date, time) {
    return this.reservations[date] && this.reservations[date][time];
  }
}

module.exports = { ReservationSystem };