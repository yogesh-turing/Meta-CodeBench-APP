class TeamProjectManagementSystem {
  constructor() {
    this.tasks = [];
  }

  validateDate(dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error("Invalid date format");
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
    if (month < 1 || month > 12 || day < 1) {
      throw new Error("Invalid date format");
    }

    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month - 1]) {
      throw new Error("Invalid date format");
    }

    if (isLeapYear && month === 2 && day === 29) {
      throw new Error("Leap year date");
    }

    return new Date(year, month - 1, day);
  }

  compareDates(date1, date2) {
    return date1.getTime() - date2.getTime();
  }

  findTaskById(taskId) {
    return this.tasks.find(task => task.taskId === taskId);
  }

  addTask(taskId, title, description, assignee, dueDate) {
    if (!taskId || !title || !description || !assignee || !dueDate) {
      throw new Error("Invalid task details");
    }

    const parsedDueDate = this.validateDate(dueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.compareDates(parsedDueDate, currentDate) < 0) {
      throw new Error("Due date cannot be in the past");
    }

    this.tasks.push({
      taskId,
      title,
      description,
      assignee,
      dueDate,
      status: "pending",
      completedDate: null
    });

    return `Task "${title}" added to the system!`;
  }

  assignTaskToUser(taskId, user) {
    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.assignee === user) {
      return "Task is already assigned to the user";
    }

    task.assignee = user;
    return `Task assigned to ${user}`;
  }

  updateTaskDueDate(taskId, newDueDate) {
    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const parsedNewDueDate = this.validateDate(newDueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.compareDates(parsedNewDueDate, currentDate) < 0) {
      throw new Error("New due date cannot be in the past");
    }

    task.dueDate = newDueDate;
    return `Task due date updated to ${newDueDate}`;
  }

  getTasksByUser(user) {
    return this.tasks.filter(task => task.assignee === user).map(task => ({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      assignee: task.assignee
    }));
  }

  generateTaskCompletionReport(startDate, endDate) {
    const parsedStartDate = this.validateDate(startDate);
    const parsedEndDate = this.validateDate(endDate);

    const completedTasks = this.tasks.filter(task => {
      if (task.status !== "completed" || !task.completedDate) return false;
      const completedDate = this.validateDate(task.completedDate);
      return this.compareDates(completedDate, parsedStartDate) >= 0 &&
             this.compareDates(completedDate, parsedEndDate) <= 0;
    }).map(task => ({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      completedDate: task.completedDate,
      assignee: task.assignee
    }));

    return completedTasks.length ? completedTasks : "No completed tasks in this range";
  }

  markTaskAsCompleted(taskId, completionDate) {
    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const parsedCompletionDate = this.validateDate(completionDate);
    const parsedDueDate = this.validateDate(task.dueDate);

    if (this.compareDates(parsedCompletionDate, parsedDueDate) < 0) {
      throw new Error("Completion date cannot be before the due date");
    }

    task.status = "completed";
    task.completedDate = completionDate;
    return `Task marked as completed on ${completionDate}`;
  }

  getOverdueTasks() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const overdueTasks = this.tasks.filter(task => {
      if (task.status === "completed") return false;
      const dueDate = this.validateDate(task.dueDate);
      return this.compareDates(dueDate, currentDate) < 0;
    }).map(task => ({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      assignee: task.assignee
    }));

    return overdueTasks.length ? overdueTasks : "No overdue tasks";
  }
}

module.exports = { TeamProjectManagementSystem };