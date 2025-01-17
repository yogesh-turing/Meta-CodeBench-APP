class TaskManager {
    constructor() {
      this.tasks = new Map(); // Store task details
      this.dependencies = new Map(); // Store task dependencies
      this.completedTasks = new Set(); // Track completed tasks
    }
  
    addTask(taskName, priority) {
      if (!taskName) {
        throw new Error('Task name is required');
      }
      this.tasks.set(taskName, {
        name: taskName,
        priority: priority,
      });
      this.dependencies.set(taskName, new Set());
    }
  
    addDependency(taskName, dependencyTaskName) {
      if (!this.tasks.has(taskName)) {
        throw new Error('Task does not exist');
      }
      if (!this.tasks.has(dependencyTaskName)) {
        throw new Error('Dependency task does not exist');
      }
      if (taskName === dependencyTaskName) {
        throw new Error('Task cannot depend on itself');
      }
  
      // Get current dependencies and add new one
      const dependencies = this.dependencies.get(taskName);
      dependencies.add(dependencyTaskName);
    }
  
    completeTask(taskName) {
      if (!this.tasks.has(taskName)) {
        throw new Error('Task does not exist');
      }
  
      // Check if all dependencies are completed
      const dependencies = this.dependencies.get(taskName);
      for (const dependency of dependencies) {
        if (!this.completedTasks.has(dependency)) {
          throw new Error('Cannot complete task with uncompleted dependencies');
        }
      }
  
      this.completedTasks.add(taskName);
    }
  
    getCompletedTasks() {
      return Array.from(this.completedTasks);
    }
  
    getPendingTasks() {
      return Array.from(this.tasks.keys())
        .filter(taskName => !this.completedTasks.has(taskName));
    }
  
    getTasks() {
      const taskList = [];
      for (const [taskName, taskDetails] of this.tasks) {
        taskList.push({
          ...taskDetails,
          completed: this.completedTasks.has(taskName),
          dependencies: Array.from(this.dependencies.get(taskName))
        });
      }
      return taskList;
    }
  }
  
  module.exports = TaskManager;