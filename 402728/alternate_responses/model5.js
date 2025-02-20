class ReservationSystem {
  constructor() {
    this.reservations = new Map();
    this.businessHourStart = "08:00";
    this.businessHourEnd = "17:00";
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

    // Convert UTC time to local time zone
    const localTime = this.adjustToTimeZone(time, timeZone);
    
    // Check if time is within business hours
    if (!this.isWithinBusinessHours(localTime)) {
      throw new Error("Time is outside business hours");
    }

    // Check availability
    if (!this.isAvailable(date, time)) {
      throw new Error("Time slot already booked");
    }

    // Store reservation using composite key
    const key = `${date}-${time}`;
    this.reservations.set(key, { date, time, timeZone });
    
    return true;
  }

  isAvailable(date, time) {
    const key = `${date}-${time}`;
    return !this.reservations.has(key);
  }

  adjustToTimeZone(time, timeZone) {
    try {
      // Create a date object for today with the given time in UTC
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      // Format the time in the target timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return formatter.format(date).replace(/^24:/, '00:');
    } catch (error) {
      throw new Error("Invalid time zone");
    }
  }

  isWithinBusinessHours(time) {
    return time >= this.businessHourStart && time <= this.businessHourEnd;
  }
}

module.exports = { ReservationSystem };