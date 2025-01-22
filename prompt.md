Base Code:
```javascript
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
    // TODO - Implement the scheduling logic
    return {
        scheduledTasks: [], 
        totalExecutionTime: 0
    };
  }
}
module.exports = {
  TaskSchedulingSystem
};
```
Prompt:
Please help in completing the `scheduleTasksWithDependencies` function:
  - The function should perform a topological sort on the tasks based on their dependencies.
  - It should detect cyclic dependencies and throw an error if any are found.
  - It should return the tasks in an order in which all their dependencies are scheduled before any given task.
  - It should handle cases gracefully where there are no dependencies.
  - It should be efficient and handle large sets of tasks and dependencies.
  - It should ensure that tasks with higher priority are scheduled before tasks with lower priority, even if they have the same dependencies.
  - It should return the total estimated execution time for the scheduled tasks.
  - It should ensure that tasks within the same group are scheduled together.

Please return the complete code of the TaskSchedulingSystem class.
