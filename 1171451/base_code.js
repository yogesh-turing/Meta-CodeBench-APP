const { promisify } = require("util");

class TaskScheduler {
    constructor(concurrentLimit) {
        this.concurrentLimit = concurrentLimit;
        this.runningTasks = 0;
        this.queue = [];
    }

    async runTask(task) {
        return new Promise(resolve => {
            const attemptExecution = async () => {
                if (this.runningTasks >= this.concurrentLimit) {
                    this.queue.push(attemptExecution);
                    return;
                }

                this.runningTasks++;
                try {
                    const result = await task();
                    resolve(result);
                } catch (err) {
                    console.error("Task failed:", err);
                } finally {
                    this.runningTasks--;
                    if (this.queue.length) {
                        const nextTask = this.queue.shift();
                        nextTask();
                    }
                }
            };

            attemptExecution();
        });
    }

    async execute(tasks) {
        return Promise.all(tasks.map(task => this.runTask(task)));
    }
}

// Sample usage
const delay = promisify(setTimeout);
const tasks = Array.from({ length: 10 }, (_, i) => async () => {
    await delay(1000);
    console.log(`Task ${i + 1} completed`);
    return `Result ${i + 1}`;
});

(async () => {
    const scheduler = new TaskScheduler(3);
    const results = await scheduler.execute(tasks);
    console.log("All tasks completed:", results);
})();
