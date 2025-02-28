"use strict";

function macrotasksVsMicrotasks() {
  return new Promise((resolve) => {
    const executionOrder = [];

    // 1. Synchronous code (runs immediately)
    executionOrder.push("Synchronous Code 1");
    executionOrder.push("Synchronous Code 2");
    executionOrder.push("Synchronous Code 3");

    // 2. Microtasks (Promises)
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 1"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 2"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 3"));
    Promise.resolve().then(() => executionOrder.push("Microtask: Promise 4"));

    // 3. Macrotasks (setTimeout)
    // These calls are scheduled, so they'll only run after the current
    // stack and all microtasks have finished.
    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 1");
    }, 0);

    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 2");
    }, 5);

    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 3");
    }, 10);

    // Resolve after the last macrotask we care about, so we can observe the final order
    setTimeout(() => {
      executionOrder.push("Macrotask: setTimeout 4");
      resolve(executionOrder);
    }, 15);
  });
}

module.exports = { macrotasksVsMicrotasks };