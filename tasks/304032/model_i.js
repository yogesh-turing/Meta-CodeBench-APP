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
    const visited = new Map();
    const scheduledTasks = [];
    let totalExecutionTime = 0;

    const visitTask = (taskId) => {
      if (visited.get(taskId) === 'visiting') {
        throw new Error(`Cyclic dependency detected for task ${taskId}`);
      }
      if (visited.get(taskId) === 'visited') {
        return;
      }
      visited.set(taskId, 'visiting');
      const dependencies = this.dependencies.get(taskId);
      dependencies.forEach(dependencyId => {
        visitTask(dependencyId);
      });
      visited.set(taskId, 'visited');
      scheduledTasks.push(taskId);
      totalExecutionTime += this.executionTimes.get(taskId);
    };

    // Sort tasks by priority
    const tasksByPriority = Array.from(this.tasks).sort((a, b) => {
      const priorityA = this.priorities.get(a);
      const priorityB = this.priorities.get(b);
      const priorityOrder = ['high', 'medium', 'low'];
      return priorityOrder.indexOf(priorityA) - priorityOrder.indexOf(priorityB);
    });

    tasksByPriority.forEach(taskId => {
      visitTask(taskId);
    });

    return {
      scheduledTasks,
      totalExecutionTime
    };
  }
}
module.exports = {
  TaskSchedulingSystem
};