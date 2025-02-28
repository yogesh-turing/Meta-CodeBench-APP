function macrotasksVsMicrotasks() {
  return new Promise((resolve) => {
    const executionOrder = [];

    // 1) Synchronous code
    executionOrder.push("Synchronous Code 1");
    executionOrder.push("Synchronous Code 2");
    executionOrder.push("Synchronous Code 3");

    // 2) Microtasks (Promises)
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 1"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 2"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 3"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 4"));

    // 3) Macrotasks (setTimeout calls)
    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 1");
      // Nested timeouts allow controlling a sequence:
      setTimeout(() => {
        executionOrder.push("Macrotask: setTimeout 3");
        resolve(executionOrder);  // Resolve once we’ve queued everything
      }, 10);
    }, 0);

    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 2");
    }, 5);

    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 4");
    }, 15);
  });
}

module.exports = { macrotasksVsMicrotasks };