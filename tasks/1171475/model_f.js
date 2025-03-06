class TeamProjectManagementSystem {
  constructor() {
    this.tasks = [];
  }

  // ------------------ HELPER METHODS ------------------

  // 1. Check for missing or invalid (non-string) task details
  _validateTaskDetails(taskId, title, description, assignee, dueDate) {
    if (
      typeof taskId !== "string" ||
      !taskId.trim() ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof assignee !== "string" ||
      !assignee.trim() ||
      typeof dueDate !== "string" ||
      !dueDate.trim()
    ) {
      throw new Error("Invalid task details");
    }
  }

  // 2. Parse a date string (YYYY-MM-DD), throw for invalid formats or leap-day usage
  _parseDate(dateStr, throwIfPastMsg) {
    // Validate basic format with regex
    const pattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateStr.match(pattern);
    if (!match) {
      throw new Error("Invalid date format");
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    // Special check for leap year date
    // Per the prompt/tests, ANY "02-29" must throw "Leap year date" even if it is actually a valid leap year
    if (month === 2 && day === 29) {
      throw new Error("Leap year date");
    }

    // Check if the date is real and valid
    // Construct a date in JavaScript and verify it has the same components
    const candidateDate = new Date(year, month - 1, day);
    if (
      candidateDate.getFullYear() !== year ||
      candidateDate.getMonth() !== month - 1 ||
      candidateDate.getDate() !== day
    ) {
      throw new Error("Invalid date format");
    }

    // If we have a requirement to ensure this date is in the future
    // (e.g., "Due date cannot be in the past", "New due date cannot be in the past", etc.)
    // then check that here, if a message is provided.
    if (throwIfPastMsg) {
      // Compare (only by day precision; we consider a date "past" if strictly before "today")
      const today = new Date();
      const todayMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      if (candidateDate < todayMidnight) {
        // Throw the message provided, e.g. "Due date cannot be in the past"
        throw new Error(throwIfPastMsg);
      }
    }

    // Return back a valid date object if needed
    return candidateDate;
  }

  // Convert YYYY-MM-DD to a Date, but do not do any "past" checks
  // used for comparisons (e.g., completion date vs. due date).
  _toDateObject(dateStr) {
    // We can safely re-use pieces of parse logic but don't recheck leap-year or throw.
    // Because if it was already stored, presumably it had passed earlier checks.
    const parts = dateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return new Date(year, month - 1, day);
  }

  // Find a task by taskId; throw if not found
  _findTask(taskId) {
    const found = this.tasks.find((t) => t.taskId === taskId);
    if (!found) {
      throw new Error("Task not found");
    }
    return found;
  }

  // ------------------ REQUIRED METHODS ------------------

  addTask(taskId, title, description, assignee, dueDate) {
    // 1) Validate inputs
    this._validateTaskDetails(taskId, title, description, assignee, dueDate);

    // 2) Parse & validate due date (must be future, throw if in the past).
    this._parseDate(dueDate, "Due date cannot be in the past");

    // 3) Create and store the task
    const task = {
      taskId: taskId,
      title: title,
      description: description,
      dueDate: dueDate,
      assignee: assignee,
      status: "pending",
      completedDate: null,
    };
    this.tasks.push(task);
    return `Task "${title}" added to the system!`;
  }

  assignTaskToUser(taskId, user) {
    // 1) Find task
    const task = this._findTask(taskId);
    // 2) If already assigned to that user
    if (task.assignee === user) {
      return "Task is already assigned to the user";
    }
    // 3) Otherwise, update
    task.assignee = user;
    return `Task assigned to ${user}`;
  }

  updateTaskDueDate(taskId, newDueDate) {
    // 1) Find task
    const task = this._findTask(taskId);
    // 2) Parse & validate newDueDate (must be future, throw if in past).
    this._parseDate(newDueDate, "New due date cannot be in the past");

    // 3) Update
    task.dueDate = newDueDate;
    return `Task due date updated to ${newDueDate}`;
  }

  getTasksByUser(user) {
    // Return tasks assigned to that user, or empty array if none
    return this.tasks.filter((t) => t.assignee === user);
  }

  generateTaskCompletionReport(startDate, endDate) {
    // 1) Validate format (throws if invalid or leap day)
    const startObj = this._parseDate(startDate);
    const endObj = this._parseDate(endDate);

    // 2) Filter for completed tasks in [startDate, endDate]
    const completedTasksInRange = this.tasks.filter((task) => {
      if (task.status !== "completed") return false;
      const cDateObj = this._toDateObject(task.completedDate);
      return cDateObj >= startObj && cDateObj <= endObj;
    });

    if (completedTasksInRange.length === 0) {
      return "No completed tasks in this range";
    }

    // 3) Return
    // Each entry should contain: taskId, title, description, completedDate, assignee
    return completedTasksInRange.map((t) => ({
      taskId: t.taskId,
      title: t.title,
      description: t.description,
      completedDate: t.completedDate,
      assignee: t.assignee,
    }));
  }

  markTaskAsCompleted(taskId, completionDate) {
    // 1) Find task
    const task = this._findTask(taskId);

    // 2) Validate completionDate format
    // (No "past" check is needed here for the “today” vs. “past,”
    // but we do need to ensure it’s valid & not leap-day.)
    this._parseDate(completionDate);

    // 3) Check that completion date is not before due date
    const compDateObj = this._toDateObject(completionDate);
    const dueDateObj = this._toDateObject(task.dueDate);
    if (compDateObj < dueDateObj) {
      throw new Error("Completion date cannot be before the due date");
    }

    // 4) Mark completed
    task.status = "completed";
    task.completedDate = completionDate;
    return `Task marked as completed on ${completionDate}`;
  }

  getOverdueTasks() {
    // Overdue => not completed AND dueDate < today
    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const overdueList = this.tasks.filter((task) => {
      if (task.status === "completed") return false;
      const dueDateObj = this._toDateObject(task.dueDate);
      return dueDateObj < todayMidnight;
    });

    if (overdueList.length === 0) {
      return "No overdue tasks";
    }

    // Return an array of overdue tasks
    return overdueList.map((t) => ({
      taskId: t.taskId,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      assignee: t.assignee,
    }));
  }
}

module.exports = { TeamProjectManagementSystem };