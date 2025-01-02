class TaskSchedulingSystem {
    constructor() {
        this.tasks = [];
        this.dependencies = new Map();
    }

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