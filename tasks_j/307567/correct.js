class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = Math.max(1, concurrency);
    this.running = 0;
    this.queue = [];
    this._results = new Map();
    this._counter = 0;
    this._activeTaskPromises = new Map();
    this._maxResultsSize = 1000;
  }

  async enqueue(task, priority = 0) {
    const taskId = this._counter++;

    const taskPromise = new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task();
          this._results.set(taskId, {
            status: "completed",
            result,
            completedAt: Date.now(),
          });
          this._cleanupOldResults();
          resolve(result);
        } catch (error) {
          this._results.set(taskId, {
            status: "failed",
            error: error?.message,
            failedAt: Date.now(),
          });
          reject(error);
        } finally {
          this._activeTaskPromises.delete(taskId);
          this.running--;
          setImmediate(() => this.processQueue());
        }
      };

      const taskEntry = { task: wrappedTask, priority, id: taskId };
      this.queue.push(taskEntry);
      this._activeTaskPromises.set(taskId, { resolve, reject });
      setImmediate(() => this.processQueue());
    });

    return taskPromise;
  }

  _sortQueue() {
    this.queue.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.id - b.id;
    });
  }

  _cleanupOldResults() {
    if (this._results.size > this._maxResultsSize) {
      const sortedEntries = [...this._results.entries()].sort(
        ([, a], [, b]) => {
          const timeA = a.completedAt || a.failedAt || a.cancelledAt || 0;
          const timeB = b.completedAt || b.failedAt || b.cancelledAt || 0;
          return timeA - timeB;
        }
      );

      const entriesToRemove = sortedEntries.slice(
        0,
        sortedEntries.length - this._maxResultsSize
      );
      for (const [key] of entriesToRemove) {
        this._results.delete(key);
      }
    }
  }

  processQueue() {
    if (this.queue.length === 0 || this.running >= this.concurrency) {
      return;
    }

    this._sortQueue();

    while (this.running < this.concurrency && this.queue.length > 0) {
      const nextTask = this.queue.shift();
      this.running++;
      nextTask.task().catch(() => {});
    }
  }

  getTaskStatus(taskId) {
    return this._results.get(taskId) || { status: "unknown" };
  }

  async cancelTask(taskId) {
    const taskPromise = this._activeTaskPromises.get(taskId);
    if (taskPromise) {
      this._results.set(taskId, {
        status: "cancelled",
        cancelledAt: Date.now(),
      });
      taskPromise.reject(new Error(`Task ${taskId} cancelled`));
      this._activeTaskPromises.delete(taskId);
    }
    this.queue = this.queue.filter((item) => item.id !== taskId);
  }

  async clearQueue() {
    const taskIds = [...this._activeTaskPromises.keys()];
    await Promise.all(taskIds.map((id) => this.cancelTask(id)));
    this.queue = [];
    this.running = 0;
  }

  *[Symbol.iterator]() {
    for (const [taskId, status] of this._results) {
      yield { taskId, ...status };
    }
  }
}

// Example usage function with improved error handling
async function processItems(items) {
  const queue = new AsyncQueue(2);
  const results = new Map();

  const tasks = items.map((item, index) => ({
    task: async () => {
      if (typeof item !== "number") {
        throw new TypeError(
          `Invalid item type at index ${index}: ${typeof item}`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, item * 100));
      return item * 2;
    },
    priority: index % 2 === 0 ? 1 : 0,
    index,
  }));

  try {
    const promises = tasks.map(({ task, priority, index }) =>
      queue
        .enqueue(task, priority)
        .then((result) => ({ success: true, result, index }))
        .catch((error) => ({ success: false, error: error.message, index }))
    );

    const outcomes = await Promise.allSettled(promises);
    outcomes.forEach((outcome, index) => {
      if (outcome.status === "fulfilled") {
        results.set(index, outcome.value);
      } else {
        results.set(index, {
          success: false,
          error: outcome.reason.message,
          index,
        });
      }
    });
  } catch (error) {
    console.error("Queue processing failed:", error);
  }

  return results;
}

module.exports = { AsyncQueue, processItems };
