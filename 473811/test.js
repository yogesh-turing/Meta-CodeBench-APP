const TaskManager = require('./solution'); 
describe("TaskManager Class Unit Tests", () => {
  
  test("sortTasksByDueDate sorts tasks in ascending order of due date", () => {
    const manager = new TaskManager();
    // Adding tasks with MM-DD-YYYY date format
    manager.addTask(1, "Task 1", "12-31-2024", 1); // Dec 31, 2024
    manager.addTask(2, "Task 2", "01-15-2025", 1); // Jan 15, 2025
    manager.addTask(3, "Task 3", "07-04-2023", 1); // July 4, 2023

    manager.sortTasksByDueDate();

    // Expected order: Task 3 (July 4, 2023), Task 1 (Dec 31, 2024), Task 2 (Jan 15, 2025)
    const sortedIds = manager.tasks.map(task => task.id);
    expect(sortedIds).toEqual([3, 1, 2]);
  });

  test("getTasksByPriority returns only tasks matching the specified priority", () => {
    const manager = new TaskManager();
    manager.addTask(1, "Task 1", "01-01-2025", 1);
    manager.addTask(2, "Task 2", "01-01-2025", 2);
    manager.addTask(3, "Task 3", "01-01-2025", 1);

    const priorityOneTasks = manager.getTasksByPriority(1);
    expect(priorityOneTasks.length).toBe(2);
    priorityOneTasks.forEach(task => {
      expect(task.priority).toBe(1);
    });
  });

  test("removeTask removes only the specified task", () => {
    const manager = new TaskManager();
    manager.addTask(1, "Task 1", "01-01-2025", 1);
    manager.addTask(2, "Task 2", "01-01-2025", 2);
    manager.addTask(3, "Task 3", "01-01-2025", 3);

    manager.removeTask(2);
    const remainingIds = manager.tasks.map(task => task.id);
    // Only task 2 should be removed, so tasks 1 and 3 remain
    expect(remainingIds).toEqual([1, 3]);
  });

  test("convertTaskDates converts DD/MM/YYYY format to YYYY-MM-DD", () => {
    const manager = new TaskManager();
    // Add a task with a date in DD/MM/YYYY format
    manager.addTask(1, "Task 1", "31/12/2024", 1);
    
    manager.convertTaskDates();
    expect(manager.tasks[0].dueDate).toBe("2024-12-31");
  });

  test("getTasksByPriority loop does not trigger off-by-one errors", () => {
    const manager = new TaskManager();
    // Test when no tasks exist with the specified priority
    expect(() => {
      manager.getTasksByPriority(1);
    }).not.toThrow();

    // Test with one task
    manager.addTask(1, "Task 1", "01-01-2025", 1);
    expect(() => {
      manager.getTasksByPriority(1);
    }).not.toThrow();
  });

});