const R = require("ramda");

class BusScheduleSystem {
  constructor() {
    this.schedules = [];
  }

  isValidDateTime(dateTimeString) {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTimeString);
  }

  isValidStopTime(stopTime) {
    return /^\d{2}:\d{2}:\d{2}$/.test(stopTime);
  }

  isValidStatus(status) {
    return ["scheduled", "ongoing", "completed"].includes(status);
  }

  createBusSchedule({ scheduleId, route, busId, departureTime, arrivalTime, stops, status }) {
    if (!this.isValidDateTime(departureTime) || !this.isValidDateTime(arrivalTime)) {
      throw new Error("Invalid date-time format");
    }
    if (!R.all((stop) => this.isValidStopTime(stop.stopTime), stops)) {
      throw new Error("Invalid stop time format");
    }
    if (!this.isValidStatus(status)) {
      throw new Error("Invalid schedule status");
    }

    const schedule = {
      scheduleId,
      route,
      busId,
      departureTime,
      arrivalTime,
      stops,
      status,
    };

    this.schedules.push(schedule);
    return schedule;
  }

  updateBusSchedule(scheduleId, updatedDetails) {
    const scheduleIndex = R.findIndex(R.propEq('scheduleId', scheduleId), this.schedules);
    if (scheduleIndex === -1) throw new Error("Schedule not found");

    const existingSchedule = this.schedules[scheduleIndex];

    if (updatedDetails.stops && !R.all((stop) => this.isValidStopTime(stop.stopTime), updatedDetails.stops)) {
      throw new Error("Invalid stop time format");
    }
    if (updatedDetails.status && !this.isValidStatus(updatedDetails.status)) {
      throw new Error("Invalid schedule status");
    }

    const updatedSchedule = R.mergeRight(existingSchedule, updatedDetails);

    if (R.equals(existingSchedule, updatedSchedule)) {
      throw new Error("No changes detected");
    }

    this.schedules[scheduleIndex] = updatedSchedule;
    return updatedSchedule;
  }

  getBusScheduleById(scheduleId) {
    const schedule = R.find(R.propEq('scheduleId', scheduleId), this.schedules);
    if (!schedule) throw new Error("Schedule not found");
    return schedule;
  }

  getSchedulesByStatus(status) {
    if (!this.isValidStatus(status)) throw new Error("Invalid schedule status");
    return R.pipe(
      R.filter(R.propEq('status', status)),
      R.sortBy(R.prop('departureTime'))
    )(this.schedules);
  }
}

module.exports = { BusScheduleSystem };