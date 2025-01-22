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
    // Create a copy of dependencies for working with
    const inDegree = new Map();
    const dependencyCopy = new Map();
    
    // Initialize in-degree and dependency copy
    for (const task of this.tasks) {
      inDegree.set(task, 0);
      dependencyCopy.set(task, [...(this.dependencies.get(task) || [])]);
    }

    // Calculate in-degree for each task
    for (const [task, deps] of this.dependencies) {
      for (const dep of deps) {
        inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
      }
    }

    // Priority weight mapping
    const priorityWeight = {
      'high': 3,
      'medium': 2,
      'low': 1
    };

    // Get tasks with no dependencies
    const noIncoming = this.tasks.filter(task => inDegree.get(task) === 0)
      .sort((a, b) => {
        // Sort by priority for initial tasks
        return priorityWeight[this.priorities.get(b)] - priorityWeight[this.priorities.get(a)];
      });

    const scheduledTasks = [];
    let totalExecutionTime = 0;

    while (noIncoming.length > 0) {
      // Get next task (highest priority first)
      const task = noIncoming.shift();
      scheduledTasks.push(task);
      totalExecutionTime += this.executionTimes.get(task);

      // Process its dependencies
      const dependencies = dependencyCopy.get(task) || [];
      for (const dep of dependencies) {
        inDegree.set(dep, inDegree.get(dep) - 1);
        if (inDegree.get(dep) === 0) {
          noIncoming.push(dep);
          // Sort the queue by priority whenever new tasks are added
          noIncoming.sort((a, b) => 
            priorityWeight[this.priorities.get(b)] - priorityWeight[this.priorities.get(a)]
          );
        }
      }
    }

    // Check for cycles
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