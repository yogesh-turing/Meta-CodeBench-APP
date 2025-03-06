const { TeamProjectManagementSystem } = require('./incorrect');

describe("Team Project Management System", () => {
  let system;

  beforeEach(() => {
    system = new TeamProjectManagementSystem(); // Instantiate the system before each test
  });

  // 1. Test addTask function
  test("should add a new valid task", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    expect(system.tasks).toHaveLength(1);
    expect(system.tasks[0].taskId).toBe("1");
  });

  test("should throw error if its a leap year year date", () => {
    expect(() => {
      system.addTask(
        "2",
        "Task 2",
        "Description of Task 2",
        "John",
        "2024-02-29"
      );
    }).toThrow("Leap year date");
  });

  test("should throw error if due date is in the past", () => {
    expect(() => {
      system.addTask(
        "2",
        "Task 2",
        "Description of Task 2",
        "John",
        "2022-01-01"
      );
    }).toThrow("Due date cannot be in the past");
  });

  test("should throw error if due date is in not in the correct format YYYY-MM-DD", () => {
    expect(() => {
      system.addTask("2", "Task 2", "Description of Task 2", "John", "04-3-01");
    }).toThrow("Invalid date format");
  });

  test("should throw error if due date is in in the correct format YYYY-MM-DD but non existent", () => {
    expect(() => {
      system.addTask(
        "2",
        "Task 2",
        "Description of Task 2",
        "John",
        "2025-13-03"
      );
    }).toThrow("Invalid date format");
  });

  test("should throw error if task details are missing", () => {
    expect(() => {
      system.addTask("", "Task 3", "", "2025-04-10");
    }).toThrow("Invalid task details");
  });

  test("should throw error if task details are of invalid type", () => {
    expect(() => {
      system.addTask(
        2,
        "Task 2",
        "Description of Task 2",
        "John",
        "2025-12-03"
      );
    }).toThrow("Invalid task details");
  });

  // 2. Test assignTaskToUser function
  test("should assign a task to a user", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    system.assignTaskToUser("1", "Jane");
    expect(system.tasks[0].assignee).toBe("Jane");
  });

  test("should throw error if task is not found while assigning", () => {
    expect(() => {
      system.assignTaskToUser("999", "Jane");
    }).toThrow("Task not found");
  });

  test("should return message if task is already assigned", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    system.assignTaskToUser("1", "Jane");
    expect(system.assignTaskToUser("1", "Jane")).toBe(
      "Task is already assigned to the user"
    );
  });

  // 3. Test updateTaskDueDate function
  test("should update task due date", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    system.updateTaskDueDate("1", "2025-04-15");

    expect(system.tasks[0].dueDate).toBe("2025-04-15");
  });

  test("throw error when update at date is invalid", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    expect(() => {
      system.updateTaskDueDate("1", "04-12-15");
    }).toThrow("Invalid date format");
  });

  test("should throw error if new due date is in the past", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    expect(() => {
      system.updateTaskDueDate("1", "2022-01-01");
    }).toThrow("New due date cannot be in the past");
  });

  test("should throw error if task is not found while updating due date", () => {
    expect(() => {
      system.updateTaskDueDate("999", "2025-04-15");
    }).toThrow("Task not found");
  });

  // 4. Test getTasksByUser function
  test("should return tasks assigned to a user", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    system.addTask(
      "2",
      "Task 2",
      "Description of Task 2",
      "Jane",
      "2025-05-10"
    );
    expect(system.getTasksByUser("John")).toHaveLength(1);
  });

  test("should return empty array if no tasks assigned to the user", () => {
    expect(system.getTasksByUser("Unknown")).toHaveLength(0);
  });

  // 5. Test generateTaskCompletionReport function
  test("should generate report for completed tasks within a date range", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    system.markTaskAsCompleted("1", "2025-04-10");
    const report = system.generateTaskCompletionReport(
      "2025-04-01",
      "2025-04-15"
    );
    expect(report).toHaveLength(1);
  });

  test("should return message if no completed tasks in date range", () => {
    const report = system.generateTaskCompletionReport(
      "2025-04-01",
      "2025-04-15"
    );
    expect(report).toBe("No completed tasks in this range");
  });

  test("should throw error when start date is not in YYYY-MM-DD format", () => {
    expect(() => {
      system.generateTaskCompletionReport("200-04-01", "2025-04-15");
    }).toThrow("Invalid date format");
  });

  test("should throw error when end date is not in YYYY-MM-DD format", () => {
    expect(() => {
      system.generateTaskCompletionReport("2024-04-01", "205-04-15");
    }).toThrow("Invalid date format");
  });

  // 6. Test markTaskAsCompleted function
  test("should mark task as completed", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    system.markTaskAsCompleted("1", "2025-04-10");
    expect(system.tasks[0].status).toBe("completed");
    expect(system.tasks[0].completedDate).toBe("2025-04-10");
  });

  test("should throw error if completion date is before due date", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    expect(() => {
      system.markTaskAsCompleted("1", "20-04-10");
    }).toThrow("Invalid date format");
  });

  test("should throw error if completion date is before due date", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-04-10"
    );
    expect(() => {
      system.markTaskAsCompleted("1", "2025-04-05");
    }).toThrow("Completion date cannot be before the due date");
  });

  test("should throw error if task is not found while marking as completed", () => {
    expect(() => {
      system.markTaskAsCompleted("999", "2025-04-10");
    }).toThrow("Task not found");
  });

  // 7. Test getOverdueTasks function
  test("should return overdue tasks", () => {
    system.addTask(
      "1",
      "Task 1",
      "Description of Task 1",
      "John",
      "2025-03-10"
    );
    system.markTaskAsCompleted("1", "2025-04-10");
    const overdueTasks = system.getOverdueTasks();
    expect(overdueTasks).toBe("No overdue tasks");
  });

  test("should return message if no overdue tasks", () => {
    const overdueTasks = system.getOverdueTasks();
    expect(overdueTasks).toBe("No overdue tasks");
  });
});
