const moment = require('moment-timezone');

class ReservationSystem {
  constructor() {
    this.reservations = new Map();
    this.businessHourStart = 8; // 8 AM
    this.businessHourEnd = 17;  // 5 PM
  }

  reserve(date, time, timeZone) {
    // Validate inputs
    if (!date || !time || !timeZone) {
      throw new Error("All parameters are required");
    }

    // Validate date and time format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      throw new Error("Invalid date or time format");
    }

    // Validate time zone
    if (!moment.tz.zone(timeZone)) {
      throw new Error("Invalid time zone");
    }

    // Convert UTC time to local time zone
    const localTime = this.adjustToTimeZone(time, timeZone);
    const [hours] = localTime.split(':').map(Number);

    // Check business hours
    if (hours < this.businessHourStart || hours >= this.businessHourEnd) {
      throw new Error("Time is outside business hours");
    }

    // Create a unique key for the reservation
    const reservationKey = `${date}-${time}`;

    // Check if the time slot is already booked
    if (this.reservations.has(reservationKey)) {
      throw new Error("Time slot already booked");
    }

    // Store the reservation
    this.reservations.set(reservationKey, {
      date,
      time,
      timeZone,
      localTime
    });
  }

  isAvailable(date, time) {
    // Validate inputs
    if (!date || !time) {
      throw new Error("Date and time are required");
    }

    // Validate date and time format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      throw new Error("Invalid date or time format");
    }

    const reservationKey = `${date}-${time}`;
    return !this.reservations.has(reservationKey);
  }

  adjustToTimeZone(time, timeZone) {
    // Validate inputs
    if (!time || !timeZone) {
      throw new Error("Time and time zone are required");
    }

    // Validate time zone
    if (!moment.tz.zone(timeZone)) {
      throw new Error("Invalid time zone");
    }

    // Create a moment object with the current date and the given time in UTC
    const [hours, minutes] = time.split(':').map(Number);
    const utcDate = moment.utc().hours(hours).minutes(minutes);

    // Convert to target timezone
    const convertedTime = utcDate.tz(timeZone);
    
    // Return in HH:MM format
    return convertedTime.format('HH:mm');
  }
}

module.exports = { ReservationSystem };