function macrotasksVsMicrotasks() {
  return new Promise((resolve) => {
      const executionOrder = new Set();

      // Synchronous code executes immediately
      executionOrder.add("Synchronous Code 1");
      executionOrder.add("Synchronous Code 2");
      executionOrder.add("Synchronous Code 3");
      executionOrder.add("Synchronous Code 4");

      // Microtasks (Promises) queue
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 1"));
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 2"));
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 3"));
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 4"));

      // Macrotasks (setTimeout) queue
      setTimeout(() => {
          executionOrder.add("Macrotask: setTimeout 1");
          setTimeout(() => {
              executionOrder.add("Macrotask: setTimeout 3");
              resolve(Array.from(executionOrder));
          }, 20);
      }, 0);

      setTimeout(() => executionOrder.add("Macrotask: setTimeout 2"), 5);
      setTimeout(() => executionOrder.add("Macrotask: setTimeout 4"), 25);
  });
}

module.exports = { macrotasksVsMicrotasks };