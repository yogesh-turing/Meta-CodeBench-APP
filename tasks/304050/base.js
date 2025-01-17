class TaskManager {
    constructor() {
      this.tasks = [];
    }
  
    addTask(task, priority) {
      this.tasks.push({ task, priority });
    }
  
    getTasks() {
      return this.tasks;
    }
  }
  
  module.exports = TaskManager;