class TaskSchedulingSystem {
    constructor() {
        this.tasks = [];
        this.dependencies = new Map();
        this.priorities = new Map();
        this.executionTimes = new Map();
        this.groups = new Map();
    }

    validateTaskId(taskId) {
        if (typeof taskId !== 'string') {
            throw new Error('TaskId must be a string');
        }
        if (!taskId || taskId.trim() === '') {
            throw new Error('TaskId cannot be empty');
        }
        return taskId.toLowerCase();
    }

    validatePriority(priority) {
        const validPriorities = ['high', 'medium', 'low'];
        const normalizedPriority = priority.toLowerCase();
        if (!validPriorities.includes(normalizedPriority)) {
            throw new Error('Priority must be one of: high, medium, low');
        }
        return normalizedPriority;
    }

    validateExecutionTime(executionTime) {
        if (typeof executionTime !== 'number' || executionTime < 0) {
            throw new Error('Execution time must be a positive number');
        }
        return executionTime;
    }

    addTask(taskId, priority = 'medium', executionTime = 0, group = 'default') {
        const normalizedTaskId = this.validateTaskId(taskId);
        const validatedPriority = this.validatePriority(priority);
        const validatedExecutionTime = this.validateExecutionTime(executionTime);
        
        if (!this.tasks.includes(normalizedTaskId)) {
            this.tasks.push(normalizedTaskId);
            this.dependencies.set(normalizedTaskId, []);
            this.priorities.set(normalizedTaskId, validatedPriority);
            this.executionTimes.set(normalizedTaskId, validatedExecutionTime);
            this.groups.set(normalizedTaskId, group);
        }
    }

    addDependency(taskId, dependencyId) {
        const normalizedTaskId = this.validateTaskId(taskId);
        const normalizedDependencyId = this.validateTaskId(dependencyId);

        if (!this.tasks.includes(normalizedTaskId)) {
            throw new Error(`Task ${normalizedTaskId} does not exist`);
        }
        if (!this.tasks.includes(normalizedDependencyId)) {
            throw new Error(`Dependency ${normalizedDependencyId} does not exist`);
        }

        if (normalizedTaskId === normalizedDependencyId) {
            throw new Error('Task cannot depend on itself');
        }

        this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
    }

    scheduleTasksWithDependencies() {
        const visited = new Set();
        const temp = new Set();
        const scheduled = [];
        let totalExecutionTime = 0;

        // Group tasks by priority and group
        const tasksByPriorityAndGroup = new Map();
        const priorityOrder = ['high', 'medium', 'low'];

        // Initialize priority and group mapping
        for (const priority of priorityOrder) {
            tasksByPriorityAndGroup.set(priority, new Map());
        }

        // Organize tasks by priority and group
        for (const task of this.tasks) {
            const priority = this.priorities.get(task);
            const group = this.groups.get(task);
            
            if (!tasksByPriorityAndGroup.get(priority).has(group)) {
                tasksByPriorityAndGroup.get(priority).set(group, []);
            }
            tasksByPriorityAndGroup.get(priority).get(group).push(task);
        }

        const detectCycle = (task) => {
            if (temp.has(task)) {
                throw new Error(`Cyclic dependency detected involving task: ${task}`);
            }
            if (visited.has(task)) {
                return;
            }

            temp.add(task);

            for (const dependency of this.dependencies.get(task)) {
                detectCycle(dependency);
            }

            temp.delete(task);
            visited.add(task);
        };

        const scheduleTask = (task) => {
            if (visited.has(task)) {
                return;
            }

            // Process dependencies first
            for (const dependency of this.dependencies.get(task)) {
                scheduleTask(dependency);
            }

            if (!scheduled.includes(task)) {
                scheduled.push(task);
                totalExecutionTime += this.executionTimes.get(task);
            }
            visited.add(task);
        };

        // Check for cycles first
        for (const task of this.tasks) {
            if (!visited.has(task)) {
                detectCycle(task);
            }
        }

        // Reset visited set for actual scheduling
        visited.clear();

        // Schedule tasks by priority and group
        for (const priority of priorityOrder) {
            const groupMap = tasksByPriorityAndGroup.get(priority);
            for (const [_, groupTasks] of groupMap) {
                for (const task of groupTasks) {
                    if (!visited.has(task)) {
                        scheduleTask(task);
                    }
                }
            }
        }

        return {
            scheduledTasks: scheduled,
            totalExecutionTime: totalExecutionTime
        };
    }
}

module.exports = {
    TaskSchedulingSystem
};