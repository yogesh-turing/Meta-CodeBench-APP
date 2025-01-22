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
    // Create a priority map for sorting
    const priorityValues = { high: 3, medium: 2, low: 1 };
    
    // Create in-degree count for each task
    const inDegree = new Map();
    this.tasks.forEach(task => {
      inDegree.set(task, 0);
    });

    // Calculate in-degree for each task
    this.tasks.forEach(task => {
      this.dependencies.get(task).forEach(dep => {
        inDegree.set(dep, inDegree.get(dep) + 1);
      });
    });

    // Create a priority queue of tasks with no dependencies
    const queue = this.tasks.filter(task => inDegree.get(task) === 0)
      .sort((a, b) => {
        const priorityDiff = priorityValues[this.priorities.get(b)] - 
                           priorityValues[this.priorities.get(a)];
        return priorityDiff !== 0 ? priorityDiff : a.localeCompare(b);
      });

    const scheduledTasks = [];
    let totalExecutionTime = 0;

    // Process the queue
    while (queue.length > 0) {
      const currentTask = queue.shift();
      scheduledTasks.push(currentTask);
      totalExecutionTime += this.executionTimes.get(currentTask);

      // Get all tasks that depend on the current task
      this.tasks.forEach(task => {
        const deps = this.dependencies.get(task);
        if (deps.includes(currentTask)) {
          inDegree.set(task, inDegree.get(task) - 1);
          if (inDegree.get(task) === 0) {
            // Insert task in the correct position based on priority
            let insertIndex = queue.length;
            for (let i = 0; i < queue.length; i++) {
              if (priorityValues[this.priorities.get(task)] > 
                  priorityValues[this.priorities.get(queue[i])]) {
                insertIndex = i;
                break;
              }
            }
            queue.splice(insertIndex, 0, task);
          }
        }
      });
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