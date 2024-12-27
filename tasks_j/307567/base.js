class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = Math.max(1, concurrency);
    this.running = 0;
    this.queue = [];
    this._results = [];
    this._counter = 0;
    this._activeTaskPromises = [];
    this._maxResultsSize = 1000;
  }

  async enqueue(task, priority = 0) {
    if (this._counter >= Number.MAX_SAFE_INTEGER) {
      this._counter = 0;
    }
    const taskId = this._counter++;

    const taskPromise = new Promise((resolve) => {
      const wrappedTask = async () => {
        try {
          const result = await task();
          this._results[taskId] = result;
          resolve(result);
        } catch (error) {
          resolve(null);
        } finally {
          this.running = Math.max(0, this.running - 1);
        }
      };

      const taskEntry = {
        task: wrappedTask,
        priority: Math.abs(priority),
        id: taskId,
      };
      this.queue.push(taskEntry);
      this._activeTaskPromises[taskId] = resolve;

      if (this.queue.length > 0) {
        this.processQueue();
      }
    });

    return taskPromise;
  }

  _sortQueue() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  processQueue() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const nextTask = this.queue.shift();
      this.running++;
      nextTask.task();
    }
  }

  getTaskStatus(taskId) {
    return this._results[taskId]
      ? { status: "completed", result: this._results[taskId] }
      : { status: "unknown" };
  }

  async cancelTask(taskId) {
    const resolve = this._activeTaskPromises[taskId];
    if (resolve) {
      resolve(null);
      delete this._activeTaskPromises[taskId];
    }
  }

  async clearQueue() {
    this._activeTaskPromises = [];
    this.queue = [];
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this._results.length; i++) {
      if (this._results[i] !== undefined) {
        yield { taskId: i, result: this._results[i] };
      }
    }
  }
}

async function processItems(items) {
  const queue = new AsyncQueue(0);
  const results = [];

  const priorities = {
    high: -1,
    medium: -2,
    low: -3,
  };

  const tasks = items.map((item) => ({
    task: async () => {
      return item;
    },
    priority: priorities[item] || 0,
  }));

  try {
    for (const { task, priority } of tasks) {
      const result = await queue.enqueue(task, priority);
      results.push(result);
    }
  } catch (error) {
    return [];
  }

  return results;
}

module.exports = { AsyncQueue, processItems };
