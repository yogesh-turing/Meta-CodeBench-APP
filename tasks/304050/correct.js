class TaskManager {
    constructor() {
      this.tasks = [];
      this.completedTasks = new Set();
      this.dependencies = {};
    }
  
    addTask(task, priority) {
      this.tasks.push({ task, priority, completed: false });
    }
  
    addDependency(taskName, dependencyTaskName) {
      const taskExists = this.tasks.some((task) => task.task === taskName);
      const dependencyExists = this.tasks.some(
        (task) => task.task === dependencyTaskName
      );
  
      if (!taskExists || !dependencyExists) {
        throw new Error("Task or dependency does not exist");
      }
  
      if (!this.dependencies[taskName]) {
        this.dependencies[taskName] = [];
      }
      this.dependencies[taskName].push(dependencyTaskName);
    }
  
    completeTask(taskName) {
      if (!this.tasks.some((task) => task.task === taskName)) {
        throw new Error("Task does not exist");
      }
      const uncompletedDependencies =
        this.dependencies[taskName]?.filter((dependency) => {
          return !this.completedTasks.has(dependency);
        }) || [];
  
      if (uncompletedDependencies.length > 0) {
        throw new Error("Cannot complete task with uncompleted dependencies");
      }
  
      this.tasks.find((task) => task.task === taskName).completed = true;
      this.completedTasks.add(taskName);
    }
  
    getTasks() {
      return this.tasks;
    }
  
    getCompletedTasks() {
      return Array.from(this.completedTasks);
    }
  
    getPendingTasks() {
      return this.tasks
        .filter((task) => !task.completed)
        .map((task) => task.task);
    }
  }
  
  module.exports = TaskManager;
  