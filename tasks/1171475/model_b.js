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
    
    if (month === 2 && day === 29 && isLeapYear) {
      throw new Error("Leap year date");
    }

    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
      throw new Error("Invalid date format");
    }

    return new Date(year, month - 1, day);
  }

  isFutureDate(dateStr) {
    const inputDate = this.validateDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
  }

  findTaskById(taskId) {
    return this.tasks.find(task => task.taskId === taskId);
  }

  addTask(taskId, title, description, assignee, dueDate) {
    if (!taskId || !title || !description || !assignee || !dueDate) {
      throw new Error("Invalid task details");
    }

    if (!this.isFutureDate(dueDate)) {
      throw new Error("Due date cannot be in the past");
    }

    const task = {
      taskId,
      title,
      description,
      assignee,
      dueDate,
      status: "pending",
      completedDate: null
    };

    this.tasks.push(task);
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

    if (!this.isFutureDate(newDueDate)) {
      throw new Error("New due date cannot be in the past");
    }

    task.dueDate = newDueDate;
    return `Task due date updated to ${newDueDate}`;
  }

  getTasksByUser(user) {
    return this.tasks.filter(task => task.assignee === user);
  }

  generateTaskCompletionReport(startDate, endDate) {
    const start = this.validateDate(startDate);
    const end = this.validateDate(endDate);

    const completedTasks = this.tasks.filter(task => {
      if (task.status !== "completed" || !task.completedDate) return false;
      const completedDate = this.validateDate(task.completedDate);
      return completedDate >= start && completedDate <= end;
    });

    if (completedTasks.length === 0) {
      return "No completed tasks in this range";
    }

    return completedTasks.map(task => ({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      completedDate: task.completedDate,
      assignee: task.assignee
    }));
  }

  markTaskAsCompleted(taskId, completionDate) {
    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    this.validateDate(completionDate);
    const completionDateTime = this.validateDate(completionDate);
    const dueDateTime = this.validateDate(task.dueDate);

    if (completionDateTime < dueDateTime) {
      throw new Error("Completion date cannot be before the due date");
    }

    task.status = "completed";
    task.completedDate = completionDate;
    return `Task marked as completed on ${completionDate}`;
  }

  getOverdueTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = this.tasks.filter(task => {
      if (task.status === "completed") return false;
      const dueDate = this.validateDate(task.dueDate);
      return dueDate < today;
    });

    if (overdueTasks.length === 0) {
      return "No overdue tasks";
    }

    return overdueTasks.map(task => ({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      assignee: task.assignee
    }));
  }
}

module.exports = { TeamProjectManagementSystem };