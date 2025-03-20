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

  isValidStop(stop) {
    return (
      R.is(Object, stop) &&
      R.has("stopId", stop) &&
      R.has("stopName", stop) &&
      R.has("stopTime", stop) &&
      this.isValidStopTime(stop.stopTime)
    );
  }

  createBusSchedule({
    scheduleId,
    route,
    busId,
    departureTime,
    arrivalTime,
    stops,
    status,
  }) {
    if (
      !this.isValidDateTime(departureTime) ||
      !this.isValidDateTime(arrivalTime)
    ) {
      throw new Error("Invalid date-time format");
    }

    if (!Array.isArray(stops) || !R.all(this.isValidStop.bind(this), stops)) {
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

    this.schedules = R.append(schedule, this.schedules);
    return schedule;
  }

  updateBusSchedule(scheduleId, updatedDetails) {
    const schedule = R.find(R.propEq("scheduleId", scheduleId), this.schedules);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    if (updatedDetails.departureTime && !this.isValidDateTime(updatedDetails.departureTime)) {
      throw new Error("Invalid date-time format");
    }

    if (updatedDetails.arrivalTime && !this.isValidDateTime(updatedDetails.arrivalTime)) {
      throw new Error("Invalid date-time format");
    }

    if (updatedDetails.stops && (!Array.isArray(updatedDetails.stops) || 
        !R.all(this.isValidStop.bind(this), updatedDetails.stops))) {
      throw new Error("Invalid stop time format");
    }

    if (updatedDetails.status && !this.isValidStatus(updatedDetails.status)) {
      throw new Error("Invalid schedule status");
    }

    const updatedSchedule = R.mergeRight(schedule, updatedDetails);

    if (R.equals(schedule, updatedSchedule)) {
      throw new Error("No changes detected");
    }

    this.schedules = R.map(
      s => s.scheduleId === scheduleId ? updatedSchedule : s,
      this.schedules
    );

    return updatedSchedule;
  }

  getBusScheduleById(scheduleId) {
    const schedule = R.find(R.propEq("scheduleId", scheduleId), this.schedules);
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    return schedule;
  }

  getSchedulesByStatus(status) {
    if (!this.isValidStatus(status)) {
      throw new Error("Invalid schedule status");
    }
    return R.pipe(
      R.filter(R.propEq("status", status)),
      R.sortBy(R.prop("departureTime"))
    )(this.schedules);
  }
}

module.exports = { BusScheduleSystem };