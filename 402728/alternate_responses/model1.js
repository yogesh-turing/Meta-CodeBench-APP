class ReservationSystem {
  constructor() {
    this.reservations = new Map();
    this.businessHourStart = 8; // 8 AM
    this.businessHourEnd = 17;  // 5 PM
  }

  // Helper method to validate time format
  validateTimeFormat(time) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      throw new Error("Invalid time format. Use HH:MM format");
    }
  }

  // Helper method to validate date format
  validateDateFormat(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD format");
    }
  }

  // Helper method to check if time is within business hours
  isWithinBusinessHours(time, timeZone) {
    const [hours] = this.adjustToTimeZone(time, timeZone).split(':').map(Number);
    return hours >= this.businessHourStart && hours < this.businessHourEnd;
  }

  // Method to adjust time to a given time zone
  adjustToTimeZone(time, timeZone) {
    try {
      this.validateTimeFormat(time);
      const [hours, minutes] = time.split(':').map(Number);
      
      // Create date object for current date in UTC
      const date = new Date();
      date.setUTCHours(hours, minutes, 0, 0);

      // Format the time in the target timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return formatter.format(date).replace(/\u202f/g, '');
    } catch (error) {
      if (error.toString().includes('Invalid time zone')) {
        throw new Error(`Invalid time zone: ${timeZone}`);
      }
      throw error;
    }
  }

  // Method to check if a time slot is available
  isAvailable(date, time) {
    this.validateDateFormat(date);
    this.validateTimeFormat(time);
    
    const key = `${date}-${time}`;
    return !this.reservations.has(key);
  }

  // Method to add a reservation
  reserve(date, time, timeZone) {
    this.validateDateFormat(date);
    this.validateTimeFormat(time);

    if (!this.isWithinBusinessHours(time, timeZone)) {
      throw new Error("Time is outside business hours");
    }

    const key = `${date}-${time}`;
    
    if (!this.isAvailable(date, time)) {
      throw new Error("Time slot already booked");
    }

    this.reservations.set(key, {
      date,
      time,
      timeZone,
      localTime: this.adjustToTimeZone(time, timeZone)
    });

    return true;
  }
}

module.exports = { ReservationSystem };