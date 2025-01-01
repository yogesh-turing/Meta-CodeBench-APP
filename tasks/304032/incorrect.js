const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    tasks = []; // { id: number, user: string, dueAt: date, status: string }
    users = [];
    constructor(maxTasks) {
        if (!Number.isInteger(maxTasks) || maxTasks <= 0) {
            throw new Error("maxTasks must be a positive integer");
        }
        this.maxTasks = maxTasks;
        this.users = new Map();
    }

    addTask(userId, dueDate) {
        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error("Invalid userId");
        }

        const userTasks = this.tasks.filter(task => task.user === userId && (task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS));
        if (userTasks.length >= this.maxTasks) {
            throw new Error("User has reached the maximum number of tasks");
        }

        const newTask = {
            id: this.tasks.length + 1,
            user: userId,
            dueAt: new Date(dueDate),
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
        if (typeof userId !== 'string' || userId.trim() === '' || !this.users.has(userId)) {
            throw new Error("Invalid or non-existent userId");
        }

        return this.users.get(userId);
    }

    getTasks(sortObject = { field: "dueAt", direction: "desc" }) {
        const sortedTasks = [...this.tasks].sort((a, b) => {
            if (sortObject.direction === "asc") {
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
            throw new Error("Invalid or non-existent taskId");
        }

        const [deletedTask] = this.tasks.splice(taskIndex, 1);
        const userTasks = this.users.get(deletedTask.user);
        const userTaskIndex = userTasks.findIndex(task => task.id === taskId);
        userTasks.splice(userTaskIndex, 1);

        return true;
    }

    updateTask(taskId, params) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) {
            throw new Error("Invalid or non-existent taskId");
        }

        if (!params.status || !Object.values(TASK_STATUS).includes(params.status)) {
            throw new Error("Invalid or non-existent status");
        }

        task.status = params.status;
        return task;
    }
}

module.exports = {
    TaskSchedulingSystem
};