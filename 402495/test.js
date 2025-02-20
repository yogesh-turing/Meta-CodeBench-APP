const { FitnessClass, GymManagement } = require('./solution');

describe("FitnessClass", () => {
  let fitnessClass;

  beforeEach(() => {
    fitnessClass = new FitnessClass("FitLife Gym", "HIIT Class");
  });

  test("should initialize with correct parameters", () => {
    expect(fitnessClass.gymName).toBe("FitLife Gym");
    expect(fitnessClass.className).toBe("HIIT Class");
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
    expect(gym.name).toBe("FitLife Gym");
  });

  test("should correctly manage a workout", async () => {
    await expect(gym.manageWorkout("HIIT", true, "Alice")).resolves.toBeUndefined();
  });

  test("should handle intense workouts with a warning", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    await gym.manageWorkout("HIIT", true, "Alice");
    expect(consoleSpy).toHaveBeenCalledWith("Warning: Intense workout ahead!");
    consoleSpy.mockRestore();
  });

  test("should register a member with a valid name", async () => {
    await gym.registerMember("John");
    // Using indirect check since #totalMembers is private
    await gym.registerMember("Jane");
    await gym.registerMember("Bob");
    expect(await gym.registerMember("Alice")).toBeUndefined();
  });

  test("should throw error for invalid member names", async () => {
    await expect(gym.registerMember(null)).rejects.toThrow();
    await expect(gym.registerMember(undefined)).rejects.toThrow();
  });

  test("should add equipment correctly", async () => {
    await gym.addEquipment("Treadmill", 1500.0);
    // Since #equipment is private, we cannot directly access it. Instead, test by calling the method.
    await expect(gym.addEquipment("Dumbbells", 500.0)).resolves.toBeUndefined();
  });

  test("should throw error for invalid equipment data", async () => {
    await expect(gym.addEquipment(null, 1500.0)).rejects.toThrow();
    await expect(gym.addEquipment("Treadmill", -100)).rejects.toThrow();
  });

  test("should handle concurrent member registration", async () => {
    await Promise.all([
      gym.registerMember("John"),
      gym.registerMember("Jane"),
      gym.registerMember("Bob"),
    ]);
    // Since #totalMembers is private, we check if all promises resolve
    await expect(gym.registerMember("Alice")).resolves.toBeUndefined();
  });
});