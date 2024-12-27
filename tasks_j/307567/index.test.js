const { AsyncQueue, processItems } = require(process.env.TARGET_FILE);

describe("AsyncQueue", () => {
  let queue;

  beforeEach(() => {
    queue = new AsyncQueue(2);
  });

  test("should process tasks in order with correct results", async () => {
    const results = [];
    const tasks = [1, 2, 3].map((n) => ({
      task: async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        results.push(n);
        return n;
      },
      priority: 1, // Testing FIFO with same priority
    }));

    await Promise.all(tasks.map((t) => queue.enqueue(t.task, t.priority)));
    expect(results).toEqual([1, 2, 3]);
  });

  test("should respect concurrency limit", async () => {
    let running = 0;
    let maxRunning = 0;

    const task = async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((resolve) => setTimeout(resolve, 50));
      running--;
    };

    const promises = Array(5)
      .fill()
      .map(() => queue.enqueue(task));
    await Promise.all(promises);

    expect(maxRunning).toBe(2);
  });

  test("should execute higher priority tasks first", async () => {
    const results = [];
    const tasks = [
      { priority: 0, value: "low" },
      { priority: 2, value: "high" },
      { priority: 1, value: "medium" },
    ];

    await Promise.all(
      tasks.map((t) =>
        queue.enqueue(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          results.push(t.value);
        }, t.priority)
      )
    );

    expect(results).toEqual(["high", "medium", "low"]);
  });

  test("should handle task failures without breaking the queue", async () => {
    const results = [];

    const promises = [
      queue.enqueue(async () => {
        results.push(1);
      }),
      queue.enqueue(async () => {
        throw new Error("Task failed");
      }),
      queue.enqueue(async () => {
        results.push(2);
      }),
    ];

    await Promise.allSettled(promises);
    expect(results).toEqual([1, 2]);
  });

  test("should cleanup old results when limit is reached", async () => {
    queue = new AsyncQueue(1);
    queue._maxResultsSize = 3;

    const promises = Array(5)
      .fill()
      .map((_, i) => queue.enqueue(async () => i));

    await Promise.all(promises);
    expect(queue._results.size).toBe(3);
  });

  test("should cancel running tasks", async () => {
    let taskRan = false;
    const promise = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      taskRan = true;
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    await queue.clearQueue();

    await expect(promise).rejects.toThrow(/cancelled/);
    expect(taskRan).toBe(false);
  });

  test("should handle minimum concurrency of 1", () => {
    const queue = new AsyncQueue(0);
    expect(queue.concurrency).toBe(1);
  });

  test("should get task status correctly", async () => {
    const taskId = queue._counter;
    const promise = queue.enqueue(async () => "result");

    // Test unknown status
    expect(queue.getTaskStatus(999)).toEqual({ status: "unknown" });

    await promise;
    const status = queue.getTaskStatus(taskId);
    expect(status.status).toBe("completed");
    expect(status.result).toBe("result");
  });

  test("should handle task cancellation", async () => {
    // Test canceling a specific task
    const taskId = queue._counter;
    const promise1 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return "result";
    });

    await queue.cancelTask(taskId);
    expect(queue.getTaskStatus(taskId).status).toBe("cancelled");
    await expect(promise1).rejects.toThrow(`Task ${taskId} cancelled`);

    // Test canceling non-existent task
    await queue.cancelTask(999);
    expect(queue.getTaskStatus(999)).toEqual({ status: "unknown" });

    // Test canceling multiple tasks
    const promise2 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return "result2";
    });

    await queue.clearQueue();
    await expect(promise2).rejects.toThrow(/cancelled/);
  });

  test("should be iterable over results", async () => {
    await queue.enqueue(async () => "task1");
    await queue.enqueue(async () => "task2");

    const results = [...queue];
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("status");
    expect(results[0]).toHaveProperty("taskId");
  });

  test("should handle iterator functionality", async () => {
    const queue = new AsyncQueue(2);

    // Add tasks with different statuses
    const task1 = queue.enqueue(async () => 1);
    const task2 = queue
      .enqueue(async () => {
        throw new Error("Failed task");
      })
      .catch(() => {});

    await Promise.allSettled([task1, task2]);

    const results = [...queue];
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("status");
    expect(results[0]).toHaveProperty("taskId");

    // Test iterator with empty queue
    queue._results.clear();
    expect([...queue].length).toBe(0);
  });

  test("should process items with mixed types", async () => {
    const items = [1, "invalid", 3, null, 5];
    const results = new Map();
    const queue = new AsyncQueue(2);

    const tasks = items.map((item, index) => ({
      task: async () => {
        if (typeof item !== "number") {
          throw new TypeError(
            `Invalid item type at index ${index}: ${typeof item}`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, item * 50));
        return item * 2;
      },
      priority: index % 2 === 0 ? 1 : 0,
      index,
    }));

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

    expect(results.get(0)).toEqual({ success: true, result: 2, index: 0 });
    expect(results.get(1).success).toBe(false);
    expect(results.get(1).error).toContain("Invalid item type");
    expect(results.get(2)).toEqual({ success: true, result: 6, index: 2 });
    expect(results.get(3).success).toBe(false);
    expect(results.get(4)).toEqual({ success: true, result: 10, index: 4 });
  });

  describe("processItems", () => {
    test("should process all valid numeric items", async () => {
      const items = [1, 2, 3, 4, 5];
      const results = await processItems(items);

      expect(results.size).toBe(5);
      for (let i = 0; i < items.length; i++) {
        const result = results.get(i);
        expect(result).toEqual({
          success: true,
          result: items[i] * 2,
          index: i,
        });
      }
    });

    test("should handle mixed valid and invalid items", async () => {
      const items = [1, "string", 3, null, 5, undefined, 7];
      const results = await processItems(items);

      expect(results.size).toBe(7);

      // Check valid items
      expect(results.get(0)).toEqual({ success: true, result: 2, index: 0 });
      expect(results.get(2)).toEqual({ success: true, result: 6, index: 2 });
      expect(results.get(4)).toEqual({ success: true, result: 10, index: 4 });
      expect(results.get(6)).toEqual({ success: true, result: 14, index: 6 });

      // Check invalid items
      expect(results.get(1)).toEqual({
        success: false,
        error: "Invalid item type at index 1: string",
        index: 1,
      });
      expect(results.get(3)).toEqual({
        success: false,
        error: "Invalid item type at index 3: object",
        index: 3,
      });
      expect(results.get(5)).toEqual({
        success: false,
        error: "Invalid item type at index 5: undefined",
        index: 5,
      });
    });

    test("should handle empty item array", async () => {
      const items = [];
      const results = await processItems(items);
      expect(results.size).toBe(0);
    });

    test("should handle queue processing error", async () => {
      const items = [1, 2, 3];
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Force a queue processing error
      const originalEnqueue = AsyncQueue.prototype.enqueue;
      AsyncQueue.prototype.enqueue = function () {
        throw new Error("Queue processing failed");
      };

      const results = await processItems(items);

      expect(results.size).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Queue processing failed:",
        expect.any(Error)
      );

      // Cleanup
      AsyncQueue.prototype.enqueue = originalEnqueue;
      consoleSpy.mockRestore();
    });

    test("should process items with different priorities", async () => {
      const items = [1, 2, 3, 4];
      const results = await processItems(items);

      // Even indexed items should have priority 1, odd indexed items priority 0
      const evenIndexedResults = Array.from(results.entries())
        .filter(([index]) => index % 2 === 0)
        .map(([, value]) => value);

      const oddIndexedResults = Array.from(results.entries())
        .filter(([index]) => index % 2 === 1)
        .map(([, value]) => value);

      // All results should be successful
      expect(evenIndexedResults.every((r) => r.success)).toBe(true);
      expect(oddIndexedResults.every((r) => r.success)).toBe(true);

      // Check the results are correct
      evenIndexedResults.forEach((result, i) => {
        expect(result.result).toBe(items[i * 2] * 2);
      });

      oddIndexedResults.forEach((result, i) => {
        expect(result.result).toBe(items[i * 2 + 1] * 2);
      });
    });

    test("should handle Promise.allSettled rejections", async () => {
      const items = [1, 2, 3];
      const originalAllSettled = Promise.allSettled;
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Force Promise.allSettled to throw
      Promise.allSettled = () => {
        throw new Error("Promise.allSettled failed");
      };

      const results = await processItems(items);

      expect(results.size).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Queue processing failed:",
        expect.any(Error)
      );

      // Cleanup
      Promise.allSettled = originalAllSettled;
      consoleSpy.mockRestore();
    });

    test("should handle task timeouts", async () => {
      const items = [10, 20, 30]; // Very small delays
      const results = await processItems(items);

      expect(results.size).toBe(3);
      items.forEach((_, index) => {
        const result = results.get(index);
        expect(result.success).toBe(true);
        expect(result.result).toBe(items[index] * 2);
      });
    }, 30000); // Much longer timeout

    test("should handle Promise.allSettled rejection", async () => {
      const items = [1, 2, 3];
      const originalAllSettled = Promise.allSettled;

      // Mock Promise.allSettled to reject
      Promise.allSettled = () =>
        Promise.reject(new Error("Promise.allSettled failed"));

      const results = await processItems(items);
      expect(results.size).toBe(0);

      // Restore original Promise.allSettled
      Promise.allSettled = originalAllSettled;
    });

    test("should handle rejected outcomes", async () => {
      const items = [1, 2, 3];
      const originalAllSettled = Promise.allSettled;

      // Mock Promise.allSettled to return a rejected outcome
      Promise.allSettled = () =>
        Promise.resolve([
          { status: "rejected", reason: new Error("Task failed") },
        ]);

      const results = await processItems(items);
      expect(results.size).toBe(1);
      expect(results.get(0)).toEqual({
        success: false,
        error: "Task failed",
        index: 0,
      });

      // Restore original Promise.allSettled
      Promise.allSettled = originalAllSettled;
    });

    test("should handle Promise.allSettled rejection with multiple errors", async () => {
      const originalAllSettled = Promise.allSettled;
      Promise.allSettled = () => {
        throw new Error("Promise.allSettled failed");
      };

      try {
        const items = [1, 2, 3];
        const results = await processItems(items);

        // Results should be empty since Promise.allSettled failed
        expect(results.size).toBe(0);
      } finally {
        Promise.allSettled = originalAllSettled;
      }
    });

    test("should handle Promise.allSettled with mixed outcomes", async () => {
      const items = [1, "invalid", 3];
      const results = await processItems(items);

      expect(results.size).toBe(3);

      // First item should succeed
      const result0 = results.get(0);
      expect(result0.success).toBe(true);
      expect(result0.result).toBe(2);
      expect(result0.index).toBe(0);

      // Second item should fail
      const result1 = results.get(1);
      expect(result1.success).toBe(false);
      expect(result1.error).toContain("Invalid item type at index 1");
      expect(result1.index).toBe(1);

      // Third item should succeed
      const result2 = results.get(2);
      expect(result2.success).toBe(true);
      expect(result2.result).toBe(6);
      expect(result2.index).toBe(2);
    });

    test("should queue processing with no tasks", () => {
      queue.processQueue();
      expect(queue.running).toBe(0);
      expect(queue.queue.length).toBe(0);
    });
  });

  test("should maintain task order with same priority", async () => {
    const results = [];
    const tasks = [
      { id: 1, priority: 1 },
      { id: 2, priority: 1 },
      { id: 3, priority: 1 },
    ];

    await Promise.all(
      tasks.map((t) =>
        queue.enqueue(async () => {
          results.push(t.id);
        }, t.priority)
      )
    );

    expect(results).toEqual([1, 2, 3]);
  });

  test("should handle result cleanup with mixed completion times", async () => {
    queue._maxResultsSize = 2;
    const tasks = [];

    // Create tasks with varying completion times
    for (let i = 0; i < 4; i++) {
      const task = queue.enqueue(async () => {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 50));
        return i;
      });
      tasks.push(task);
    }

    await Promise.all(tasks);
    expect(queue._results.size).toBe(2);
  });

  test("should handle cleanup with mixed completion and failure times", async () => {
    const queue = new AsyncQueue(2);
    queue._maxResultsSize = 2;

    // Add tasks with different completion/failure times
    const task1 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return 1;
    });

    const task2 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      throw new Error("Task 2 failed");
    });

    const task3 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 30));
      return 3;
    });

    try {
      await Promise.allSettled([task1, task2, task3]);
    } catch (error) {
      // Ignore errors
    }

    // Verify results
    expect(queue._results.size).toBe(2);
    const results = [...queue._results.values()];

    // Should keep the most recent results (task2 and task3)
    const hasFailedTask = results.some(
      (r) => r.status === "failed" && r.error === "Task 2 failed"
    );
    const hasLastTask = results.some(
      (r) => r.status === "completed" && r.result === 3
    );

    expect(hasFailedTask).toBe(true);
    expect(hasLastTask).toBe(true);
  });

  test("should handle cleanup with no completion or failure times", async () => {
    const queue = new AsyncQueue(2);
    queue._maxResultsSize = 2;

    // Manually add results with no timestamps
    queue._results.set(1, { status: "unknown" });
    queue._results.set(2, {
      status: "completed",
      result: 2,
      completedAt: Date.now(),
    });
    queue._results.set(3, {
      status: "failed",
      error: "error",
      failedAt: Date.now(),
    });

    // Trigger cleanup
    queue._cleanupOldResults();

    // Should keep the most recent results (2 and 3)
    expect(queue._results.size).toBe(2);
    expect(queue._results.has(1)).toBe(false);
    expect(queue._results.has(2)).toBe(true);
    expect(queue._results.has(3)).toBe(true);
  });

  test("should handle cleanup with identical timestamps", async () => {
    const queue = new AsyncQueue(2);
    queue._maxResultsSize = 2;

    const now = Date.now();

    // Add results with identical timestamps
    queue._results.set(1, {
      status: "completed",
      result: 1,
      completedAt: now,
    });
    queue._results.set(2, {
      status: "completed",
      result: 2,
      completedAt: now,
    });
    queue._results.set(3, {
      status: "completed",
      result: 3,
      completedAt: now,
    });

    // Trigger cleanup
    queue._cleanupOldResults();

    // Should keep the last two results
    expect(queue._results.size).toBe(2);
    expect(queue._results.has(2)).toBe(true);
    expect(queue._results.has(3)).toBe(true);
  });

  test("should handle cleanup with mixed timestamp types", async () => {
    const queue = new AsyncQueue(2);
    queue._maxResultsSize = 2;

    const now = Date.now();

    // Add results with different timestamp types
    queue._results.set(1, {
      status: "completed",
      result: 1,
      completedAt: now - 100, // Oldest timestamp
    });
    queue._results.set(2, {
      status: "failed",
      error: "error",
      failedAt: now - 50, // Middle timestamp
    });
    queue._results.set(3, {
      status: "completed",
      result: 3,
      completedAt: now, // Latest timestamp
    });

    // Add a result with no timestamp
    queue._results.set(4, {
      status: "unknown",
    });

    // Trigger cleanup
    queue._cleanupOldResults();

    // Should keep the most recent results (2 and 3) and remove the no-timestamp result
    expect(queue._results.size).toBe(2);
    expect(queue._results.has(1)).toBe(false);
    expect(queue._results.has(2)).toBe(true);
    expect(queue._results.has(3)).toBe(true);
    expect(queue._results.has(4)).toBe(false);

    // Add one more result with a different timestamp type
    await new Promise((resolve) => setTimeout(resolve, 10));
    const laterTime = Date.now();
    queue._results.set(5, {
      status: "cancelled",
      cancelledAt: laterTime, // Latest timestamp
    });

    // Add one more result with an even later timestamp
    await new Promise((resolve) => setTimeout(resolve, 10));
    const latestTime = Date.now();
    queue._results.set(6, {
      status: "completed",
      result: 6,
      completedAt: latestTime, // Latest timestamp
    });

    // Trigger cleanup again
    queue._cleanupOldResults();

    // Should keep the most recent results (5 and 6)
    expect(queue._results.size).toBe(2);
    expect(queue._results.has(2)).toBe(false);
    expect(queue._results.has(3)).toBe(false);
    expect(queue._results.has(5)).toBe(true);
    expect(queue._results.has(6)).toBe(true);
  });

  test("should clear queue and cancel all tasks", async () => {
    const queue = new AsyncQueue(2);

    // Add some long-running tasks
    const task1 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 1;
    });

    const task2 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return 2;
    });

    const task3 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return 3;
    });

    // Clear the queue
    await queue.clearQueue();

    // Check that all tasks are cancelled
    const status1 = queue.getTaskStatus(0);
    const status2 = queue.getTaskStatus(1);
    const status3 = queue.getTaskStatus(2);

    expect(status1.status).toBe("cancelled");
    expect(status2.status).toBe("cancelled");
    expect(status3.status).toBe("cancelled");
    expect(queue.queue.length).toBe(0);
    expect(queue.running).toBe(0);

    // Verify tasks were rejected
    await expect(task1).rejects.toThrow("Task 0 cancelled");
    await expect(task2).rejects.toThrow("Task 1 cancelled");
    await expect(task3).rejects.toThrow("Task 2 cancelled");
  });

  test("should fully test iterator functionality", async () => {
    const queue = new AsyncQueue(2);

    // Add tasks with different statuses
    const task1 = queue.enqueue(async () => 1);
    const task2 = queue.enqueue(async () => {
      throw new Error("Task 2 error");
    });
    const task3 = queue.enqueue(async () => 3);

    // Wait for task1 to complete
    await task1;

    // Let task2 fail
    try {
      await task2;
    } catch (error) {
      // Expected error
    }

    // Cancel task3 before it starts
    try {
      await queue.cancelTask(2);
      await expect(task3).rejects.toThrow("Task 2 cancelled");
    } catch (error) {
      // Expected cancellation error
    }

    // Wait for all tasks to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use for...of loop to iterate
    let count = 0;
    for (const result of queue) {
      count++;
      if (result.taskId === 0) {
        expect(result.status).toBe("completed");
        expect(result.result).toBe(1);
        expect(result.completedAt).toBeDefined();
      } else if (result.taskId === 1) {
        expect(result.status).toBe("failed");
        expect(result.error).toBe("Task 2 error");
        expect(result.failedAt).toBeDefined();
      } else if (result.taskId === 2) {
        expect(result.status).toBe("cancelled");
        expect(result.cancelledAt).toBeDefined();
      }
    }
    expect(count).toBe(3);

    // Test iterator manually
    const iterator = queue[Symbol.iterator]();
    const firstResult = iterator.next();
    expect(firstResult.done).toBe(false);
    expect(firstResult.value.status).toBe("completed");

    const secondResult = iterator.next();
    expect(secondResult.done).toBe(false);
    expect(secondResult.value.status).toBe("failed");

    const thirdResult = iterator.next();
    expect(thirdResult.done).toBe(false);
    expect(thirdResult.value.status).toBe("cancelled");

    const fourthResult = iterator.next();
    expect(fourthResult.done).toBe(true);
    expect(fourthResult.value).toBeUndefined();
  });

  test("should sort queue correctly with mixed priorities", async () => {
    const queue = new AsyncQueue(1);

    // Add tasks with different priorities
    queue.queue.push({ task: () => {}, priority: 0, id: 1 });
    queue.queue.push({ task: () => {}, priority: 2, id: 2 });
    queue.queue.push({ task: () => {}, priority: 1, id: 3 });
    queue.queue.push({ task: () => {}, priority: 2, id: 4 });
    queue.queue.push({ task: () => {}, priority: 0, id: 5 });

    // Call _sortQueue directly
    queue._sortQueue();

    // Check that tasks are sorted by priority (highest first)
    // and within same priority by id (FIFO)
    expect(queue.queue[0].id).toBe(2);
    expect(queue.queue[1].id).toBe(4);
    expect(queue.queue[2].id).toBe(3);
    expect(queue.queue[3].id).toBe(1);
    expect(queue.queue[4].id).toBe(5);
  });

  test("should handle wrapped task with immediate error", async () => {
    const queue = new AsyncQueue(1);
    const error = new Error("Immediate error");

    const promise = queue.enqueue(() => {
      throw error;
    });

    await expect(promise).rejects.toThrow("Immediate error");

    const status = queue.getTaskStatus(0);
    expect(status.status).toBe("failed");
    expect(status.error).toBe("Immediate error");
    expect(status.failedAt).toBeDefined();
  });

  test("should handle wrapped task with async error", async () => {
    const queue = new AsyncQueue(1);
    const error = new Error("Async error");

    const promise = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      throw error;
    });

    await expect(promise).rejects.toThrow("Async error");

    const status = queue.getTaskStatus(0);
    expect(status.status).toBe("failed");
    expect(status.error).toBe("Async error");
    expect(status.failedAt).toBeDefined();
  });

  test("should handle wrapped task with immediate success", async () => {
    const queue = new AsyncQueue(1);

    const promise = queue.enqueue(() => 42);
    const result = await promise;

    expect(result).toBe(42);

    const status = queue.getTaskStatus(0);
    expect(status.status).toBe("completed");
    expect(status.result).toBe(42);
    expect(status.completedAt).toBeDefined();
  });

  test("should handle wrapped task with async success", async () => {
    const queue = new AsyncQueue(1);

    const promise = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return 42;
    });

    const result = await promise;
    expect(result).toBe(42);

    const status = queue.getTaskStatus(0);
    expect(status.status).toBe("completed");
    expect(status.result).toBe(42);
    expect(status.completedAt).toBeDefined();
  });

  test("should handle task cancellation during execution", async () => {
    const queue = new AsyncQueue(1);
    let taskStarted = false;

    // Create a long-running task
    const promise = queue.enqueue(async () => {
      taskStarted = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return 42;
    });

    // Wait for task to start
    while (!taskStarted) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // Cancel the task
    await queue.cancelTask(0);

    // Check that the task was cancelled
    await expect(promise).rejects.toThrow("Task 0 cancelled");

    const status = queue.getTaskStatus(0);
    expect(status.status).toBe("cancelled");
    expect(status.cancelledAt).toBeDefined();
  });

  test("should handle negative concurrency", () => {
    const queue = new AsyncQueue(-1);
    expect(queue.concurrency).toBe(1);
  });

  test("should handle zero concurrency", () => {
    const queue = new AsyncQueue(0);
    expect(queue.concurrency).toBe(1);
  });

  test("should handle undefined concurrency", () => {
    const queue = new AsyncQueue(undefined);
    expect(queue.concurrency).toBe(1);
  });

  test("should handle positive concurrency", () => {
    const queue = new AsyncQueue(2);
    expect(queue.concurrency).toBe(2);
  });

  test("should process queue immediately after enqueue", async () => {
    const queue = new AsyncQueue(2);
    const results = [];

    // Add a task that will complete immediately
    const promise1 = queue.enqueue(() => {
      results.push(1);
      return 1;
    });

    // Add another task that will complete immediately
    const promise2 = queue.enqueue(() => {
      results.push(2);
      return 2;
    });

    // Wait for both tasks to complete
    await Promise.all([promise1, promise2]);

    // Check that both tasks were processed
    expect(results).toEqual([1, 2]);
    expect(queue.running).toBe(0);
    expect(queue.queue.length).toBe(0);
  });

  test("should process queue immediately after task completion", async () => {
    const queue = new AsyncQueue(1);
    const results = [];

    // Add three tasks but only allow one to run at a time
    const promise1 = queue.enqueue(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      results.push(1);
      return 1;
    });

    const promise2 = queue.enqueue(async () => {
      results.push(2);
      return 2;
    });

    const promise3 = queue.enqueue(async () => {
      results.push(3);
      return 3;
    });

    // Wait for all tasks to complete
    await Promise.all([promise1, promise2, promise3]);

    // Check that tasks were processed in order
    expect(results).toEqual([1, 2, 3]);
    expect(queue.running).toBe(0);
    expect(queue.queue.length).toBe(0);
  });

  test("should handle task rejection with error object", async () => {
    const queue = new AsyncQueue(1);
    const error = new Error("Custom error message");

    try {
      await queue.enqueue(() => {
        throw error;
      });
    } catch (e) {
      expect(e).toBe(error);
      const status = queue.getTaskStatus(0);
      expect(status.status).toBe("failed");
      expect(status.error).toBe("Custom error message");
      expect(status.failedAt).toBeDefined();
    }
  });

  test("should handle task rejection with undefined", async () => {
    const queue = new AsyncQueue(1);

    // Use a synchronous task that throws undefined
    const task = () => {
      throw undefined;
    };

    try {
      await queue.enqueue(task);
    } catch (e) {
      expect(e).toBeUndefined();
      const status = queue.getTaskStatus(0);
      expect(status.status).toBe("failed");
      expect(status.error).toBe(undefined);
      expect(status.failedAt).toBeDefined();
    }
  });

  test("should queue processing with no tasks", () => {
    queue.processQueue();
    expect(queue.running).toBe(0);
    expect(queue.queue.length).toBe(0);
  });
});
