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
    // Create a copy of dependencies for modification
    const dependencyCounts = new Map();
    const dependencyGraph = new Map();
    
    // Initialize the dependency counts and graph
    for (const task of this.tasks) {
      dependencyCounts.set(task, 0);
      dependencyGraph.set(task, [...this.dependencies.get(task)]);
    }

    // Count dependencies for each task
    for (const [task, deps] of dependencyGraph) {
      for (const dep of deps) {
        dependencyCounts.set(dep, (dependencyCounts.get(dep) || 0));
        dependencyCounts.set(task, (dependencyCounts.get(task) || 0) + 1);
      }
    }

    // Priority weight mapping for sorting
    const priorityWeight = {
      'high': 3,
      'medium': 2,
      'low': 1
    };

    // Find all tasks with no dependencies
    const noDepTasks = [];
    for (const [task, count] of dependencyCounts) {
      if (count === 0) {
        noDepTasks.push(task);
      }
    }

    // Sort initial tasks by priority
    noDepTasks.sort((a, b) => {
      return priorityWeight[this.priorities.get(b)] - priorityWeight[this.priorities.get(a)];
    });

    const scheduledTasks = [];
    let totalExecutionTime = 0;

    // Process tasks in topological order
    while (noDepTasks.length > 0) {
      const currentTask = noDepTasks.shift();
      scheduledTasks.push(currentTask);
      totalExecutionTime += this.executionTimes.get(currentTask);

      // Find tasks that depend on the current task
      for (const [task, deps] of dependencyGraph) {
        if (deps.includes(currentTask)) {
          deps.splice(deps.indexOf(currentTask), 1);
          dependencyCounts.set(task, dependencyCounts.get(task) - 1);

          // If all dependencies are processed, add to noDepTasks
          if (dependencyCounts.get(task) === 0) {
            noDepTasks.push(task);
            // Re-sort noDepTasks by priority whenever new tasks are added
            noDepTasks.sort((a, b) => {
              return priorityWeight[this.priorities.get(b)] - priorityWeight[this.priorities.get(a)];
            });
          }
        }
      }
    }

    // Check for cyclic dependencies
    if (scheduledTasks.length !== this.tasks.length) {
      throw new Error('Cyclic dependency detected');
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