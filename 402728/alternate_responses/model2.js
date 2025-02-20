class ReservationSystem {
  constructor() {
    this.reservations = new Map();
    this.businessHourStart = 8; // 8 AM
    this.businessHourEnd = 17;  // 5 PM
  }

  reserve(date, time, timeZone) {
    // Validate inputs
    this._validateInputs(date, time, timeZone);
    
    // Check if the time slot is already booked
    if (!this.isAvailable(date, time)) {
      throw new Error("Time slot already booked");
    }

    // Convert UTC time to target timezone to check business hours
    const localTime = this.adjustToTimeZone(time, timeZone);
    const [hours] = localTime.split(':').map(Number);
    
    // Check if the time is within business hours
    if (hours < this.businessHourStart || hours >= this.businessHourEnd) {
      throw new Error("Time is outside business hours");
    }

    // Store the reservation using a composite key
    const key = `${date}-${time}`;
    this.reservations.set(key, true);
    
    return true;
  }

  isAvailable(date, time) {
    this._validateDateTime(date, time);
    const key = `${date}-${time}`;
    return !this.reservations.has(key);
  }

  adjustToTimeZone(time, timeZone) {
    this._validateTime(time);
    this._validateTimeZone(timeZone);

    // Create a date object with the current date and given time in UTC
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);

    // Convert to target timezone
    try {
      const targetTime = date.toLocaleString('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Format the time to HH:MM
      return targetTime.replace(/^24:/, '00:');
    } catch (error) {
      throw new Error("Invalid time zone conversion");
    }
  }

  _validateInputs(date, time, timeZone) {
    this._validateDateTime(date, time);
    this._validateTimeZone(timeZone);
  }

  _validateDateTime(date, time) {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    this._validateTime(time);

    // Validate date is valid
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
  }

  _validateTime(time) {
    // Validate time format
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      throw new Error("Invalid time format. Use HH:MM in 24-hour format");
    }
  }

  _validateTimeZone(timeZone) {
    try {
      Intl.DateTimeFormat(undefined, { timeZone });
    } catch (error) {
      throw new Error("Invalid time zone");
    }
  }
}

module.exports = { ReservationSystem };