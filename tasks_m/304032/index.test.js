const TaskSchedulingSystem = require(process.env.TARGET_FILE);

const SECONDS = 1000;
jest.setTimeout(10 * SECONDS)

describe("TaskSchedulingSystem", () => {
  const MAX_TASKS = 3;
  const TASK_DURATION = 1;
  let taskScheduler;

  beforeEach(() => {
    taskScheduler = new TaskSchedulingSystem(MAX_TASKS, TASK_DURATION);
  });

  it("should throw error when maxTasks is set to 0 or negative", () => {
    expect(() => new TaskSchedulingSystem(0, TASK_DURATION)).toThrow(
      "maxTasks must be a positive integer"
    );
    expect(() => new TaskSchedulingSystem(-1, TASK_DURATION)).toThrow(
      "maxTasks must be a positive integer"
    );
  });

  it("should throw error when taskDuration is set to 0 or negative", () => {
    expect(() => new TaskSchedulingSystem(MAX_TASKS, 0)).toThrow(
      "taskDuration must be a positive integer"
    );
    expect(() => new TaskSchedulingSystem(MAX_TASKS, -1)).toThrow(
      "taskDuration must be a positive integer"
    );
  });

  it("should throw error when userId is invalid", () => {
    expect(() => taskScheduler.addTask("")).toThrow("Invalid userId");
    expect(() => taskScheduler.addTask(null)).toThrow("Invalid userId");
    expect(() => taskScheduler.addTask(undefined)).toThrow("Invalid userId");
  });

  it("should not allow more than maxTasks per user", () => {
    const userId = "user1";
    taskScheduler.addTask(userId);
    taskScheduler.addTask(userId);
    taskScheduler.addTask(userId);
    expect(() => taskScheduler.addTask(userId)).toThrow(
      "User user1 has reached the task limit of 3"
    );
  });

  it("should clean up expired tasks and not count them", () => {
    const userId = "user1";
    taskScheduler.addTask(userId);
    expect(taskScheduler.getTaskCount(userId)).toBe(1);
    setTimeout(() => {
      expect(taskScheduler.getTaskCount(userId)).toBe(0);
    }, TASK_DURATION * 60 * 60 * 1000 + 100);
  });

  it("should not allow adding tasks if the user has reached maxTasks", () => {
    const userId = "user1";
    taskScheduler.addTask(userId);
    taskScheduler.addTask(userId);
    taskScheduler.addTask(userId);
    expect(() => taskScheduler.addTask(userId)).toThrow(
      "User user1 has reached the task limit of 3"
    );
  });

  it("should reset all tasks for a user when resetTasks is called", () => {
    const userId = "user1";
    taskScheduler.addTask(userId);
    taskScheduler.resetTasks(userId);
    expect(taskScheduler.getTaskCount(userId)).toBe(0);
  });

  it("should throw error when adding task exceeds the task limit", () => {
    const userId = "user1";
    taskScheduler.addTask(userId);
    taskScheduler.addTask(userId);
    taskScheduler.addTask(userId);
    expect(() => taskScheduler.addTask(userId)).toThrow(
      "User user1 has reached the task limit of 3"
    );
  });

  it("should handle multiple users independently", () => {
    const userId1 = "user1";
    const userId2 = "user2";
    taskScheduler.addTask(userId1);
    taskScheduler.addTask(userId2);
    expect(taskScheduler.getTaskCount(userId1)).toBe(1);
    expect(taskScheduler.getTaskCount(userId2)).toBe(1);
    taskScheduler.addTask(userId1);
    expect(taskScheduler.getTaskCount(userId1)).toBe(2);
    expect(taskScheduler.getTaskCount(userId2)).toBe(1);
  });

  it("should throw error if task expiration cleanup fails", () => {
    const userId = "user1";
    taskScheduler.addTask(userId);
    setTimeout(() => {
      taskScheduler.cleanupExpiredTasks(userId);
      expect(() => taskScheduler.getTaskCount(userId)).not.toThrow();
    }, TASK_DURATION * 60 * 60 * 1000 + 100);
  });

  afterAll(() => setTimeout(() => process.exit(), 1000))

});
