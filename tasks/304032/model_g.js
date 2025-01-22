class TaskSchedulingSystem {
  constructor() {
    this.tasks = [];
    this.dependencies = new Map();
    this.priorities = new Map();
    this.executionTimes = new Map();
    this.groups = new Map();
  }

  addTask(taskId, priority = 'medium', executionTime, group = 'default') {
    if (typeof taskId !== 'string') {
      throw new Error('TaskId must be a string');
    }
    if (!taskId || taskId.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }
    const normalizedTaskId = taskId.toLowerCase();
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      throw new Error('Priority must be either low, medium, or high');
    }
    if (typeof executionTime !== 'number' || executionTime <= 0) {
      throw new Error('Execution time must be a positive number');
    }
    if (this.tasks.includes(normalizedTaskId)) {
      throw new Error(`Task with id ${normalizedTaskId} already exists`);
    }
    this.tasks.push(normalizedTaskId);
    this.dependencies.set(normalizedTaskId, []);
    this.priorities.set(normalizedTaskId, priority.toLowerCase());
    this.executionTimes.set(normalizedTaskId, executionTime);
    this.groups.set(normalizedTaskId, group);
  }

  addDependency(taskId, dependencyId) {
    if (typeof taskId !== 'string' || !taskId.trim() || typeof dependencyId !== 'string' || !dependencyId.trim()) {
      throw new Error('Invalid taskId or dependencyId. Both should be non-empty strings.');
    }
    const normalizedTaskId = taskId.toLowerCase();
    const normalizedDependencyId = dependencyId.toLowerCase();
    if (!this.tasks.includes(normalizedDependencyId)) {
      throw new Error(`Dependency ${normalizedDependencyId} does not exist`);
    }
    if (this.tasks.includes(normalizedTaskId) && this.tasks.includes(normalizedDependencyId)) {
      this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
    }
  }

  scheduleTasksWithDependencies() {
    const visited = new Map();
    const scheduledTasks = [];
    const totalExecutionTime = 0;

    // Perform topological sorting using DFS
    for (const task of this.tasks) {
      if (!visited.has(task)) {
        this._dfs(task, visited, scheduledTasks);
      }
    }

    // Check for cyclic dependencies
    if (scheduledTasks.length !== this.tasks.length) {
      throw new Error('Cyclic dependencies detected');
    }

    // Sort tasks based on priority
    scheduledTasks.sort((a, b) => {
      const priorityA = this.priorities.get(a);
      const priorityB = this.priorities.get(b);
      if (priorityA === priorityB) {
        return 0;
      }
      if (priorityA === 'high') {
        return -1;
      }
      if (priorityB === 'high') {
        return 1;
      }
      if (priorityA === 'medium') {
        return -1;
      }
      return 1;
    });

    // Calculate total execution time
    let totalExecutionTime = 0;
    for (const task of scheduledTasks) {
      totalExecutionTime += this.executionTimes.get(task);
    }

    return {
      scheduledTasks,
      totalExecutionTime,
    };
  }

  _dfs(task, visited, scheduledTasks) {
    visited.set(task, true);
    const dependencies = this.dependencies.get(task);
    for (const dependency of dependencies) {
      if (!visited.has(dependency)) {
        this._dfs(dependency, visited, scheduledTasks);
      }
    }
    scheduledTasks.push(task);
  }
}

module.exports = {
  TaskSchedulingSystem,
};