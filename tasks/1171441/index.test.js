const { macrotasksVsMicrotasks } = require(process.env.TARGET_FILE);

test("Microtasks should execute before macrotasks", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  const microIndex = executionOrder.findIndex(e => e.includes("Microtask"));
  const macroIndex = executionOrder.findIndex(e => e.includes("Macrotask"));
  expect(microIndex).toBeLessThan(macroIndex);
});

test("Synchronous code executes first", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder[0]).toBe("Synchronous Code 1");
});

test("All expected synchronous tasks are present", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder).toEqual(expect.arrayContaining([
      "Synchronous Code 1",
      "Synchronous Code 2",
      "Synchronous Code 3",
      "Synchronous Code 4"
  ]));
});

test("All expected microtasks are present", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder).toEqual(expect.arrayContaining([
      "Microtask: Promise 1",
      "Microtask: Promise 2",
      "Microtask: Promise 3",
      "Microtask: Promise 4"
  ]));
});

test("All expected macrotasks are present", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder).toEqual(expect.arrayContaining([
      "Macrotask: setTimeout 1",
      "Macrotask: setTimeout 2",
      "Macrotask: setTimeout 3",
      "Macrotask: setTimeout 4"
  ]));
});

test("Promise 1 executes before setTimeout 1", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder.indexOf("Microtask: Promise 1")).toBeLessThan(executionOrder.indexOf("Macrotask: setTimeout 1"));
});

test("Promise 3 executes before setTimeout 3", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder.indexOf("Microtask: Promise 3")).toBeLessThan(executionOrder.indexOf("Macrotask: setTimeout 3"));
});

test("setTimeout 1 executes before setTimeout 3", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder.indexOf("Macrotask: setTimeout 1")).toBeLessThan(executionOrder.indexOf("Macrotask: setTimeout 3"));
});

test("setTimeout 2 executes before setTimeout 4", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder.indexOf("Macrotask: setTimeout 2")).toBeLessThan(executionOrder.indexOf("Macrotask: setTimeout 4"));
});

test("Promise 2 executes before Promise 4", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder.indexOf("Microtask: Promise 2")).toBeLessThan(executionOrder.indexOf("Microtask: Promise 4"));
});

test("Execution contains exactly the expected number of elements", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  expect(executionOrder.length).toBe(12);
});

test("Promise 4 executes before any macrotask", async () => {
  const executionOrder = await macrotasksVsMicrotasks();
  const microIndex = executionOrder.indexOf("Microtask: Promise 4");
  const firstMacroIndex = executionOrder.findIndex(e => e.includes("Macrotask"));
  expect(microIndex).toBeLessThan(firstMacroIndex);
});