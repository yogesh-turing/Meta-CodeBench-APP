class TaskManager {
    constructor() {
      this.tasks = new Map(); // Using Map for O(1) lookup
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
        isCompleted: false,
        dependencies: new Set()
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
      task.dependencies.add(dependencyTaskName);
    }
  
    completeTask(taskName) {
      if (!this.tasks.has(taskName)) {
        throw new Error('Task does not exist');
      }
  
      const task = this.tasks.get(taskName);
      
      // Check if all dependencies are completed
      for (const dependencyName of task.dependencies) {
        const dependency = this.tasks.get(dependencyName);
        if (!dependency.isCompleted) {
          throw new Error('Cannot complete task with uncompleted dependencies');
        }
      }
  
      task.isCompleted = true;
    }
  
    getCompletedTasks() {
      return Array.from(this.tasks.values())
        .filter(task => task.isCompleted)
        .map(task => task.name);
    }
  
    getPendingTasks() {
      return Array.from(this.tasks.values())
        .filter(task => !task.isCompleted)
        .map(task => task.name);
    }
  
    getTasks() {
      return Array.from(this.tasks.values());
    }
  }
  
  module.exports = TaskManager;