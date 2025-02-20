const { DateTime } = require("luxon");

class ReservationSystem {
  constructor() {
    this.reservations = new Map();
    this.businessHourStart = 8;
    this.businessHourEnd = 17;
  }

  reserve(date, time, timeZone) {
    if (!date || !time || !timeZone)
      throw new Error("All parameters are required");

    if (
      !this.isValidDate(date) ||
      !this.isValidTime(time) ||
      !this.isValidTimeZone(timeZone)
    ) {
      throw new Error("Invalid input format");
    }

    const localTime = this.adjustToTimeZone(time, timeZone);
    const localHour = parseInt(localTime.split(":")[0], 10);

    if (
      localHour < this.businessHourStart ||
      localHour >= this.businessHourEnd
    ) {
      throw new Error("Time is outside business hours");
    }

    const reservationKey = `${date}-${time}`;
    if (this.reservations.has(reservationKey)) {
      throw new Error("Time slot already booked");
    }

    this.reservations.set(reservationKey, { date, time, timeZone, localTime });
    return true;
  }

  isAvailable(date, time) {
    if (!date || !time) throw new Error("Date and time are required");
    return !this.reservations.has(`${date}-${time}`);
  }

  adjustToTimeZone(time, timeZone) {
    if (!this.isValidTimeZone(timeZone)) throw new Error("Invalid time zone");

    const [hours, minutes] = time.split(":").map(Number);
    const utcDateTime = DateTime.utc().set({ hour: hours, minute: minutes });

    const localTime = utcDateTime.setZone(timeZone);
    if (!localTime.isValid) throw new Error("Error converting time zone");

    return localTime.toFormat("HH:mm");
  }

  isValidDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && DateTime.fromISO(date).isValid;
  }

  isValidTime(time) {
    return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }

  isValidTimeZone(timeZone) {
    return DateTime.local().setZone(timeZone).isValid;
  }
}

module.exports = { ReservationSystem };