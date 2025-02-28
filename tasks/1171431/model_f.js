function macrotasksVsMicrotasks() {
  return new Promise((resolve) => {
    const executionOrder = [];

    // 1. Synchronous code (runs right away)
    executionOrder.push("Synchronous Code 1");
    executionOrder.push("Synchronous Code 2");
    executionOrder.push("Synchronous Code 3");
    executionOrder.push("Synchronous Code 4");

    // 2. Microtasks (Promises resolved)
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 1"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 2"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 3"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 4"));

    // 3. Macrotasks (setTimeout)
    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 1");

      // Nested setTimeout to demonstrate another macrotask
      setTimeout(() => {
        executionOrder.push("Macrotask: setTimeout 3");
        // Resolve after scheduling all tasks so we can see the final order
        resolve(executionOrder);
      }, 0);
    }, 0);

    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 2");
    }, 0);

    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 4");
    }, 0);
  });
}

module.exports = { macrotasksVsMicrotasks };