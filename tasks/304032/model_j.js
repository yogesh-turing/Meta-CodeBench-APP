const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    tasks = []; // { id: number, user: string, dueAt: date, status: string }
    users = new Map();
    taskCounter = 1; // counter to generate unique task ids
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

        // check if user already has maxTasks active tasks
        if (this.users.has(userId) && this.getActiveTasksForUser(userId).length >= this.maxTasks) {
            throw new Error(`User ${userId} has reached the maximum number of tasks`);
        }

        // add task to tasks list and user to user list if not present
        const task = {
            id: this.taskCounter++,
            user: userId,
            dueAt: dueDate,
            status: TASK_STATUS.OPEN
        };
        this.tasks.push(task);
        if (!this.users.has(userId)) {
            this.users.set(userId, []);
        }
        this.users.get(userId).push(task);
        return task;
    }

    getUser(userId) {
        if (!this.users.has(userId)) {
            throw new Error(`User ${userId} not found`);
        }
        return this.users.get(userId);
    }

    getTasks(sortObject = { field: "dueAt", direction: "desc" }) {
        const sortedTasks = [...this.tasks];
        sortedTasks.sort((a, b) => {
            if (sortObject.direction === 'asc') {
                return a[sortObject.field] > b[sortObject.field] ? 1 : -1;
            } else {
                return a[sortObject.field] < b[sortObject.field] ? 1 : -1;
            }
        });
        return sortedTasks;
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Task ${taskId} not found`);
        }
        this.tasks.splice(taskIndex, 1);
        // remove task from user's task list
        const userId = this.tasks[taskIndex].user;
        const userTasks = this.users.get(userId);
        const taskIndexInUserTasks = userTasks.findIndex(task => task.id === taskId);
        userTasks.splice(taskIndexInUserTasks, 1);
        return true;
    }

    updateTask(taskId, params) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Task ${taskId} not found`);
        }
        if (params.status && !Object.values(TASK_STATUS).includes(params.status)) {
            throw new Error(`Invalid status ${params.status}`);
        }
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...params };
        // update task in user's task list
        const userId = this.tasks[taskIndex].user;
        const userTasks = this.users.get(userId);
        const taskIndexInUserTasks = userTasks.findIndex(task => task.id === taskId);
        userTasks[taskIndexInUserTasks] = { ...userTasks[taskIndexInUserTasks], ...params };
        return this.tasks[taskIndex];
    }

    getActiveTasksForUser(userId) {
        return this.users.get(userId).filter(task => task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS);
    }
}

module.exports = {
    TaskSchedulingSystem
};