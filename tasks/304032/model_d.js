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
    // Create a copy of dependencies to work with
    const inDegree = new Map();
    const dependenciesCopy = new Map();
    
    // Initialize in-degree and dependencies copy
    for (const task of this.tasks) {
      inDegree.set(task, 0);
      dependenciesCopy.set(task, [...this.dependencies.get(task)]);
    }

    // Calculate in-degree for each task
    for (const task of this.tasks) {
      for (const dep of this.dependencies.get(task)) {
        inDegree.set(dep, inDegree.get(dep) + 1);
      }
    }

    // Priority weight mapping
    const priorityWeight = {
      'high': 3,
      'medium': 2,
      'low': 1
    };

    // Queue of tasks with no dependencies
    const noIncoming = this.tasks.filter(task => inDegree.get(task) === 0)
      .sort((a, b) => {
        return priorityWeight[this.priorities.get(b)] - priorityWeight[this.priorities.get(a)];
      });

    const scheduledTasks = [];
    let totalExecutionTime = 0;

    while (noIncoming.length > 0) {
      const currentTask = noIncoming.shift();
      scheduledTasks.push(currentTask);
      totalExecutionTime += this.executionTimes.get(currentTask);

      // Process all tasks that depend on the current task
      for (const [task, deps] of dependenciesCopy.entries()) {
        const index = deps.indexOf(currentTask);
        if (index !== -1) {
          deps.splice(index, 1);
          inDegree.set(task, inDegree.get(task) - 1);
          
          if (inDegree.get(task) === 0) {
            noIncoming.push(task);
            // Re-sort the queue based on priorities
            noIncoming.sort((a, b) => {
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