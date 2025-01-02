Base Code:
```javascript
class TaskSchedulingSystem {
    constructor() {
        this.tasks = [];
        this.dependencies = new Map();
    }

    // priority could be low, medium, high
    addTask(taskId, priority = 'medium', executionTime = 0, group = 'default') {
        // TODO - Add validation for priority, executionTime and group

        // Convert to lowercase
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
        // TODO - Add validation for taskId and dependencyId

        // TODO - convert to lowercase

        if (this.tasks.includes(taskId) && this.tasks.includes(dependencyId)) {
            this.dependencies.get(taskId).push(dependencyId);
        }
    }

    scheduleTasksWithDependencies() {
        // TODO - Implement the scheduling logic
        return [];
    }
}

module.exports = {
    TaskSchedulingSystem
};

```

Prompt:
Please help in completing the following requirements:
1. Update the addTask function to validate the taskId parameter
  - taskId should be a string.
  - taskId should be present, it should not be the null, undefined, or empty string.
  - taskId should be converted to lowercase before adding to the task array.
2. Update the addTask function to validate the priority
  - Priority should string and allow high, medium, and low values.
3. Update addTask function to validate executionTime
  - The executionTime parameter should be a positive number.
4. Update addDependency function to validate taskId and dependencyId as per the addTask function, and convert both parameters to lowercase.
5. Completed the function scheduleTasksWithDependencies:
  - The function should perform a topological sort on the tasks based on their dependencies.
  - It should detect cyclic dependencies and throw an error if any are found.
  - It should return the tasks in an order such that all of its dependencies are scheduled before any given task.
  - It should handle cases where there are no dependencies gracefully.
  - It should be efficient and handle large sets of tasks and dependencies.
  - It should ensure tasks with higher priority should be scheduled before tasks with lower priority, even if they have the same dependencies.
  - It should return the total estimated execution time for the scheduled tasks.
  - It should ensure that tasks within the same group are scheduled together.