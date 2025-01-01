const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    tasks = []; // { id: number, user: string, dueAt: date, status: string }
    users = new Map();
    taskId = 1;
    constructor(maxTasks) {
        if (!Number.isInteger(maxTasks) || maxTasks <= 0) {
            throw new Error("maxTasks must be a positive integer");
        }
        this.maxTasks = maxTasks;
    }

    addTask(userId, dueDate) {
        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error("Invalid userId");
        }

        // Check user tasks count
        const userTasks = this.tasks.filter(task => task.user === userId && (task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS));
        if (userTasks.length >= this.maxTasks) {
            throw new Error(`User ${userId} has reached the maximum number of tasks`);
        }

        // Add task to tasks list and user to user list if not present
        const newTask = {
            id: this.taskId,
            user: userId,
            dueAt: new Date(dueDate),
            status: TASK_STATUS.OPEN
        };
        this.tasks.push(newTask);
        if (!this.users.has(userId)) {
            this.users.set(userId, []);
        }
        this.users.get(userId).push(newTask);
        this.taskId++;
        return newTask;
    }

    getUser(userId) {
        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error("Invalid userId");
        }

        if (!this.users.has(userId)) {
            throw new Error(`User ${userId} not found`);
        }

        return this.users.get(userId);
    }

    getTasks(sortObject = { field: "dueAt", direction: "desc" }) {
        // Check if sortObject is valid
        if (typeof sortObject !== 'object' || !sortObject.field || !sortObject.direction) {
            throw new Error("Invalid sortObject");
        }

        // Sort tasks based on sortObject
        const sortedTasks = this.tasks.sort((a, b) => {
            if (sortObject.direction === 'asc') {
                return a[sortObject.field] > b[sortObject.field] ? 1 : -1;
            } else {
                return a[sortObject.field] < b[sortObject.field] ? 1 : -1;
            }
        });

        return sortedTasks;
    }

    deleteTask(taskId) {
        if (typeof taskId !== 'number' || taskId <= 0) {
            throw new Error("Invalid taskId");
        }

        // Find task by taskId
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Task ${taskId} not found`);
        }

        // Remove task from tasks list and user list
        const task = this.tasks.splice(taskIndex, 1)[0];
        const userTasks = this.users.get(task.user);
        const userTaskIndex = userTasks.findIndex(t => t.id === taskId);
        userTasks.splice(userTaskIndex, 1);

        return true;
    }

    updateTask(taskId, params) {
        if (typeof taskId !== 'number' || taskId <= 0) {
            throw new Error("Invalid taskId");
        }

        // Find task by taskId
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Task ${taskId} not found`);
        }

        // Check if params.status is valid
        if (params.status && !Object.values(TASK_STATUS).includes(params.status)) {
            throw new Error("Invalid status");
        }

        // Update task with params
        const task = this.tasks[taskIndex];
        Object.assign(task, params);
        const userTasks = this.users.get(task.user);
        const userTaskIndex = userTasks.findIndex(t => t.id === taskId);
        Object.assign(userTasks[userTaskIndex], params);

        return task;
    }
}

module.exports = {
    TaskSchedulingSystem
};