class TaskManager {
    constructor() {
      this.tasks = {};
    }
  
    addTask(taskName, priority) {
      if (this.tasks[taskName]) {
        throw new Error(`Task ${taskName} already exists`);
      }
      this.tasks[taskName] = { taskName, priority, completed: false, dependencies: [] };
    }
  
    addDependency(taskName, dependencyTaskName) {
      if (!this.tasks[taskName]) {
        throw new Error(`Task ${taskName} does not exist`);
      }
      if (!this.tasks[dependencyTaskName]) {
        throw new Error(`Dependency task ${dependencyTaskName} does not exist`);
      }
      this.tasks[taskName].dependencies.push(dependencyTaskName);
    }
  
    completeTask(taskName) {
      if (!this.tasks[taskName]) {
        throw new Error(`Task ${taskName} does not exist`);
      }
      if (this.tasks[taskName].dependencies.some(dependency => !this.tasks[dependency].completed)) {
        throw new Error('Cannot complete task with uncompleted dependencies');
      }
      this.tasks[taskName].completed = true;
    }
  
    getCompletedTasks() {
      return Object.values(this.tasks).filter(task => task.completed).map(task => task.taskName);
    }
  
    getPendingTasks() {
      return Object.values(this.tasks).filter(task => !task.completed).map(task => task.taskName);
    }
  }
  
  module.exports = TaskManager;