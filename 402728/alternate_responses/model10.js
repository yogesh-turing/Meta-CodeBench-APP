const moment = require('moment-timezone');

class ReservationSystem {
  constructor() {
    this.reservations = {};
  }

  // Method to add a reservation
  reserve(date, time, timeZone) {
    const adjustedTime = this.adjustToTimeZone(time, timeZone);
    const hours = moment(adjustedTime, 'HH:mm').hour();
    if (hours < 8 || hours > 17) {
      throw new Error('Time is outside business hours');
    }

    if (this.isAvailable(date, time)) {
      if (!this.reservations[date]) {
        this.reservations[date] = [];
      }
      this.reservations[date].push(time);
    } else {
      throw new Error('Time slot already booked');
    }
  }

  // Method to check if a time slot is available
  isAvailable(date, time) {
    if (this.reservations[date] && this.reservations[date].includes(time)) {
      return false;
    }
    return true;
  }

  // Method to adjust time to a given time zone
  adjustToTimeZone(time, timeZone) {
    const utcTime = moment.utc(time, 'HH:mm');
    const adjustedTime = utcTime.tz(timeZone).format('HH:mm');
    return adjustedTime;
  }
}

module.exports = { ReservationSystem };