class TaskSchedulingSystem {
  constructor() {
      this.tasks = [];
      this.dependencies = new Map();
      this.priorities = new Map();
      this.executionTimes = new Map();
      this.groups = new Map();
  }

  addTask(taskId, priority = 'medium', executionTime = 0, group = 'default') {
      if (typeof taskId !== 'string' || !taskId.trim()) {
          throw new Error('taskId should be a non-empty string');
      }
      if (!['high', 'medium', 'low'].includes(priority)) {
          throw new Error('priority should be one of high, medium, or low');
      }
      if (typeof executionTime !== 'number' || executionTime <= 0) {
          throw new Error('executionTime should be a positive number');
      }
      const normalizedTaskId = taskId.toLowerCase();
      if (!this.tasks.includes(normalizedTaskId)) {
          this.tasks.push(normalizedTaskId);
          this.dependencies.set(normalizedTaskId, []);
          this.priorities.set(normalizedTaskId, priority);
          this.executionTimes.set(normalizedTaskId, executionTime);
          this.groups.set(normalizedTaskId, group);
      }
  }

  addDependency(taskId, dependencyId) {
      if (typeof taskId !== 'string' || !taskId.trim()) {
          throw new Error('taskId should be a non-empty string');
      }
      if (typeof dependencyId !== 'string' || !dependencyId.trim()) {
          throw new Error('dependencyId should be a non-empty string');
      }
      const normalizedTaskId = taskId.toLowerCase();
      const normalizedDependencyId = dependencyId.toLowerCase();
      if (this.tasks.includes(normalizedTaskId) && this.tasks.includes(normalizedDependencyId)) {
          this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
      }
  }

  scheduleTasksWithDependencies() {
      const visited = new Set();
      const scheduledTasks = [];
      const groupTasks = {};
      let totalExecutionTime = 0;

      const dfs = (taskId) => {
          if (visited.has(taskId)) {
              throw new Error('Cyclic dependencies detected');
          }
          visited.add(taskId);
          const dependencies = this.dependencies.get(taskId);
          dependencies.forEach((dependency) => {
              if (!visited.has(dependency)) {
                  dfs(dependency);
              }
          });
          visited.delete(taskId);
          scheduledTasks.push(taskId);
      };

      this.tasks.forEach((taskId) => {
          if (!visited.has(taskId)) {
              dfs(taskId);
          }
      });

      scheduledTasks.sort((a, b) => {
          const priorityA = this.priorities.get(a);
          const priorityB = this.priorities.get(b);
          if (priorityA === priorityB) {
              return 0;
          }
          if (priorityA === 'high') {
              return -1;
          }
          if (priorityA === 'low') {
              return 1;
          }
          return 0;
      });

      scheduledTasks.forEach((taskId) => {
          const group = this.groups.get(taskId);
          if (!groupTasks[group]) {
              groupTasks[group] = [];
          }
          groupTasks[group].push(taskId);
      });

      Object.keys(groupTasks).forEach((group) => {
          const groupTaskIds = groupTasks[group];
          groupTaskIds.forEach((taskId) => {
              totalExecutionTime += this.executionTimes.get(taskId);
          });
      });

      return { scheduledTasks, totalExecutionTime };
  }
}

module.exports = {
  TaskSchedulingSystem
};