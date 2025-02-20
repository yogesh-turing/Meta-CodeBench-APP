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

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    // Validate time format
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      throw new Error("Invalid time format. Use HH:MM in 24-hour format");
    }

    // Convert UTC time to local business time
    const localTime = this.adjustToTimeZone(time, timeZone);
    const [hours] = localTime.split(':').map(Number);

    // Check business hours
    if (hours < this.businessHourStart || hours >= this.businessHourEnd) {
      throw new Error("Time is outside business hours");
    }

    // Create a unique key for the reservation
    const reservationKey = `${date}-${time}`;

    // Check if the slot is already booked
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

    return true;
  }

  isAvailable(date, time) {
    // Validate inputs
    if (!date || !time) {
      throw new Error("Date and time are required");
    }

    // Check if the slot is already booked
    const reservationKey = `${date}-${time}`;
    return !this.reservations.has(reservationKey);
  }

  adjustToTimeZone(time, timeZone) {
    try {
      // Validate time zone
      if (!moment.tz.zone(timeZone)) {
        throw new Error("Invalid time zone");
      }

      // Create current date with the given time in UTC
      const [hours, minutes] = time.split(':');
      const dateStr = moment.utc().format('YYYY-MM-DD');
      const utcDateTime = moment.utc(`${dateStr} ${hours}:${minutes}`);

      // Convert to target timezone
      const convertedTime = utcDateTime.tz(timeZone);
      return convertedTime.format('HH:mm');

    } catch (error) {
      if (error.message === "Invalid time zone") {
        throw error;
      }
      throw new Error("Error converting time zone");
    }
  }
}

module.exports = { ReservationSystem };