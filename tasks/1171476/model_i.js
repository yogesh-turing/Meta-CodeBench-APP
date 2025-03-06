class TeamProjectManagementSystem {
  constructor() {
    this.tasks = [];
  }

  //---------------------------------------------------------------------------
  // Utility Methods
  //---------------------------------------------------------------------------
  // Simple check for valid YYYY-MM-DD using a regex
  // Also disallows leap-year Feb 29 dates by throwing "Leap year date".
  _validateDateFormat(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new Error("Invalid date format");
    }
    const [yyyy, mm, dd] = dateString.split("-").map(Number);

    // Throw if it's a recognized leap-day date
    if (this._isLeapYear(yyyy) && mm === 2 && dd === 29) {
      throw new Error("Leap year date");
    }

    // Validate month-day boundaries by constructing a Date and re-checking
    const testDate = new Date(yyyy, mm - 1, dd);
    if (
      testDate.getFullYear() !== yyyy ||
      testDate.getMonth() + 1 !== mm ||
      testDate.getDate() !== dd
    ) {
      throw new Error("Invalid date format");
    }
    return testDate;
  }

  _isLeapYear(year) {
    // Standard leap year check:
    //   divisible by 400 -> leap year
    //   else if divisible by 100 -> not leap year
    //   else if divisible by 4 -> leap year
    //   else -> not leap year
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
  }

  _isDateInPast(date) {
    const now = new Date();
    // Compare just by year-month-day (ignore time).
    const parsedToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date < parsedToday;
  }

  //---------------------------------------------------------------------------
  // 1) addTask
  //---------------------------------------------------------------------------
  addTask(taskId, title, description, assignee, dueDate) {
    // Basic detail checks
    if (!taskId || !title || !description || !assignee || !dueDate) {
      throw new Error("Invalid task details");
    }

    // Validate the dueDate format (also disallows leap-year date)
    const parsedDate = this._validateDateFormat(dueDate);

    // Ensure the due date is in the future
    if (this._isDateInPast(parsedDate)) {
      throw new Error("Due date cannot be in the past");
    }

    // Store the task
    this.tasks.push({
      taskId,
      title,
      description,
      assignee,
      dueDate, // keep as user-provided string
      status: "pending",
      completedDate: null,
    });

    return `Task "${title}" added to the system!`;
  }

  //---------------------------------------------------------------------------
  // 2) assignTaskToUser
  //---------------------------------------------------------------------------
  assignTaskToUser(taskId, user) {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.assignee === user) {
      return "Task is already assigned to the user";
    }
    task.assignee = user;
    return `Task assigned to ${user}`;
  }

  //---------------------------------------------------------------------------
  // 3) updateTaskDueDate
  //---------------------------------------------------------------------------
  updateTaskDueDate(taskId, newDueDate) {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const parsedDate = this._validateDateFormat(newDueDate);

    // Must be in the future
    if (this._isDateInPast(parsedDate)) {
      throw new Error("New due date cannot be in the past");
    }

    task.dueDate = newDueDate;
    return `Task due date updated to ${newDueDate}`;
  }

  //---------------------------------------------------------------------------
  // 4) getTasksByUser
  //---------------------------------------------------------------------------
  getTasksByUser(user) {
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

  //---------------------------------------------------------------------------
  // 5) generateTaskCompletionReport
  //---------------------------------------------------------------------------
  generateTaskCompletionReport(startDate, endDate) {
    // Validate dates
    const parsedStart = this._validateDateFormat(startDate);
    const parsedEnd = this._validateDateFormat(endDate);

    // Filter completed tasks whose completedDate is in [startDate, endDate]
    const report = this.tasks
      .filter((task) => task.status === "completed" && task.completedDate)
      .filter((task) => {
        // Convert the task's completedDate to a Date object
        const cDate = this._validateDateFormat(task.completedDate);
        return cDate >= parsedStart && cDate <= parsedEnd;
      })
      .map((t) => ({
        taskId: t.taskId,
        title: t.title,
        description: t.description,
        completedDate: t.completedDate,
        assignee: t.assignee,
      }));

    if (report.length === 0) {
      return "No completed tasks in this range";
    }

    return report;
  }

  //---------------------------------------------------------------------------
  // 6) markTaskAsCompleted
  //---------------------------------------------------------------------------
  markTaskAsCompleted(taskId, completionDate) {
    const task = this.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const parsedCompleteDate = this._validateDateFormat(completionDate);
    const parsedDueDate = this._validateDateFormat(task.dueDate);

    if (parsedCompleteDate < parsedDueDate) {
      throw new Error("Completion date cannot be before the due date");
    }

    task.status = "completed";
    task.completedDate = completionDate;

    return `Task marked as completed on ${completionDate}`;
  }

  //---------------------------------------------------------------------------
  // 7) getOverdueTasks
  //---------------------------------------------------------------------------
  getOverdueTasks() {
    // Overdue = not completed AND dueDate < today
    const overdue = this.tasks.filter((t) => {
      if (t.status === "completed") return false;
      const taskDue = this._validateDateFormat(t.dueDate);
      return this._isDateInPast(taskDue);
    });

    if (overdue.length === 0) {
      return "No overdue tasks";
    }

    // Return an array of overdue tasks
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