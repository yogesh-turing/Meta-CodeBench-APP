class TeamProjectManagementSystem {
  constructor() {
    this.tasks = [];
  }

  validateDate(dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error("Invalid date format");
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      throw new Error("Invalid date format");
    }

    if (month === 2 && day === 29) {
      throw new Error("Leap year date");
    }

    return date;
  }

  isDateInPast(dateStr) {
    const date = this.validateDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  findTaskById(taskId) {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  addTask(taskId, title, description, assignee, dueDate) {
    if (!taskId || !title || !description || !assignee || !dueDate) {
      throw new Error("Invalid task details");
    }

    this.validateDate(dueDate);

    if (this.isDateInPast(dueDate)) {
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
    
    if (task.assignee === user) {
      return "Task is already assigned to the user";
    }

    task.assignee = user;
    return `Task assigned to ${user}`;
  }

  updateTaskDueDate(taskId, newDueDate) {
    this.validateDate(newDueDate);
    
    if (this.isDateInPast(newDueDate)) {
      throw new Error("New due date cannot be in the past");
    }

    const task = this.findTaskById(taskId);
    task.dueDate = newDueDate;
    return `Task due date updated to ${newDueDate}`;
  }

  getTasksByUser(user) {
    return this.tasks.filter(task => task.assignee === user);
  }

  generateTaskCompletionReport(startDate, endDate) {
    this.validateDate(startDate);
    this.validateDate(endDate);

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
    this.validateDate(completionDate);
    const task = this.findTaskById(taskId);
    
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