class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(id, title, dueDate, priority) {
    if (!id || !title || !dueDate || priority === undefined) {
      throw new Error("All task fields are required");
    }

    const task = {
      id: id,
      title: title,
      dueDate: this.standardizeDateFormat(dueDate),
      priority: priority
    };
    this.tasks.push(task);
  }

  standardizeDateFormat(dateStr) {
    // Convert any date string to YYYY-MM-DD format
    const date = new Date(dateStr.replace(/-/g, '/'));
    return date.toISOString().split('T')[0];
  }

  sortTasksByDueDate() {
    this.tasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB; // Changed to ascending order
    });
  }

  getTasksByPriority(priority) {
    if (priority === undefined) return [];
    return this.tasks.filter(task => task.priority === priority);
  }

  updateTask(id, newTitle, newDueDate, newPriority) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        title: newTitle || this.tasks[taskIndex].title,
        dueDate: newDueDate ? this.standardizeDateFormat(newDueDate) : this.tasks[taskIndex].dueDate,
        priority: newPriority !== undefined ? newPriority : this.tasks[taskIndex].priority
      };
    }
  }

  removeTask(id) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1); // Remove only one task
    }
  }

  getOverdueTasks() {
    const currentDate = new Date();
    return this.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate < currentDate;
    });
  }

  searchTasks(keyword) {
    if (!keyword) return [];
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  prioritizeTasks() {
    this.tasks.sort((a, b) => a.priority - b.priority);
  }

  convertTaskDates() {
    this.tasks = this.tasks.map(task => ({
      ...task,
      dueDate: this.standardizeDateFormat(task.dueDate)
    }));
  }

  displayTasks() {
    this.tasks.forEach(task => {
      console.log(`Task ${task.id}: ${task.title} due on ${task.dueDate} with priority ${task.priority}`);
    });
  }
}

module.exports = { TaskManager };