class TaskSchedulingSystem {
  constructor() {
    this.tasks = [];
    this.dependencies = new Map();
    this.priorities = new Map();
    this.executionTimes = new Map();
    this.groups = new Map();
  }

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
    const visited = new Set();
    const inProgress = new Set();
    const scheduledTasks = [];
    let totalExecutionTime = 0;

    for (const task of this.tasks) {
      if (!visited.has(task)) {
        this.topologicalSort(task, visited, inProgress, scheduledTasks);
      }
    }

    // Sort tasks by priority
    scheduledTasks.sort((a, b) => {
      const priorityA = this.priorities.get(a);
      const priorityB = this.priorities.get(b);
      if (priorityA === priorityB) {
        return 0;
      } else if (priorityA === 'high') {
        return -1;
      } else if (priorityA === 'low') {
        return 1;
      } else if (priorityB === 'high') {
        return 1;
      } else if (priorityB === 'low') {
        return -1;
      }
    });

    for (const task of scheduledTasks) {
      totalExecutionTime += this.executionTimes.get(task);
    }

    return { scheduledTasks, totalExecutionTime };
  }

  topologicalSort(task, visited, inProgress, scheduledTasks) {
    if (inProgress.has(task)) {
      throw new Error(`Cyclic dependency detected for task ${task}`);
    }

    if (!visited.has(task)) {
      inProgress.add(task);
      const dependencies = this.dependencies.get(task);
      for (const dependency of dependencies) {
        if (!visited.has(dependency)) {
          this.topologicalSort(dependency, visited, inProgress, scheduledTasks);
        }
      }
      inProgress.delete(task);
      visited.add(task);
      scheduledTasks.push(task);
    }
  }
}

module.exports = {
  TaskSchedulingSystem
};