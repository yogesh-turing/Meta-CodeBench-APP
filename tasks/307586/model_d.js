class Task {
    constructor(fn, index) {
        this.fn = fn;
        this.index = index;
        this.status = 'pending';
        this.result = null;
    }

    async execute() {
        try {
            this.result = await this.fn();
            this.status = 'completed';
        } catch (error) {
            this.status = 'failed';
            this.result = error.message;
        }
        return this;
    }
}

async function executeTasksInParallel(tasks) {
    const taskInstances = tasks.map((task, index) => new Task(task, index));
    
    await Promise.all(taskInstances.map(task => task.execute()));

    const completed = taskInstances.filter(task => task.status === 'completed');
    const failed = taskInstances.filter(task => task.status === 'failed');

    return {
        completed,
        failed
    };
}

module.exports = {
    executeTasksInParallel
};