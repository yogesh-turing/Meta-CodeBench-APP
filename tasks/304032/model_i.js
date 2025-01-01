const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    tasks = []; // { id: number, user: string, dueAt: date, status: string }
    users = new Map();
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

        const userTasks = this.tasks.filter(task => task.user === userId && (task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS));
        if (userTasks.length >= this.maxTasks) {
            throw new Error(`User ${userId} has reached the maximum number of tasks`);
        }

        const newTask = {
            id: this.tasks.length + 1,
            user: userId,
            dueAt: dueDate,
            status: TASK_STATUS.OPEN
        };

        this.tasks.push(newTask);
        if (!this.users.has(userId)) {
            this.users.set(userId, []);
        }
        this.users.get(userId).push(newTask);

        return newTask;
    }

    getUser(userId) {
        if (!this.users.has(userId)) {
            throw new Error(`User ${userId} not found`);
        }
        return this.users.get(userId);
    }

    getTasks(sortObject = { field: "dueAt", direction: "desc" }) {
        if (sortObject.direction !== 'asc' && sortObject.direction !== 'desc') {
            throw new Error('Invalid direction. Direction must be "asc" or "desc"');
        }

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
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Task ${taskId} not found`);
        }

        this.tasks.splice(taskIndex, 1);
        for (let [userId, tasks] of this.users) {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
            }
        }

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

        for (let [userId, tasks] of this.users) {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = { ...tasks[taskIndex], ...params };
            }
        }

        return this.tasks[taskIndex];
    }
}

module.exports = {
    TaskSchedulingSystem
};