Base Code:
'''javascript
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

```

Stack Trace:
```javascript
 FAIL  tasks/codeBench/index.test.js                                                                                                        
  √ Microtasks should execute before macrotasks (30 ms)
  × Synchronous code executes first (44 ms)                                                                                                 
  × All expected synchronous tasks are present (44 ms)                                                                                      
  × All expected microtasks are present (33 ms)                                                                                             
  × All expected macrotasks are present (41 ms)                                                                                             
  × Promise 1 executes before setTimeout 1 (45 ms)                                                                                          
  × Promise 3 executes before setTimeout 3 (45 ms)                                                                                          
  × setTimeout 1 executes before setTimeout 3 (30 ms)                                                                                       
  × setTimeout 2 executes before setTimeout 4 (30 ms)                                                                                       
  × Promise 2 executes before Promise 4 (31 ms)                                                                                             
  × Execution contains exactly the expected number of elements (30 ms)                                                                      
  × Promise 4 executes before any macrotask (30 ms)
                                                                                                                                            
  ● Synchronous code executes first                                                                                                         
                                                                                                                                            
    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● All expected synchronous tasks are present

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● All expected microtasks are present

    expect(received).toEqual(expected) // deep equality

    Expected: ArrayContaining ["Microtask: Promise 1", "Microtask: Promise 2", "Microtask: Promise 3", "Microtask: Promise 4"]
    Received: ["Synchronous Code 3", "Synchronous Code 1", "Synchronous Code 4", "Microtask: Promise 3", "Microtask: Promise 1", "Microtask: Promise 4", "Macrotask: setTimeout 1", "Macrotask: Unexpected Extra Task", "Macrotask: setTimeout 2", "Macrotask: setTimeout 4", …]        

      25 | test("All expected microtasks are present", async () => {
      26 |   const executionOrder = await macrotasksVsMicrotasks();
    > 27 |   expect(executionOrder).toEqual(expect.arrayContaining([
         |                          ^
      28 |       "Microtask: Promise 1",
      29 |       "Microtask: Promise 2",
      30 |       "Microtask: Promise 3",

      at Object.toEqual (tasks/codeBench/index.test.js:27:26)

  ● All expected macrotasks are present

    expect(received).toEqual(expected) // deep equality

    Expected: ArrayContaining ["Macrotask: setTimeout 1", "Macrotask: setTimeout 2", "Macrotask: setTimeout 3", "Macrotask: setTimeout 4"]  
    Received: ["Synchronous Code 3", "Synchronous Code 1", "Synchronous Code 4", "Microtask: Promise 3", "Microtask: Promise 1", "Microtask: Promise 4", "Macrotask: setTimeout 1", "Macrotask: Unexpected Extra Task", "Macrotask: setTimeout 2", "Macrotask: setTimeout 3"]

      35 | test("All expected macrotasks are present", async () => {
      36 |   const executionOrder = await macrotasksVsMicrotasks();
    > 37 |   expect(executionOrder).toEqual(expect.arrayContaining([
         |                          ^
      38 |       "Macrotask: setTimeout 1",
      39 |       "Macrotask: setTimeout 2",
      40 |       "Macrotask: setTimeout 3",

      at Object.toEqual (tasks/codeBench/index.test.js:37:26)

  ● Promise 1 executes before setTimeout 1

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● Promise 3 executes before setTimeout 3

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● setTimeout 1 executes before setTimeout 3

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● setTimeout 2 executes before setTimeout 4

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● Promise 2 executes before Promise 4

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● Execution contains exactly the expected number of elements

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

  ● Promise 4 executes before any macrotask

    Artificial failure

      26 |       setTimeout(() => executionOrder.add("Macrotask: Unexpected Extra Task"), 1);
      27 |
    > 28 |       setTimeout(() => reject(new Error("Artificial failure")), 30);
         |                               ^
      29 |   });
      30 | }
      31 |

      at Timeout._onTimeout (tasks/codeBench/incorrect.js:28:31)

----------|---------|----------|---------|---------|-------------------                                                                     
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                      
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                  
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 failed, 1 total
Tests:       11 failed, 1 passed, 12 total
Snapshots:   0 total
Time:        0.915 s, estimated 1 s
Ran all test suites.
```
Prompt:
*"Explain and demonstrate the difference between `macrotasks` and microtasks in JavaScript using `setTimeout` and `Promises`. For example, a test case could check that synchronous code executes first, followed by microtasks like resolved Promises, and finally macrotasks like `setTimeout` calls, ensuring the correct order is maintained in an execution queue."*