const { FitnessClass, GymManagement } = require('./correct');

describe("FitnessClass", () => {
  let fitnessClass;

  beforeEach(() => {
    fitnessClass = new FitnessClass("FitLife Gym", "HIIT Class");
  });

  test("should initialize with correct parameters", () => {
    expect(fitnessClass.status).toBe(null);
    expect(fitnessClass.gymName).toBe(null);
    expect(fitnessClass.className).toBe(null);
  });

  test("should complete class after specified duration", async () => {
    jest.useFakeTimers();

    const runPromise = fitnessClass.run();
    expect(fitnessClass.status).toBe("ongoing");

    jest.advanceTimersByTime(2000);
    const result = await runPromise;

    expect(result.status).toBe("completed");
    expect(fitnessClass.status).toBe("completed");

    jest.useRealTimers();
  });

  test("should throw error for invalid initialization", () => {
    expect(() => new FitnessClass(null, "Class")).toThrow();
    expect(() => new FitnessClass("Gym", null)).toThrow();
  });
});
describe("GymManagement", () => {
  let gym;

  beforeEach(() => {
    gym = new GymManagement("FitLife Gym");
  });

  test("should initialize gym with correct name and zero members", () => {
    expect(gym.gymName).toBe("FitLife Gym");
    expect(gym.totalMembers).toBe(0);
  });

  test("should correctly manage a workout and increase member count", async () => {
    await gym.manageWorkout("HIIT", true, "Alice");
    expect(gym.totalMembers).toBe(1);
  });

  test("should handle intense workouts with a warning", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    await gym.manageWorkout("HIIT", true, "Alice");
    expect(consoleSpy).toHaveBeenCalledWith("Warning: Intense workout ahead!");
    consoleSpy.mockRestore();
  });

  test("should register a member with a valid name", async () => {
    await gym.registerMember("John");
    expect(gym.totalMembers).toBe(1);
  });

  test("should throw error for invalid member names", async () => {
    await expect(() => gym.registerMember(null).toThrow());
    await expect(() => gym.registerMember(undefined).toThrow());
  });

  test("should add equipment correctly", () => {
    gym.addEquipment("Treadmill", 1500.0);
    const equipment = gym.equipment.get("Treadmill");

    expect(equipment).toEqual({
      cost: 1500.0,
      addedAt: expect.any(Date),
    });
  });

  test("should throw error for invalid equipment data", () => {
    expect(() => gym.addEquipment(null, 1500.0)).toThrow();
    expect(() => gym.addEquipment("Treadmill", -100)).toThrow();
  });

  test("should handle concurrent member registration", async () => {
    await Promise.all([
      gym.registerMember("John"),
      gym.registerMember("Jane"),
      gym.registerMember("Bob"),
    ]);
    expect(gym.totalMembers).toBe(3);
  });
});