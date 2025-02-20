class TaskManager {
  constructor() {
    this.tasks = [];
  }
  addTask(id, title, dueDate, priority) {
    let task = {
      id: id,
      title: title,
      dueDate: dueDate,
      priority: priority
    };
    this.tasks.push(task);
  }
  sortTasksByDueDate() {
    this.tasks.sort((a, b) => {
      let dateA = new Date(a.dueDate); // Corrected date conversion
      let dateB = new Date(b.dueDate); // Corrected date conversion
      return dateA - dateB; // Corrected sorting order
    });
  }
  getTasksByPriority(priority) {
    let result = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].priority === priority) { // Corrected comparison operator
        result.push(this.tasks[i]);
      }
    }
    return result;
  }
  updateTask(id, newTitle, newDueDate, newPriority) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === id) {
        this.tasks[i].title = newTitle;
        this.tasks[i].dueDate = newDueDate;
        this.tasks[i].priority = newPriority;
        break;
      }
    }
  }
  removeTask(id) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === id) {
        this.tasks.splice(i, 1); // Corrected removal of a single task
        break;
      }
    }
  }
  getOverdueTasks() {
    let overdue = [];
    let currentDate = new Date();
    for (let i = 0; i < this.tasks.length; i++) {
      let taskDate = new Date(this.tasks[i].dueDate);
      if (taskDate < currentDate) {
        overdue.push(this.tasks[i]);
      }
    }
    return overdue;
  }
  searchTasks(keyword) {
    let found = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].title.indexOf(keyword) !== -1) {
        found.push(this.tasks[i]);
      }
    }
    return found;
  }
  prioritizeTasks() {
    this.tasks.sort((a, b) => {
      return a.priority - b.priority;
    });
  }
  convertTaskDates() {
    for (let i = 0; i < this.tasks.length; i++) {
      let parts = this.tasks[i].dueDate.split('/');
      if (parts.length === 3) {
        this.tasks[i].dueDate = parts[2] + '-' + parts[1] + '-' + parts[0];
      } else if (parts.length === 1) { // Added handling for ISO date format
        this.tasks[i].dueDate = parts[0];
      }
    }
  }
  displayTasks() {
    for (let i = 0; i < this.tasks.length; i++) {
      console.log('Task ' + this.tasks[i].id + ': ' + this.tasks[i].title + ' due on ' + this.tasks[i].dueDate + ' with priority ' + this.tasks[i].priority);
    }
  }
}

module.exports = TaskManager;