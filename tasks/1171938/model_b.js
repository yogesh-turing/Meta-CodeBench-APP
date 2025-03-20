const R = require("ramda");

class BusScheduleSystem {
  constructor() {
    this.schedules = [];
  }

  isValidDateTime(dateTimeString) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return R.test(regex, dateTimeString);
  }

  isValidStopTime(stopTime) {
    const regex = /^\d{2}:\d{2}:\d{2}$/;
    return R.test(regex, stopTime);
  }

  isValidStatus(status) {
    const validStatuses = ["scheduled", "ongoing", "completed"];
    return R.includes(status, validStatuses);
  }

  isValidStop(stop) {
    return R.allPass([
      R.has('stopId'),
      R.has('stopName'),
      R.has('stopTime'),
      R.compose(this.isValidStopTime.bind(this), R.prop('stopTime'))
    ])(stop);
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
    if (!this.isValidDateTime(departureTime) || !this.isValidDateTime(arrivalTime)) {
      throw new Error("Invalid date-time format");
    }

    if (!R.is(Array, stops) || !R.all(this.isValidStop.bind(this), stops)) {
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
    const scheduleIndex = R.findIndex(
      R.propEq('scheduleId', scheduleId),
      this.schedules
    );

    if (scheduleIndex === -1) {
      throw new Error("Schedule not found");
    }

    const existingSchedule = this.schedules[scheduleIndex];

    if (updatedDetails.departureTime && !this.isValidDateTime(updatedDetails.departureTime)) {
      throw new Error("Invalid date-time format");
    }

    if (updatedDetails.arrivalTime && !this.isValidDateTime(updatedDetails.arrivalTime)) {
      throw new Error("Invalid date-time format");
    }

    if (updatedDetails.stops && (!R.is(Array, updatedDetails.stops) || 
        !R.all(this.isValidStop.bind(this), updatedDetails.stops))) {
      throw new Error("Invalid stop time format");
    }

    if (updatedDetails.status && !this.isValidStatus(updatedDetails.status)) {
      throw new Error("Invalid schedule status");
    }

    const updatedSchedule = R.mergeRight(existingSchedule, updatedDetails);

    if (R.equals(existingSchedule, updatedSchedule)) {
      throw new Error("No changes detected");
    }

    this.schedules = R.update(scheduleIndex, updatedSchedule, this.schedules);
    return updatedSchedule;
  }

  getBusScheduleById(scheduleId) {
    const schedule = R.find(R.propEq('scheduleId', scheduleId), this.schedules);
    if (R.isNil(schedule)) {
      throw new Error("Schedule not found");
    }
    return schedule;
  }

  getSchedulesByStatus(status) {
    if (!this.isValidStatus(status)) {
      throw new Error("Invalid schedule status");
    }

    return R.pipe(
      R.filter(R.propEq('status', status)),
      R.sortBy(R.prop('departureTime'))
    )(this.schedules);
  }
}

module.exports = { BusScheduleSystem };