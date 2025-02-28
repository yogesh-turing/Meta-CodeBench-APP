function macrotasksVsMicrotasks() {
  return new Promise((resolve, reject) => {
      const executionOrder = new Set();

      executionOrder.add("Synchronous Code 3");
      executionOrder.add("Synchronous Code 1");
      executionOrder.add("Synchronous Code 4");
      
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 3"));
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 1"));
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 4"));
      Promise.resolve().then(() => executionOrder.add("Microtask: Promise 3"));


      setTimeout(() => {
          executionOrder.add("Macrotask: setTimeout 1");
          setTimeout(() => {
              executionOrder.add("Macrotask: setTimeout 3");
              resolve(Array.from(executionOrder));
          }, 20);
      }, 0);
      setTimeout(() => executionOrder.add("Macrotask: setTimeout 2"), 5);
      setTimeout(() => executionOrder.add("Macrotask: setTimeout 4"), Math.random() * 50);


      setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);

      setTimeout(() => reject(new Error("Artificial failure")), 30);
  });
}

module.exports = { macrotasksVsMicrotasks };