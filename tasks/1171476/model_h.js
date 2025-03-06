"use strict";

class TeamProjectManagementSystem {
  constructor() {
    this.tasks = []; // Store tasks in memory
  }

  // -------------------------------------------------
  // Utility functions for date validation
  // -------------------------------------------------
  static isValidDateFormat(dateString) {
    // Must be strictly YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  static parseDateString(dateString) {
    const [year, month, day] = dateString.split("-").map((part) => parseInt(part, 10));
    return { year, month, day };
  }

  static isLeapYear(year) {
    // Standard leap year check
    return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
  }

  static isValidDate(year, month, day) {
    // Check month range
    if (month < 1 || month > 12) return false;
    // Days in each month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Adjust for leap year in February
    if (TeamProjectManagementSystem.isLeapYear(year)) {
      daysInMonth[1] = 29; // February
    }
    const maxDays = daysInMonth[month - 1];
    // Check day range
    if (day < 1 || day > maxDays) return false;
    return true;
  }

  static throwIfInvalidDate(dueDate) {
    // 1) Check format
    if (!TeamProjectManagementSystem.isValidDateFormat(dueDate)) {
      throw new Error("Invalid date format");
    }

    // 2) Parse
    const { year, month, day } = TeamProjectManagementSystem.parseDateString(dueDate);

    // 3) Check if leap day (the test demands immediate failure for 02-29)
    // "should throw error if its a leap year year date" => specifically 2024-02-29
    // The test expects "Leap year date" if the input is a valid 02-29 of a leap year.
    if (month === 2 && day === 29 && TeamProjectManagementSystem.isLeapYear(year)) {
      throw new Error("Leap year date");
    }

    // 4) Check if valid/existing date
    if (!TeamProjectManagementSystem.isValidDate(year, month, day)) {
      throw new Error("Invalid date format");
    }
  }

  // Helper to compare two "YYYY-MM-DD" strings as dates without external libs
  static toJSDate(dateString) {
    const { year, month, day } = TeamProjectManagementSystem.parseDateString(dateString);
    // JS month index begins at 0, so subtract 1 from month
    return new Date(year, month - 1, day);
  }

  // Compare if aDateString is strictly less (in the past) than bDateString
  static isDateBefore(aDateString, bDateString) {
    return TeamProjectManagementSystem.toJSDate(aDateString) <
           TeamProjectManagementSystem.toJSDate(bDateString);
  }

  // -------------------------------------------------
  // 1) addTask
  // -------------------------------------------------
  addTask(taskId, title, description, assignee, dueDate) {
    // Check for missing or invalid details
    if (!taskId || !title || !description || !assignee || !dueDate) {
      throw new Error("Invalid task details");
    }

    // Validate date format, leap day, and existence
    TeamProjectManagementSystem.throwIfInvalidDate(dueDate);

    // Check if due date is in the future
    const todayStr = this._getTodayAsString();
    if (!TeamProjectManagementSystem.isDateBefore(todayStr, dueDate)) {
      // If dueDate <= today => "Due date cannot be in the past"
      throw new Error("Due date cannot be in the past");
    }

    this.tasks.push({
      taskId: taskId,
      title: title,
      description: description,
      assignee: assignee,
      dueDate: dueDate,
      status: "pending",
      completedDate: null,
    });
    return `Task "${title}" added to the system!`;
  }

  // -------------------------------------------------
  // 2) assignTaskToUser
  // -------------------------------------------------
  assignTaskToUser(taskId, user) {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    // If the task is already assigned to the same user, return the message
    if (task.assignee === user) {
      return "Task is already assigned to the user";
    }
    task.assignee = user;
    return `Task assigned to ${user}`;
  }

  // -------------------------------------------------
  // 3) updateTaskDueDate
  // -------------------------------------------------
  updateTaskDueDate(taskId, newDueDate) {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    TeamProjectManagementSystem.throwIfInvalidDate(newDueDate);

    const todayStr = this._getTodayAsString();
    // If newDueDate <= today => "New due date cannot be in the past"
    if (!TeamProjectManagementSystem.isDateBefore(todayStr, newDueDate)) {
      throw new Error("New due date cannot be in the past");
    }

    task.dueDate = newDueDate;
    return `Task due date updated to ${newDueDate}`;
  }

  // -------------------------------------------------
  // 4) getTasksByUser
  // -------------------------------------------------
  getTasksByUser(user) {
    // Return all tasks assigned to the user
    return this.tasks
      .filter((t) => t.assignee === user)
      .map((t) => ({
        taskId: t.taskId,
        title: t.title,
        description: t.description,
        dueDate: t.dueDate,
        assignee: t.assignee,
      }));
  }

  // -------------------------------------------------
  // 5) generateTaskCompletionReport
  // -------------------------------------------------
  generateTaskCompletionReport(startDate, endDate) {
    // Validate the input dates
    TeamProjectManagementSystem.throwIfInvalidDate(startDate);
    TeamProjectManagementSystem.throwIfInvalidDate(endDate);

    // Now filter for tasks that are completed between startDate and endDate (inclusive)
    const results = this.tasks.filter((t) => {
      // Must be completed
      if (t.status !== "completed") return false;
      // Compare completionDate with startDate and endDate
      // We'll consider inclusive range: startDate <= t.completedDate <= endDate
      const completed = t.completedDate;
      return (
        !TeamProjectManagementSystem.isDateBefore(completed, startDate) &&
        !TeamProjectManagementSystem.isDateBefore(endDate, completed)
      );
    });

    if (results.length === 0) {
      return "No completed tasks in this range";
    }

    // Return minimal relevant info
    return results.map((t) => ({
      taskId: t.taskId,
      title: t.title,
      description: t.description,
      completedDate: t.completedDate,
      assignee: t.assignee,
    }));
  }

  // -------------------------------------------------
  // 6) markTaskAsCompleted
  // -------------------------------------------------
  markTaskAsCompleted(taskId, completionDate) {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Validate completionDate
    TeamProjectManagementSystem.throwIfInvalidDate(completionDate);

    // Check if completion date is before or equal to due date => throw
    if (!TeamProjectManagementSystem.isDateBefore(task.dueDate, completionDate)) {
      throw new Error("Completion date cannot be before the due date");
    }

    task.status = "completed";
    task.completedDate = completionDate;
    return `Task marked as completed on ${completionDate}`;
  }

  // -------------------------------------------------
  // 7) getOverdueTasks
  // -------------------------------------------------
  getOverdueTasks() {
    // Overdue tasks: tasks not completed and due date < today
    const todayStr = this._getTodayAsString();
    const overdue = this.tasks.filter((t) => {
      if (t.status === "completed") return false;
      // If dueDate < today => overdue
      return TeamProjectManagementSystem.isDateBefore(t.dueDate, todayStr);
    });

    if (overdue.length === 0) {
      return "No overdue tasks";
    }

    // Return list with relevant fields
    return overdue.map((t) => ({
      taskId: t.taskId,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      assignee: t.assignee,
    }));
  }

  // -------------------------------------------------
  // Internal helper to get today's date as "YYYY-MM-DD"
  // -------------------------------------------------
  _getTodayAsString() {
    const now = new Date();
    const y = now.getFullYear();
    let m = now.getMonth() + 1; // 0-based
    let d = now.getDate();     // 1-based
    const mm = m < 10 ? "0" + m : m;
    const dd = d < 10 ? "0" + d : d;
    return `${y}-${mm}-${dd}`;
  }
}

module.exports = {
  TeamProjectManagementSystem,
};