Base Code:
```js
class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(task, priority) {
    this.tasks.push({ task, priority });
  }

  getTasks() {
    return this.tasks;
  }
}

module.exports = TaskManager;

```
Prompt:
Enhance the TaskManager class to include a feature for task dependencies and task completion. Implement the following methods:

- addDependency(taskName, dependencyTaskName): This method should establish a dependency between taskName and dependencyTaskName. A task cannot be completed if it has uncompleted dependencies.

- completeTask(taskName): Marks a task as complete. Throws an error with message Cannot complete task with uncompleted dependencies if any dependencies are not yet complete.

- getCompletedTasks(): Returns a list of names of the completed tasks

getPendingTasks(): Returns a list of names of the pending tasks. Note: A task is considered pending if not marked completed.

Ensure that dependencies can be multiple. Handle edge cases such as adding non existing dependencies. Also ensure that when adding new tasks that their state is pending.