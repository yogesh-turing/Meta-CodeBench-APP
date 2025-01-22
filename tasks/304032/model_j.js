class TaskSchedulingSystem {
  constructor() {
    this.tasks = [];
    this.dependencies = new Map();
    this.priorities = new Map();
    this.executionTimes = new Map();
    this.groups = new Map();
  }

  // Priority could be low, medium, or high
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
    // Create a graph from the dependencies
    const graph = new Map();
    for (const task of this.tasks) {
      graph.set(task, this.dependencies.get(task));
    }

    // Perform topological sorting using DFS
    const visited = new Set();
    const scheduledTasks = [];
    let totalExecutionTime = 0;

    // Define a helper function for DFS
    const dfs = (task) => {
      if (visited.has(task)) {
        // If the task is already visited, it means there's a cycle
        throw new Error('Cyclic dependency detected');
      }

      visited.add(task);

      // Visit all dependencies first
      for (const dependency of graph.get(task)) {
        if (!visited.has(dependency)) {
          dfs(dependency);
        }
      }

      // Schedule the task after all its dependencies
      scheduledTasks.push(task);
      totalExecutionTime += this.executionTimes.get(task);
    };

    // Sort tasks by priority before scheduling
    const sortedTasks = [...this.tasks].sort((a, b) => {
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
      return 0;
    });

    // Schedule tasks
    for (const task of sortedTasks) {
      if (!visited.has(task)) {
        dfs(task);
      }
    }

    return {
      scheduledTasks,
      totalExecutionTime,
    };
  }
}

module.exports = {
  TaskSchedulingSystem,
};