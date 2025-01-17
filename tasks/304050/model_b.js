class TaskManager {
    constructor() {
      this.tasks = new Map();
    }
  
    addTask(taskName, priority) {
      if (typeof taskName !== 'string' || taskName.trim() === '') {
        throw new Error('Task name must be a non-empty string');
      }
      
      if (this.tasks.has(taskName)) {
        throw new Error('Task already exists');
      }
  
      this.tasks.set(taskName, {
        name: taskName,
        priority,
        dependencies: new Set(),
        completed: false
      });
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
  
      const task = this.tasks.get(taskName);
      
      // Check for circular dependencies
      if (this.wouldCreateCircularDependency(dependencyTaskName, taskName)) {
        throw new Error('Circular dependency detected');
      }
  
      task.dependencies.add(dependencyTaskName);
    }
  
    wouldCreateCircularDependency(taskName, dependencyTaskName, visited = new Set()) {
      if (taskName === dependencyTaskName) return true;
      if (visited.has(taskName)) return false;
      
      visited.add(taskName);
      const task = this.tasks.get(taskName);
      
      for (const dependency of task.dependencies) {
        if (this.wouldCreateCircularDependency(dependency, dependencyTaskName, visited)) {
          return true;
        }
      }
      
      return false;
    }
  
    completeTask(taskName) {
      if (!this.tasks.has(taskName)) {
        throw new Error('Task does not exist');
      }
  
      const task = this.tasks.get(taskName);
      
      // Check if all dependencies are completed
      for (const dependency of task.dependencies) {
        const dependencyTask = this.tasks.get(dependency);
        if (!dependencyTask.completed) {
          throw new Error('Cannot complete task with uncompleted dependencies');
        }
      }
  
      task.completed = true;
    }
  
    getCompletedTasks() {
      return Array.from(this.tasks.values())
        .filter(task => task.completed)
        .map(task => task.name);
    }
  
    getPendingTasks() {
      return Array.from(this.tasks.values())
        .filter(task => !task.completed)
        .map(task => task.name);
    }
  
    getTasks() {
      return Array.from(this.tasks.values());
    }
  }
  
  module.exports = TaskManager;