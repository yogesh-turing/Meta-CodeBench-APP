function macrotasksVsMicrotasks() {
  return new Promise((resolve) => {
    const executionOrder = [];

    // 1) Synchronous code executes first
    executionOrder.push("Synchronous Code 1");
    executionOrder.push("Synchronous Code 2");
    executionOrder.push("Synchronous Code 3");
    executionOrder.push("Synchronous Code 4");

    // 2) Microtasks (Promises) execute after synchronous code, before macrotasks
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 1"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 2"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 3"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 4"));

    // 3) Macrotasks (setTimeout). These run last in each loop iteration.
    //    We space them slightly with different delays to show relative ordering.
    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 1");
      // Nest another setTimeout to demonstrate it executes after the outer one
      setTimeout(() => {
        executionOrder.push("Macrotask: setTimeout 3");
        // Finally resolve the Promise once the third macrotask has finished
        resolve(executionOrder);
      }, 15);
    }, 0);

    // Another macrotask with a different delay
    setTimeout(() => executionOrder.push("Macrotask: setTimeout 2"), 5);
    // Another macrotask with yet another delay
    setTimeout(() => executionOrder.push("Macrotask: setTimeout 4"), 20);
  });
}

module.exports = { macrotasksVsMicrotasks };