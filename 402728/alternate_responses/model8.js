const moment = require('moment-timezone');

class ReservationSystem {
  constructor() {
    this.reservations = {};
  }

  // Method to add a reservation
  reserve(date, time, timeZone) {
    // Convert time to local business hours and store reservation
    const adjustedTime = this.adjustToTimeZone(time, timeZone);
    const reservationDate = `${date} ${adjustedTime}`;
    const momentDate = moment.tz(reservationDate, 'YYYY-MM-DD HH:mm', timeZone);
    const startBusinessHour = moment.tz(`${date} 08:00`, 'YYYY-MM-DD HH:mm', timeZone);
    const endBusinessHour = moment.tz(`${date} 17:00`, 'YYYY-MM-DD HH:mm', timeZone);

    // Check if the time is within business hours
    if (momentDate.isBefore(startBusinessHour) || momentDate.isAfter(endBusinessHour)) {
      throw new Error('Time is outside business hours');
    }

    // Check if the time slot is already booked
    if (this.isReserved(date, adjustedTime)) {
      throw new Error('Time slot already booked');
    }

    // Store the reservation
    this.storeReservation(date, adjustedTime);
  }

  // Method to check if a time slot is available
  isAvailable(date, time) {
    const adjustedTime = this.adjustToTimeZone(time, 'UTC');
    return !this.isReserved(date, adjustedTime);
  }

  // Method to adjust time to a given time zone
  adjustToTimeZone(time, timeZone) {
    const momentTime = moment.tz(time, 'HH:mm', 'UTC');
    const adjustedTime = momentTime.tz(timeZone).format('HH:mm');
    return adjustedTime;
  }

  // Helper method to check if a time slot is already reserved
  isReserved(date, time) {
    if (!this.reservations[date]) {
      return false;
    }
    return this.reservations[date].includes(time);
  }

  // Helper method to store a reservation
  storeReservation(date, time) {
    if (!this.reservations[date]) {
      this.reservations[date] = [];
    }
    this.reservations[date].push(time);
  }
}

module.exports = { ReservationSystem };