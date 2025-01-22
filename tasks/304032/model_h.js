class TaskSchedulingSystem {
  constructor() {
    this.tasks = [];
    this.dependencies = new Map();
    this.priorities = new Map();
    this.executionTimes = new Map();
    this.groups = new Map();
  }
  //Priority could be low, medium, or high
  addTask(taskId, priority = 'medium', executionTime, group = 'default') {
    // Validate taskId
    if (typeof taskId !== 'string') {
      throw new Error('TaskId must be a string');
    }
    if (!taskId || taskId.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }
    // Convert taskId to lowercase
    const normalizedTaskId = taskId.toLowerCase();
    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      throw new Error('Priority must be either low, medium, or high');
    }
    // Validate executionTime
    if (typeof executionTime !== 'number' || executionTime <= 0) {
      throw new Error('Execution time must be a positive number');
    }
    // Check if a task already exists
    if (this.tasks.includes(normalizedTaskId)) {
      throw new Error(`Task with id ${normalizedTaskId} already exists`);
    }
    // Add task and update maps
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
    const scheduledTasks = [];
    const visitedTasks = new Set();
    const taskDependencies = new Map();
    let totalExecutionTime = 0;
    // Build task dependencies map
    for (const task of this.tasks) {
      taskDependencies.set(task, this.dependencies.get(task).slice());
    }
    // Define a recursive function to perform DFS
    function dfs(task) {
      if (visitedTasks.has(task)) {
        return;
      }
      visitedTasks.add(task);
      // Visit all dependencies first
      for (const dependency of taskDependencies.get(task)) {
        dfs(dependency);
      }
      // Add task to scheduled tasks list
      scheduledTasks.push(task);
    }
    // Perform DFS for all tasks
    for (const task of this.tasks) {
      dfs(task);
    }
    // Check for cyclic dependencies
    for (const task of this.tasks) {
      if (taskDependencies.get(task).length > 0) {
        throw new Error('Cyclic dependencies detected');
      }
    }
    // Sort scheduled tasks by priority
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
    for (const task of scheduledTasks) {
      totalExecutionTime += this.executionTimes.get(task);
    }
    return {
      scheduledTasks,
      totalExecutionTime
    };
  }
}
module.exports = {
  TaskSchedulingSystem
};