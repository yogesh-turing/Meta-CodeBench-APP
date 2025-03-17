Base Code:
```javascript
const moment = require("moment");
const S = require("sanctuary");

class ProjectManagement {
  constructor() {
    this.tasks = {};
    this.milestones = {};
    this.users = {};
  }

  addTaskDependency(taskId, dependencyId) {
    if (!S.is(String)(taskId) || !S.is(String)(dependencyId)) {
      throw new Error("Invalid data");
    }

    if (!this.tasks[taskId] || !this.tasks[dependencyId]) {
      throw new Error("Task or Dependency not found");
    }

    if (taskId === dependencyId) {
      throw new Error("Task cannot depend on itself");
    }

    if (this.isCircularDependency(taskId, dependencyId)) {
      throw new Error("Circular dependency detected");
    }

    if (!this.tasks[taskId].dependencies) {
      this.tasks[taskId].dependencies = [];
    }
    this.tasks[taskId].dependencies.push(dependencyId);
  }

  isCircularDependency(taskId, dependencyId, visited = new Set()) {
    if (visited.has(dependencyId)) {
      return true;
    }

    visited.add(dependencyId);
    const dependencies = this.tasks[dependencyId]?.dependencies || [];

    for (const dep of dependencies) {
      if (dep === taskId || this.isCircularDependency(taskId, dep, visited)) {
        return true;
      }
    }
    return false;
  }

  createMilestone(milestoneId, title, dueDate) {
    if (
      !S.is(String)(milestoneId) ||
      !S.is(String)(title) ||
      !S.is(String)(dueDate)
    ) {
      throw new Error("Invalid data");
    }

    if (this.milestones[milestoneId]) {
      throw new Error("Milestone already exists");
    }

    if (!moment(dueDate, "YYYY-MM-DD", true).isValid()) {
      throw new Error("Invalid date format");
    }

    if (moment(dueDate).isBefore(moment(), "day")) {
      throw new Error("Milestone due date cannot be in the past");
    }

    this.milestones[milestoneId] = {
      title,
      dueDate,
      tasks: [],
    };
  }

  trackTime(taskId, startTime, endTime) {
    if (
      !S.is(String)(taskId) ||
      !S.is(String)(startTime) ||
      !S.is(String)(endTime)
    ) {
      throw new Error("Invalid data");
    }

    if (!this.tasks[taskId]) {
      throw new Error("Task not found");
    }

    if (
      !moment(startTime, "YYYY-MM-DD HH:mm", true).isValid() ||
      !moment(endTime, "YYYY-MM-DD HH:mm", true).isValid()
    ) {
      throw new Error("Invalid time format");
    }

    const startMoment = moment(startTime);
    const endMoment = moment(endTime);
    const currentMoment = moment();

    if (startMoment.isAfter(currentMoment)) {
      throw new Error("Start time cannot be in future");
    }

    if (startMoment.isAfter(endMoment)) {
      throw new Error("Start time must be before end time");
    }

    const timeSpent = endMoment.diff(startMoment, "minutes");

    if (!this.tasks[taskId].timeEntries) {
      this.tasks[taskId].timeEntries = [];
    }

    this.tasks[taskId].timeEntries.push({
      startTime,
      endTime,
      timeSpent,
    });
  }
}

module.exports = { ProjectManagement };

```

Stack Trace:
```javascript
ProjectManagement
    addTaskDependency
      ✕ should throw an error if taskId or dependencyId is not a string (22 ms)
      ✕ should throw an error if taskId and dependencyId are same , (2 ms)
      ✕ should throw an error if taskId or dependencyId does not exist (1 ms)
      ✕ should throw an error for circular dependencies
      ✕ should add a dependency correctly
    createMilestone
      ✕ should throw an error if milestoneId already exists
      ✕ should throw an error if dueDate is in the past (2 ms)
      ✕ should throw an error if date format is invalid (1 ms)
      ✕ should create a milestone successfully
    trackTime
      ✕ should throw an error if taskId does not exist (1 ms)
      ✕ should throw an error if startTime or endTime is in the wrong format (1 ms)
      ✕ should throw an error if startTime is in the future (3 ms)
      ✕ should throw an error if startTime is after endTime (2 ms)
      ✕ should track time in minutes successfully 

  ● ProjectManagement › addTaskDependency › should throw an error if taskId or dependencyId is not a string

    expect(received).toThrow(expected)

    Expected substring: "Invalid data"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          10 |
          11 |   addTaskDependency(taskId, dependencyId) {
        > 12 |     if (!S.is(String)(taskId) || !S.is(String)(dependencyId)) {
             |            ^
          13 |       throw new Error("Invalid data");
          14 |     }
          15 |

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as addTaskDependency] (Solution.js:12:12)
          at addTaskDependency (WordCloud.test.js:19:23)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:19:54)

      17 |   describe("addTaskDependency", () => {
      18 |     it("should throw an error if taskId or dependencyId is not a string", () => {
    > 19 |       expect(() => pm.addTaskDependency(1, "task2")).toThrow("Invalid data");
         |                                                      ^
      20 |       expect(() => pm.addTaskDependency("task1", 2)).toThrow("Invalid data");
      21 |     });
      22 |

      at Object.toThrow (WordCloud.test.js:19:54)

  ● ProjectManagement › addTaskDependency › should throw an error if taskId and dependencyId are same ,

    expect(received).toThrow(expected)

    Expected substring: "Task cannot depend on itself"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          10 |
          11 |   addTaskDependency(taskId, dependencyId) {
        > 12 |     if (!S.is(String)(taskId) || !S.is(String)(dependencyId)) {
             |            ^
          13 |       throw new Error("Invalid data");
          14 |     }
          15 |

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as addTaskDependency] (Solution.js:12:12)
          at addTaskDependency (WordCloud.test.js:24:23)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:24:60)

      22 |
      23 |     it("should throw an error if taskId and dependencyId are same ,", () => {
    > 24 |       expect(() => pm.addTaskDependency("task2", "task2")).toThrow(
         |                                                            ^
      25 |         "Task cannot depend on itself"
      26 |       );
      27 |     });

      at Object.toThrow (WordCloud.test.js:24:60)

  ● ProjectManagement › addTaskDependency › should throw an error if taskId or dependencyId does not exist

    expect(received).toThrow(expected)

    Expected substring: "Task or Dependency not found"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          10 |
          11 |   addTaskDependency(taskId, dependencyId) {
        > 12 |     if (!S.is(String)(taskId) || !S.is(String)(dependencyId)) {
             |            ^
          13 |       throw new Error("Invalid data");
          14 |     }
          15 |

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as addTaskDependency] (Solution.js:12:12)
          at addTaskDependency (WordCloud.test.js:30:23)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:30:60)

      28 |
      29 |     it("should throw an error if taskId or dependencyId does not exist", () => {
    > 30 |       expect(() => pm.addTaskDependency("task1", "task4")).toThrow(
         |                                                            ^
      31 |         "Task or Dependency not found"
      32 |       );
      33 |       expect(() => pm.addTaskDependency("task5", "task2")).toThrow(

      at Object.toThrow (WordCloud.test.js:30:60)

  ● ProjectManagement › addTaskDependency › should throw an error for circular dependencies

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function String() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      10 |
      11 |   addTaskDependency(taskId, dependencyId) {
    > 12 |     if (!S.is(String)(taskId) || !S.is(String)(dependencyId)) {
         |            ^
      13 |       throw new Error("Invalid data");
      14 |     }
      15 |

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at ProjectManagement.is [as addTaskDependency] (Solution.js:12:12)
      at Object.addTaskDependency (WordCloud.test.js:39:10)

  ● ProjectManagement › addTaskDependency › should add a dependency correctly

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function String() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      10 |
      11 |   addTaskDependency(taskId, dependencyId) {
    > 12 |     if (!S.is(String)(taskId) || !S.is(String)(dependencyId)) {
         |            ^
      13 |       throw new Error("Invalid data");
      14 |     }
      15 |

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at ProjectManagement.is [as addTaskDependency] (Solution.js:12:12)
      at Object.addTaskDependency (WordCloud.test.js:47:10)

  ● ProjectManagement › createMilestone › should throw an error if milestoneId already exists

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function String() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      50 |   createMilestone(milestoneId, title, dueDate) {
      51 |     if (
    > 52 |       !S.is(String)(milestoneId) ||
         |          ^
      53 |       !S.is(String)(title) ||
      54 |       !S.is(String)(dueDate)
      55 |     ) {

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at ProjectManagement.is [as createMilestone] (Solution.js:52:10)
      at Object.createMilestone (WordCloud.test.js:54:10)

  ● ProjectManagement › createMilestone › should throw an error if dueDate is in the past

    expect(received).toThrow(expected)

    Expected substring: "Milestone due date cannot be in the past"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          50 |   createMilestone(milestoneId, title, dueDate) {
          51 |     if (
        > 52 |       !S.is(String)(milestoneId) ||
             |          ^
          53 |       !S.is(String)(title) ||
          54 |       !S.is(String)(dueDate)
          55 |     ) {

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as createMilestone] (Solution.js:52:10)
          at createMilestone (WordCloud.test.js:62:12)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:63:9)

      61 |       expect(() =>
      62 |         pm.createMilestone("milestone1", "Milestone 1", "2020-05-01")
    > 63 |       ).toThrow("Milestone due date cannot be in the past");
         |         ^
      64 |     });
      65 |
      66 |     it("should throw an error if date format is invalid", () => {

      at Object.toThrow (WordCloud.test.js:63:9)

  ● ProjectManagement › createMilestone › should throw an error if date format is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid date format"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          50 |   createMilestone(milestoneId, title, dueDate) {
          51 |     if (
        > 52 |       !S.is(String)(milestoneId) ||
             |          ^
          53 |       !S.is(String)(title) ||
          54 |       !S.is(String)(dueDate)
          55 |     ) {

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as createMilestone] (Solution.js:52:10)
          at createMilestone (WordCloud.test.js:68:12)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:69:9)

      67 |       expect(() =>
      68 |         pm.createMilestone("milestone1", "Milestone 1", "2025-05-32")
    > 69 |       ).toThrow("Invalid date format");
         |         ^
      70 |     });
      71 |
      72 |     it("should create a milestone successfully", () => {

      at Object.toThrow (WordCloud.test.js:69:9)

  ● ProjectManagement › createMilestone › should create a milestone successfully

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function String() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      50 |   createMilestone(milestoneId, title, dueDate) {
      51 |     if (
    > 52 |       !S.is(String)(milestoneId) ||
         |          ^
      53 |       !S.is(String)(title) ||
      54 |       !S.is(String)(dueDate)
      55 |     ) {

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at ProjectManagement.is [as createMilestone] (Solution.js:52:10)
      at Object.createMilestone (WordCloud.test.js:73:10)

  ● ProjectManagement › trackTime › should throw an error if taskId does not exist

    expect(received).toThrow(expected)

    Expected substring: "Task not found"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          78 |   trackTime(taskId, startTime, endTime) {
          79 |     if (
        > 80 |       !S.is(String)(taskId) ||
             |          ^
          81 |       !S.is(String)(startTime) ||
          82 |       !S.is(String)(endTime)
          83 |     ) {

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as trackTime] (Solution.js:80:10)
          at trackTime (WordCloud.test.js:85:12)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:86:9)

      84 |       expect(() =>
      85 |         pm.trackTime("task4", "2025-03-17 10:00", "2025-03-17 12:00")
    > 86 |       ).toThrow("Task not found");
         |         ^
      87 |     });
      88 |     it("should throw an error if startTime or endTime is in the wrong format", () => {
      89 |       expect(() =>

      at Object.toThrow (WordCloud.test.js:86:9)

  ● ProjectManagement › trackTime › should throw an error if startTime or endTime is in the wrong format

    expect(received).toThrow(expected)

    Expected substring: "Invalid time format"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          78 |   trackTime(taskId, startTime, endTime) {
          79 |     if (
        > 80 |       !S.is(String)(taskId) ||
             |          ^
          81 |       !S.is(String)(startTime) ||
          82 |       !S.is(String)(endTime)
          83 |     ) {

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as trackTime] (Solution.js:80:10)
          at trackTime (WordCloud.test.js:90:12)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:91:9)

      89 |       expect(() =>
      90 |         pm.trackTime("task1", "2025-03-17 10:00", "2025-03-17 12:60")
    > 91 |       ).toThrow("Invalid time format");
         |         ^
      92 |       expect(() =>
      93 |         pm.trackTime("task1", "2025-03-17 10:00", "March 17, 2025 12:00")
      94 |       ).toThrow("Invalid time format");

      at Object.toThrow (WordCloud.test.js:91:9)

  ● ProjectManagement › trackTime › should throw an error if startTime is in the future

    expect(received).toThrow(expected)

    Expected substring: "Start time cannot be in future"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          78 |   trackTime(taskId, startTime, endTime) {
          79 |     if (
        > 80 |       !S.is(String)(taskId) ||
             |          ^
          81 |       !S.is(String)(startTime) ||
          82 |       !S.is(String)(endTime)
          83 |     ) {

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as trackTime] (Solution.js:80:10)
          at trackTime (WordCloud.test.js:99:12)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:100:9)

       98 |       expect(() =>
       99 |         pm.trackTime("task1", futureTime, "2025-03-17 12:00")
    > 100 |       ).toThrow("Start time cannot be in future");
          |         ^
      101 |     });
      102 |     it("should throw an error if startTime is after endTime", () => {
      103 |       expect(() =>

      at Object.toThrow (WordCloud.test.js:100:9)

  ● ProjectManagement › trackTime › should throw an error if startTime is after endTime

    expect(received).toThrow(expected)

    Expected substring: "Start time must be before end time"
    Received message:   "Invalid value·
    is :: Type -> Any -> Boolean
          ^^^^
           1·
    1)  function String() { [native code] } :: Function, (a -> b)·
    The value at position 1 is not a member of ‘Type’.·
    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.
    "

          78 |   trackTime(taskId, startTime, endTime) {
          79 |     if (
        > 80 |       !S.is(String)(taskId) ||
             |          ^
          81 |       !S.is(String)(startTime) ||
          82 |       !S.is(String)(endTime)
          83 |     ) {

          at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
          at Object.value (node_modules/sanctuary-def/index.js:1350:18)
          at assertRight (node_modules/sanctuary-def/index.js:2641:37)
          at Object.is (node_modules/sanctuary-def/index.js:2732:27)
          at ProjectManagement.is [as trackTime] (Solution.js:80:10)
          at trackTime (WordCloud.test.js:104:12)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:105:9)

      103 |       expect(() =>
      104 |         pm.trackTime("task1", "2025-03-17 14:00", "2025-03-17 12:00")
    > 105 |       ).toThrow("Start time must be before end time");
          |         ^
      106 |     });
      107 |     it("should track time in minutes successfully ", () => {
      108 |       pm.trackTime("task1", "2025-03-17 10:00", "2025-03-17 12:00");

      at Object.toThrow (WordCloud.test.js:105:9)

  ● ProjectManagement › trackTime › should track time in minutes successfully 

    TypeError: Invalid value

    is :: Type -> Any -> Boolean
          ^^^^
           1

    1)  function String() { [native code] } :: Function, (a -> b)

    The value at position 1 is not a member of ‘Type’.

    See https://github.com/sanctuary-js/sanctuary-def/tree/v0.22.0#Type for information about the Type type.

      78 |   trackTime(taskId, startTime, endTime) {
      79 |     if (
    > 80 |       !S.is(String)(taskId) ||
         |          ^
      81 |       !S.is(String)(startTime) ||
      82 |       !S.is(String)(endTime)
      83 |     ) {

      at invalidValue (node_modules/sanctuary-def/index.js:2576:12)
      at Object.value (node_modules/sanctuary-def/index.js:1350:18)
      at assertRight (node_modules/sanctuary-def/index.js:2641:37)
      at Object.is (node_modules/sanctuary-def/index.js:2732:27)
      at ProjectManagement.is [as trackTime] (Solution.js:80:10)
      at Object.trackTime (WordCloud.test.js:108:10)

Test Suites: 1 failed, 1 total
Tests:       14 failed, 14 total
Snapshots:   0 total
Time:        0.295 s, estimated 1 s
Ran all test suites.
```

Prompt:
Please fix the errors/bugs in the code as per the detail below:
1. function `addTaskDependency(taskId, dependencyId)`
    -   `taskId` (string)
    -   `dependencyId` (string)
    - If the parameter passed to above functions are of invalid type then raise error "Invalid data"
    -   If the `taskId` or `dependencyId` do not exist, throw an error: `"Task or Dependency not found"`.
    -   Ensure that the `dependencyId` does not create a circular dependency (a task cannot depend on itself, either directly or indirectly).
    -   Add the `dependencyId` to the `dependencies` array of the task with the `taskId`.


2. function `createMilestone(milestoneId, title, dueDate)`
    -   `milestoneId` (string)
    -   `title` (string)
    -   `dueDate` (string in 'YYYY-MM-DD' format)
    -   If the milestoneId already exists, throw an error: `"Milestone already exists"`.
    -   If the dueDate is in the past, throw an error: `"Milestone due date cannot be in the past"`.
    - if the dueDate is not in the format 'YYYY-MM-DD' , raise "Invalid date format".
    -   Store the milestone with its tasks and due date.




3. function `trackTime(taskId, startTime, endTime)` 
    -   `taskId` (string)
    -   `startTime` (string in 'YYYY-MM-DD HH:mm' format)
    -   `endTime` (string in 'YYYY-MM-DD HH:mm' format)
    -   If the taskId does not exist, throw an error: `"Task not found"`.
    -   Validate that the `startTime` is before the `endTime` and that the `startTime` is not in the future, if in future startTime raise error "Start time cannot be in future".
    - If the startTime and endTime is not in the format 'YYYY-MM-DD HH:mm' raise error "Invalid time format".
    -   Calculate the time spent on the task (in minutes)and store it in an array under the `timeEntries` field for the task.

Note: Don't provide me code without using sanctuary library methods.