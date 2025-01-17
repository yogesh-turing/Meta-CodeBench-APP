const TaskManager = require('./incorrect');

describe("TaskManager", () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  it("should add a task", () => {
    taskManager.addTask("Write Report", "High");
    expect(taskManager.getTasks().length).toBe(1);
  });

  it("should add a dependency", () => {
    taskManager.addTask("Write Report", "High");
    taskManager.addTask("Gather Data", "High");
    taskManager.addDependency("Write Report", "Gather Data");
    expect(taskManager.dependencies["Write Report"]).toEqual(["Gather Data"]);
  });

  it("should throw error if task or dependency does not exist", () => {
    taskManager.addTask("Write Report", "High");
    expect(() =>
      taskManager.addDependency("Write Report", "Gather Data")
    ).toThrow("Task or dependency does not exist");
    expect(() =>
      taskManager.addDependency("Gather Data", "Write Report")
    ).toThrow("Task or dependency does not exist");
  });

  it("should complete a task", () => {
    taskManager.addTask("Write Report", "High");
    taskManager.completeTask("Write Report");
    expect(taskManager.getCompletedTasks()).toEqual(["Write Report"]);
  });

  it("should not complete a task if it has uncompleted dependencies", () => {
    taskManager.addTask("Write Report", "High");
    taskManager.addTask("Gather Data", "High");
    taskManager.addDependency("Write Report", "Gather Data");
    expect(() => taskManager.completeTask("Write Report")).toThrow(
      "Cannot complete task with uncompleted dependencies"
    );
  });

  it("should not complete a task if the task does not exist", () => {
    expect(() => taskManager.completeTask("Write Report")).toThrow(
      "Task does not exist"
    );
  });

  it("should return the completed tasks", () => {
    taskManager.addTask("Write Report", "High");
    taskManager.addTask("Gather Data", "High");
    taskManager.completeTask("Write Report");
    taskManager.completeTask("Gather Data");
    expect(taskManager.getCompletedTasks()).toEqual([
      "Write Report",
      "Gather Data",
    ]);
  });

  it("should return the pending tasks", () => {
    taskManager.addTask("Write Report", "High");
    taskManager.addTask("Gather Data", "High");
    taskManager.addTask("Review", "High");
    taskManager.completeTask("Write Report");
    expect(taskManager.getPendingTasks()).toEqual(["Gather Data", "Review"]);
  });
  it("should handle multiple dependencies", () => {
    taskManager.addTask("Write Report", "High");
    taskManager.addTask("Gather Data", "High");
    taskManager.addTask("Outline", "High");
    taskManager.addDependency("Write Report", "Gather Data");
    taskManager.addDependency("Write Report", "Outline");
    expect(() => taskManager.completeTask("Write Report")).toThrow(
      "Cannot complete task with uncompleted dependencies"
    );
    taskManager.completeTask("Gather Data");
    expect(() => taskManager.completeTask("Write Report")).toThrow(
      "Cannot complete task with uncompleted dependencies"
    );
    taskManager.completeTask("Outline");
    taskManager.completeTask("Write Report");
    expect(taskManager.getCompletedTasks()).toEqual([
      "Gather Data",
      "Outline",
      "Write Report",
    ]);
  });
  it("should add a task with a pending status by default", () => {
    taskManager.addTask("Write Report", "High");
    expect(taskManager.getPendingTasks()).toEqual(["Write Report"]);
  });
});
