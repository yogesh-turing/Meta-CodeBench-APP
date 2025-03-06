"use strict";

class TeamProjectManagementSystem {
  constructor() {
    this.tasks = []; // Store tasks in memory
  }

  // Utility method to find a task by ID or throw an error if not found
  _findTaskById(taskId) {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  // Utility method to parse and validate a "YYYY-MM-DD" date string.
  // This also checks for any "leap year date" usage and throws the required errors.
  _parseDateString(dateString) {
    // Check general "YYYY-MM-DD" format via simple regex
    // (year >= 0000, month/day exactly two digits)
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      throw new Error("Invalid date format");
    }

    // Extract parts
    const [yearStr, monthStr, dayStr] = dateString.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    // Check leap-year date usage (any "XX-02-29")
    if (month === 2 && day === 29) {
      throw new Error("Leap year date");
    }

    // Validate month range
    if (month < 1 || month > 12) {
      throw new Error("Invalid date format");
    }

    // Validate day range per month (simplified, ignoring leap days entirely as required).
    const daysInMonth = {
      1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
      7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
    };

    if (day < 1 || day > daysInMonth[month]) {
      throw new Error("Invalid date format");
    }

    // Construct the date object
    // Note: This is local time. For simplicity and the test's sake, we assume this is acceptable.
    return new Date(year, month - 1, day);
  }

  // Checks if the given date is in the past relative to "now"
  _isDateInPast(dateObj) {
    const now = new Date();
    // Compare by year-month-day only (ignoring hours/mins). 
    // Or compare by full date object. Typically comparing by getTime() suffices:
    return dateObj.getTime() < now.getTime();
  }

  // Checks if dateObj1 < dateObj2 by getTime comparison
  _isDateBefore(dateObj1, dateObj2) {
    return dateObj1.getTime() < dateObj2.getTime();
  }

  /**
   * addTask
   * Accept:
   *  taskId (string)
   *  title (string)
   *  description (string)
   *  assignee (string)
   *  dueDate (string in 'YYYY-MM-DD' format)
   *
   * Requirements:
   *  - If any field is missing or invalid, throw "Invalid task details".
   *  - If dueDate is in the past, throw "Due date cannot be in the past".
   *  - If the date is leap year date, throw "Leap year date".
   *  - If the date is not in correct format or non existent, throw "Invalid date format".
   *  - Otherwise, store the task in this.tasks.
   */
  addTask(taskId, title, description, assignee, dueDate) {
    // Basic checks for missing or non-string fields
    if (
      !taskId ||
      !title ||
      !description ||
      !assignee ||
      !dueDate ||
      typeof taskId !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof assignee !== "string" ||
      typeof dueDate !== "string"
    ) {
      throw new Error("Invalid task details");
    }

    // Attempt to parse the due date
    const parsedDueDate = this._parseDateString(dueDate);

    // Check if due date is in the past
    if (this._isDateInPast(parsedDueDate)) {
      throw new Error("Due date cannot be in the past");
    }

    // If all validations pass, create the task
    this.tasks.push({
      taskId: taskId,
      title: title,
      description: description,
      assignee: assignee,
      dueDate: dueDate, // keep as string
      status: "pending",
      completedDate: null,
    });
    return `Task "${title}" added to the system!`;
  }

  /**
   * assignTaskToUser
   * Accept:
   *  taskId (string)
   *  user (string)
   *
   * Requirements:
   *  - If task is not found, throw "Task not found".
   *  - If the task is already assigned to the user, return "Task is already assigned to the user".
   *  - Else assign the task, return "Task assigned to {user}"
   */
  assignTaskToUser(taskId, user) {
    const task = this._findTaskById(taskId);
    if (task.assignee === user) {
      return "Task is already assigned to the user";
    }
    task.assignee = user;
    return `Task assigned to ${user}`;
  }

  /**
   * updateTaskDueDate
   * Accept:
   *  taskId (string)
   *  newDueDate (string in 'YYYY-MM-DD' format)
   * Requirements:
   *  - Throw "Task not found" if taskId doesn't exist.
   *  - If newDueDate is not valid or is a leap year date, throw appropriate error.
   *  - If newDueDate is in the past, throw "New due date cannot be in the past".
   *  - Otherwise update the due date.
   */
  updateTaskDueDate(taskId, newDueDate) {
    const task = this._findTaskById(taskId);

    // parse date
    const parsedNewDueDate = this._parseDateString(newDueDate);

    // check if new due date is in the past
    if (this._isDateInPast(parsedNewDueDate)) {
      throw new Error("New due date cannot be in the past");
    }

    // update
    task.dueDate = newDueDate;
    return `Task due date updated to ${newDueDate}`;
  }

  /**
   * getTasksByUser
   * Accept:
   *  user (string)
   *
   * Requirements:
   *  - Return an array of tasks assigned to this user (could be empty).
   */
  getTasksByUser(user) {
    return this.tasks
      .filter((task) => task.assignee === user)
      .map((t) => ({
        taskId: t.taskId,
        title: t.title,
        description: t.description,
        dueDate: t.dueDate,
        assignee: t.assignee,
      }));
  }

  /**
   * generateTaskCompletionReport
   * Accept:
   *  startDate (string 'YYYY-MM-DD')
   *  endDate (string 'YYYY-MM-DD')
   *
   * Requirements:
   *  - Validate startDate and endDate
   *  - Return tasks that are completed between startDate and endDate (inclusive).
   *  - If no tasks in that range, return "No completed tasks in this range".
   */
  generateTaskCompletionReport(startDate, endDate) {
    // parse and validate both dates
    const parsedStart = this._parseDateString(startDate);
    const parsedEnd = this._parseDateString(endDate);

    // Filter tasks that are completed in the range
    const completedInRange = this.tasks.filter((task) => {
      if (task.status !== "completed") return false;
      // parse completionDate
      const completionDateObj = this._parseDateString(task.completedDate);
      // check range inclusive
      return (
        !this._isDateBefore(completionDateObj, parsedStart) &&
        !this._isDateBefore(parsedEnd, completionDateObj)
      );
    });

    if (completedInRange.length === 0) {
      return "No completed tasks in this range";
    }

    // Format the report data
    return completedInRange.map((task) => ({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      completedDate: task.completedDate,
      assignee: task.assignee,
    }));
  }

  /**
   * markTaskAsCompleted
   * Accept:
   *  taskId (string)
   *  completionDate (string 'YYYY-MM-DD')
   *
   * Requirements:
   *  - If task not found, throw "Task not found"
   *  - If completionDate is invalid or is leap year date, throw appropriate error
   *  - completionDate must be after dueDate, else throw "Completion date cannot be before the due date"
   *  - Set status = "completed", completedDate = completionDate
   */
  markTaskAsCompleted(taskId, completionDate) {
    const task = this._findTaskById(taskId);

    // parse & validate completionDate
    const parsedCompletionDate = this._parseDateString(completionDate);
    // parse the task.dueDate
    const parsedDueDate = this._parseDateString(task.dueDate);

    // completionDate must be AFTER dueDate
    if (!this._isDateBefore(parsedDueDate, parsedCompletionDate)) {
      throw new Error("Completion date cannot be before the due date");
    }

    task.status = "completed";
    task.completedDate = completionDate;
    return `Task marked as completed on ${completionDate}`;
  }

  /**
   * getOverdueTasks()
   * Returns tasks whose due date has passed and status != "completed"
   * If no overdue tasks, return "No overdue tasks"
   */
  getOverdueTasks() {
    const now = new Date();

    const overdue = this.tasks.filter((task) => {
      if (task.status === "completed") return false;
      // parse the task's dueDate
      const parsedDue = this._parseDateString(task.dueDate);
      return parsedDue.getTime() < now.getTime();
    });

    if (overdue.length === 0) {
      return "No overdue tasks";
    }

    // Map tasks to required output format
    return overdue.map((t) => ({
      taskId: t.taskId,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      assignee: t.assignee,
    }));
  }
}

module.exports = { TeamProjectManagementSystem };