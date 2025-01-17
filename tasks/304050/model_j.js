class TaskManager {
    constructor() {
      this.tasks = {};
    }
  
    addTask(task, priority) {
      if (!this.tasks[task]) {
        this.tasks[task] = {
          priority,
          dependencies: [],
          completed: false,
        };
      }
    }
  
    addDependency(taskName, dependencyTaskName) {
      if (this.tasks[taskName] && this.tasks[dependencyTaskName]) {
        this.tasks[taskName].dependencies.push(dependencyTaskName);
      } else {
        throw new Error('Cannot add dependency to non-existent task');
      }
    }
  
    completeTask(taskName) {
      if (this.tasks[taskName]) {
        if (this.tasks[taskName].dependencies.some(dependency => !this.tasks[dependency].completed)) {
          throw new Error('Cannot complete task with uncompleted dependencies');
        }
        this.tasks[taskName].completed = true;
      } else {
        throw new Error('Task does not exist');
      }
    }
  
    getCompletedTasks() {
      return Object.keys(this.tasks).filter(task => this.tasks[task].completed);
    }
  
    getPendingTasks() {
      return Object.keys(this.tasks).filter(task => !this.tasks[task].completed);
    }
  }
  
  module.exports = TaskManager;