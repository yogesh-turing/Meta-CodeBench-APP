const { ProjectManagement } = require("./correct");
const moment = require("moment");

describe("ProjectManagement", () => {
  let pm;

  beforeEach(() => {
    pm = new ProjectManagement();
    pm.tasks = {
      task1: { dependencies: [], completed: false, timeEntries: [] },
      task2: { dependencies: [], completed: false, timeEntries: [] },
      task3: { dependencies: [], completed: false, timeEntries: [] },
    };
    pm.milestones = {};
  });

  describe("addTaskDependency", () => {
    it("should throw an error if taskId or dependencyId is not a string", () => {
      expect(() => pm.addTaskDependency(1, "task2")).toThrow("Invalid data");
      expect(() => pm.addTaskDependency("task1", 2)).toThrow("Invalid data");
    });

    it("should throw an error if taskId and dependencyId are same ,", () => {
      expect(() => pm.addTaskDependency("task2", "task2")).toThrow(
        "Task cannot depend on itself"
      );
    });

    it("should throw an error if taskId or dependencyId does not exist", () => {
      expect(() => pm.addTaskDependency("task1", "task4")).toThrow(
        "Task or Dependency not found"
      );
      expect(() => pm.addTaskDependency("task5", "task2")).toThrow(
        "Task or Dependency not found"
      );
    });

    it("should throw an error for circular dependencies", () => {
      pm.addTaskDependency("task1", "task2");
      pm.addTaskDependency("task2", "task3");
      expect(() => pm.addTaskDependency("task3", "task1")).toThrow(
        "Circular dependency detected"
      );
    });

    it("should add a dependency correctly", () => {
      pm.addTaskDependency("task1", "task2");
      expect(pm.tasks["task1"].dependencies).toContain("task2");
    });
  });

  describe("createMilestone", () => {
    it("should throw an error if milestoneId already exists", () => {
      pm.createMilestone("milestone1", "Milestone 1", "2025-05-01");
      expect(() =>
        pm.createMilestone("milestone1", "Milestone 1", "2025-05-01")
      ).toThrow("Milestone already exists");
    });

    it("should throw an error if dueDate is in the past", () => {
      expect(() =>
        pm.createMilestone("milestone1", "Milestone 1", "2020-05-01")
      ).toThrow("Milestone due date cannot be in the past");
    });

    it("should throw an error if date format is invalid", () => {
      expect(() =>
        pm.createMilestone("milestone1", "Milestone 1", "2025-05-32")
      ).toThrow("Invalid date format");
    });

    it("should create a milestone successfully", () => {
      pm.createMilestone("milestone1", "Milestone 1", "2025-05-01");
      expect(pm.milestones["milestone1"]).toEqual({
        title: "Milestone 1",
        dueDate: "2025-05-01",
        tasks: [],
      });
    });
  });

  describe("trackTime", () => {
    it("should throw an error if taskId does not exist", () => {
      expect(() =>
        pm.trackTime("task4", "2025-03-17 10:00", "2025-03-17 12:00")
      ).toThrow("Task not found");
    });
    it("should throw an error if startTime or endTime is in the wrong format", () => {
      expect(() =>
        pm.trackTime("task1", "2025-03-17 10:00", "2025-03-17 12:60")
      ).toThrow("Invalid time format");
      expect(() =>
        pm.trackTime("task1", "2025-03-17 10:00", "March 17, 2025 12:00")
      ).toThrow("Invalid time format");
    });
    it("should throw an error if startTime is in the future", () => {
      const futureTime = moment().add(1, "days").format("YYYY-MM-DD HH:mm");
      expect(() =>
        pm.trackTime("task1", futureTime, "2025-03-17 12:00")
      ).toThrow("Start time cannot be in future");
    });
    it("should throw an error if startTime is after endTime", () => {
      expect(() =>
        pm.trackTime("task1", "2025-03-17 14:00", "2025-03-17 12:00")
      ).toThrow("Start time must be before end time");
    });
    it("should track time in minutes successfully ", () => {
      pm.trackTime("task1", "2025-03-17 10:00", "2025-03-17 12:00");
      expect(pm.tasks["task1"].timeEntries.length).toBe(1);
      expect(pm.tasks["task1"].timeEntries[0].timeSpent).toBe(120);
    });
  });
});
