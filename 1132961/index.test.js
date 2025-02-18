const {ThreadSafeResourceManager} = require('./alternate_responses/incorrect_solution');

jest.setTimeout(30000);

describe("ThreadSafeResourceManager", () => {
  let manager;

  beforeEach(() => {
    manager = new ThreadSafeResourceManager();
  });

  test("should add and retrieve a resource", async () => {
    const resource = { name: "Test Resource", value: 100 };
    await manager.addResource("test", resource);
    const retrieved = await manager.getResource("test");
    expect(retrieved).toBe(resource);
  });

  test("should return null for a non-existent resource", async () => {
    const result = await manager.getResource("nonexistent");
    expect(result).toBeNull();
  });

  test("should manually remove a resource", async () => {
    const resource = { name: "Test Resource", value: 200 };
    await manager.addResource("test", resource);
    await manager.removeResource("test");
    const result = await manager.getResource("test");
    expect(result).toBeNull();
  });

  test("should handle concurrent reads safely", async () => {
    const resource = { name: "Concurrent Read Resource" };
    await manager.addResource("readTest", resource);

    const results = await Promise.all([
      manager.getResource("readTest"),
      manager.getResource("readTest"),
      manager.getResource("readTest"),
    ]);

    results.forEach((res) => expect(res).toBe(resource));
  });

  test("should handle concurrent writes safely without data corruption", async () => {
    const resources = [
      { name: "Resource 1", value: 1 },
      { name: "Resource 2", value: 2 },
      { name: "Resource 3", value: 3 },
    ];

    await Promise.all(
      resources.map((res, index) => manager.addResource(`key${index}`, res))
    );

    const results = await Promise.all([
      manager.getResource("key0"),
      manager.getResource("key1"),
      manager.getResource("key2"),
    ]);

    results.forEach((res, index) => expect(res).toBe(resources[index]));
  });

  test("should not release lock if operation fails before completion", async () => {
    let failed = false;

    await manager.addResource("errorTest", { name: "Error Resource" });

    try {
      await manager.addResource("errorTest", null); // Simulate an error
    } catch {
      failed = true;
    }

    expect(failed).toBe(true);
    const result = await manager.getResource("errorTest");
    expect(result).toEqual({ name: "Error Resource" }); // Original resource should still exist
  });

  test("should handle high-volume concurrent operations without race conditions", async () => {
    const addTasks = [];
    for (let i = 0; i < 100; i++) {
      addTasks.push(manager.addResource(`key${i}`, { index: i }));
    }

    await Promise.all(addTasks);

    const checkTasks = [];
    for (let i = 0; i < 100; i++) {
      checkTasks.push(manager.getResource(`key${i}`));
    }

    const results = await Promise.all(checkTasks);
    results.forEach((res, index) => {
      expect(res).toEqual({ index });
    });
  });

  test("should acquire lock in sequence to prevent deadlocks", async () => {
    const resource = { name: "Lock Sequence Test" };
    let acquiredFirst = false;
    let acquiredSecond = false;

    const task1 = async () => {
      await manager.addResource("sequence", resource);
      acquiredFirst = true;
    };

    const task2 = async () => {
      while (!acquiredFirst) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      await manager.addResource("sequence", resource);
      acquiredSecond = true;
    };

    await Promise.all([task1(), task2()]);

    expect(acquiredFirst).toBe(true);
    expect(acquiredSecond).toBe(true);
  });
});
