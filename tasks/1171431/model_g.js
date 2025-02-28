function macrotasksVsMicrotasks() {
  return new Promise((resolve) => {
    const executionOrder = [];

    // 1) Synchronous tasks
    executionOrder.push("Synchronous Code 1");
    executionOrder.push("Synchronous Code 2");
    executionOrder.push("Synchronous Code 3");

    // 2) Microtasks (Promises resolved in the current tick)
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 1"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 2"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 3"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 4"));

    // 3) Macrotasks (setTimeout callbacks)
    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 1");
      
      // Nested setTimeout, which is also a macrotask:
      setTimeout(() => {
        executionOrder.push("Macrotask: setTimeout 3");
        resolve(executionOrder);  // Finalizing once all tasks are done
      }, 20);
    }, 0);

    setTimeout(() => executionOrder.push("Macrotask: setTimeout 2"), 5);
    setTimeout(() => executionOrder.push("Macrotask: setTimeout 4"), 10);
  });
}

module.exports = { macrotasksVsMicrotasks };