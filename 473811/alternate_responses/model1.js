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
    // Handle both YYYY-MM-DD and DD/MM/YYYY formats
    const parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
    if (parts.length !== 3) {
      throw new Error("Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY");
    }
    
    if (dateStr.includes('/')) {
      // Convert from DD/MM/YYYY to YYYY-MM-DD
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateStr; // Already in YYYY-MM-DD format
  }

  sortTasksByDueDate() {
    this.tasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateB - dateA;
    });
  }

  getTasksByPriority(priority) {
    return this.tasks.filter(task => task.priority === priority);
  }

  updateTask(id, newTitle, newDueDate, newPriority) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      title: newTitle,
      dueDate: this.standardizeDateFormat(newDueDate),
      priority: newPriority
    };
  }

  removeTask(id) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
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