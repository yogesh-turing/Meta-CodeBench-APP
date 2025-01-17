class TaskManager {
    constructor() {
      this.tasks = {};
    }
  
    addTask(task, priority) {
      this.tasks[task] = {
        priority,
        dependencies: [],
        completed: false,
      };
    }
  
    addDependency(taskName, dependencyTaskName) {
      if (!this.tasks[taskName]) {
        throw new Error(`Task '${taskName}' does not exist`);
      }
      if (!this.tasks[dependencyTaskName]) {
        throw new Error(`Dependency task '${dependencyTaskName}' does not exist`);
      }
      this.tasks[taskName].dependencies.push(dependencyTaskName);
    }
  
    completeTask(taskName) {
      if (!this.tasks[taskName]) {
        throw new Error(`Task '${taskName}' does not exist`);
      }
      if (this.tasks[taskName].dependencies.some((dependency) => !this.tasks[dependency].completed)) {
        throw new Error("Cannot complete task with uncompleted dependencies");
      }
      this.tasks[taskName].completed = true;
    }
  
    getCompletedTasks() {
      return Object.keys(this.tasks).filter((task) => this.tasks[task].completed);
    }
  
    getPendingTasks() {
      return Object.keys(this.tasks).filter((task) => !this.tasks[task].completed);
    }
  }
  
  module.exports = TaskManager;