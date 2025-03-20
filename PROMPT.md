Base Code:
```javascript
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
```
Stack Trace:
```javascript
BusScheduleSystem
    createBusSchedule
      ✓ should create a bus schedule successfully (2 ms)
      ✓ should throw error for invalid departureTime format (6 ms)
      ✓ should throw error for invalid stopTime format (1 ms)
      ✓ should throw error for invalid status
    updateBusSchedule
      ✓ should throw error if schedule does not exist
      ✕ should throw error if no changes are detected (9 ms)
      ✕ should update bus schedule successfully and merge details (1 ms)
    getBusScheduleById
      ✕ should return bus schedule by scheduleId
      ✓ should throw error if scheduleId does not exist (1 ms)
    getSchedulesByStatus
      ✕ should return schedules with a specific status
      ✓ should throw error for invalid status (1 ms)

  ● BusScheduleSystem › updateBusSchedule › should throw error if no changes are detected

    expect(received).toThrowError(expected)

    Expected substring: "No changes detected"
    Received message:   "Schedule not found"

          69 |       this.schedules
          70 |     );
        > 71 |     if (scheduleIndex === -1) throw new Error("Schedule not found");
             |                                     ^
          72 |
          73 |     const existingSchedule = this.schedules[scheduleIndex];
          74 |

          at BusScheduleSystem.updateBusSchedule (Solution.js:71:37)
          at updateBusSchedule (WordCloud.test.js:107:19)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:115:10)

      113 |           status: "scheduled", // Same value
      114 |         });
    > 115 |       }).toThrowError("No changes detected");
          |          ^
      116 |     });
      117 |
      118 |     it("should update bus schedule successfully and merge details", () => {

      at Object.toThrowError (WordCloud.test.js:115:10)

  ● BusScheduleSystem › updateBusSchedule › should update bus schedule successfully and merge details

    Schedule not found

      69 |       this.schedules
      70 |     );
    > 71 |     if (scheduleIndex === -1) throw new Error("Schedule not found");
         |                                     ^
      72 |
      73 |     const existingSchedule = this.schedules[scheduleIndex];
      74 |

      at BusScheduleSystem.updateBusSchedule (Solution.js:71:37)
      at Object.updateBusSchedule (WordCloud.test.js:131:41)

  ● BusScheduleSystem › getBusScheduleById › should return bus schedule by scheduleId

    Schedule not found

      102 |   getBusScheduleById(scheduleId) {
      103 |     const schedule = R.find(R.propEq("scheduleId", scheduleId), this.schedules);
    > 104 |     if (!schedule) throw new Error("Schedule not found");
          |                          ^
      105 |     return schedule;
      106 |   }
      107 |

      at BusScheduleSystem.getBusScheduleById (Solution.js:104:26)
      at Object.getBusScheduleById (WordCloud.test.js:156:34)

  ● BusScheduleSystem › getSchedulesByStatus › should return schedules with a specific status

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      192 |
      193 |       const scheduledSchedules = busSystem.getSchedulesByStatus("scheduled");
    > 194 |       expect(scheduledSchedules.length).toBe(1);
          |                                         ^
      195 |       expect(scheduledSchedules[0].scheduleId).toBe("1");
      196 |
      197 |       const completedSchedules = busSystem.getSchedulesByStatus("completed");

      at Object.toBe (WordCloud.test.js:194:41)

Test Suites: 1 failed, 1 total
Tests:       4 failed, 7 passed, 11 total
Snapshots:   0 total
Time:        0.301 s, estimated 1 s
Ran all test suites.
```

Prompt:
Please fix the bugs/errors in the code as per the details below by using Ramda.

Function: `createBusSchedule`
    -   `scheduleId` (string) – Unique identifier for the bus schedule.
    -   `route` (string) – Route name or number (e.g., "Route 101").
    -   `busId` (string) – Unique identifier for the bus assigned to the schedule.
    -   `departureTime` (string) – Time of departure in `'YYYY-MM-DD HH:mm:ss'` format.
    -   `arrivalTime` (string) – Expected arrival time in `'YYYY-MM-DD HH:mm:ss'` format.
    -   `stops` (array) – Array of stops along the route. Each stop is an object containing:
        -   `stopId` (string) – Unique identifier for the stop.
        -   `stopName` (string) – Name of the stop (e.g., "Central Station").
        -   `stopTime` (string) – Time of arrival at the stop in `'HH:mm:ss'` format.
    -   `status` (string) – Status of the schedule (e.g., `'scheduled'`, `'ongoing'`, `'completed'`).
    -   Ensure `departureTime` and `arrivalTime` are valid date-time strings in the format `'YYYY-MM-DD HH:mm:ss'`. If invalid, throw an error: `"Invalid date-time format"`.
    -   Ensure `stops` is an array of stop objects, each containing a valid `stopId`, `stopName`, and `stopTime` (in `'HH:mm:ss'` format).
    -   Ensure `status` is one of `'scheduled'`, `'ongoing'`, or `'completed'`. If invalid, throw an error: `"Invalid schedule status"`.
    -   Store the bus schedule in an array of schedules.



Function: `updateBusSchedule`
    -   `scheduleId` (string) – Unique identifier for the bus schedule to update.
    -   `updatedDetails` (object) – Object containing updated bus schedule details (e.g., `route`, `departureTime`, `arrivalTime`, `stops`, `status`).
    -   If the `scheduleId` does not exist, throw an error: `"Schedule not found"`.
    -   Ensure that the updated details follow the same validation rules as `createBusSchedule`.
    -   If the `updatedDetails` object is identical to the current bus schedule details, throw an error: `"No changes detected"`.
    -   Update the bus schedule details based on the `updatedDetails` provided.

Function: `getBusScheduleById` 
    -   `scheduleId` (string) – Unique identifier for the bus schedule.
    -   If the `scheduleId` does not exist, throw an error: `"Schedule not found"`.
    -   Return the bus schedule details as an object, including:
        -   `scheduleId` (string)
        -   `route` (string)
        -   `busId` (string)
        -   `departureTime` (string)
        -   `arrivalTime` (string)
        -   `stops` (array)
        -   `status` (string)

Function: `getSchedulesByStatus`
    -   `status` (string) – Status of the schedules to retrieve (e.g., `'scheduled'`, `'ongoing'`, `'completed'`).
    -   Return an array of bus schedules that match the given `status`.
    -   The schedules should be sorted by `departureTime` (earliest first).