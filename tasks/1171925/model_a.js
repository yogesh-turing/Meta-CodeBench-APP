const R = require("ramda");

class BusScheduleSystem {
  constructor() {
    this.schedules = [];
  }

  // Utility functions

  // Check if the date-time is in 'YYYY-MM-DD HH:mm:ss' format
  isValidDateTime(dateTimeString) {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTimeString);
  }

  // Check if the stop time is in 'HH:mm:ss' format
  isValidStopTime(stopTime) {
    return /^\d{2}:\d{2}:\d{2}$/.test(stopTime);
  }

  // Check if the status is valid
  isValidStatus(status) {
    return ["scheduled", "ongoing", "completed"].includes(status);
  }

  // Function: createBusSchedule
  createBusSchedule({
    scheduleId,
    route,
    busId,
    departureTime,
    arrivalTime,
    stops,
    status,
  }) {
    // Validate inputs
    if (
      !this.isValidDateTime(departureTime) ||
      !this.isValidDateTime(arrivalTime)
    ) {
      throw new Error("Invalid date-time format");
    }
    if (!R.all((stop) => this.isValidStopTime(stop.stopTime), stops)) {
      throw new Error("Invalid stop time format");
    }
    if (!this.isValidStatus(status)) {
      throw new Error("Invalid schedule status");
    }

    // Create the bus schedule
    const schedule = {
      scheduleId,
      route,
      busId,
      departureTime,
      arrivalTime,
      stops,
      status,
    };

    // Store the schedule
    this.schedules.push(schedule);
    return schedule;
  }

  // Function: updateBusSchedule
  updateBusSchedule(scheduleId, updatedDetails) {
    const scheduleIndex = R.findIndex(
      R.propEq("scheduleId", scheduleId),
      this.schedules
    );
    if (scheduleIndex === -1) throw new Error("Schedule not found");

    const existingSchedule = this.schedules[scheduleIndex];

    if (
      updatedDetails.departureTime &&
      !this.isValidDateTime(updatedDetails.departureTime)
    ) {
      throw new Error("Invalid date-time format");
    }
    if (
      updatedDetails.arrivalTime &&
      !this.isValidDateTime(updatedDetails.arrivalTime)
    ) {
      throw new Error("Invalid date-time format");
    }
    if (
      updatedDetails.stops &&
      !R.all(
        (stop) => this.isValidStopTime(stop.stopTime),
        updatedDetails.stops
      )
    ) {
      throw new Error("Invalid stop time format");
    }
    if (updatedDetails.status && !this.isValidStatus(updatedDetails.status)) {
      throw new Error("Invalid schedule status");
    }

    // Merge the updated details into the existing schedule
    const updatedSchedule = R.mergeRight(existingSchedule, updatedDetails);

    // Check if there are any changes
    if (R.equals(existingSchedule, updatedSchedule)) {
      throw new Error("No changes detected");
    }

    // Update the schedule in the array
    this.schedules[scheduleIndex] = updatedSchedule;
    return updatedSchedule;
  }

  // Function: getBusScheduleById
  getBusScheduleById(scheduleId) {
    const schedule = R.find(R.propEq("scheduleId", scheduleId), this.schedules);
    if (!schedule) throw new Error("Schedule not found");
    return schedule;
  }

  // Function: getSchedulesByStatus
  getSchedulesByStatus(status) {
    if (!this.isValidStatus(status)) throw new Error("Invalid schedule status");
    return R.pipe(
      R.filter(R.propEq("status", status)),
      R.sortBy(R.prop("departureTime"))
    )(this.schedules);
  }
}

module.exports = { BusScheduleSystem };