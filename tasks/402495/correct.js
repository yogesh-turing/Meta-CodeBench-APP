class GymManagement {
  constructor(name) {
    if (!name) {
      throw new Error("Gym name is required.");
    }
    this.name = name;
    this.totalMembers = 0;
    this.workouts = new Map(); // Map to store workout details
    this.equipment = new Map(); // Map to store equipment details
    this.memberLock = false; // Lock for asynchronous member registration
  }

  // Manage workouts with validation
  async manageWorkout(workoutName, isIntense, trainerName) {
    if (!workoutName || !trainerName) {
      throw new Error("Workout name and trainer name are required.");
    }

    this.workouts.set(workoutName, { trainer: trainerName, isIntense });
    console.log(`${trainerName} designed the workout: ${workoutName}`);
    if (isIntense) {
      console.log("Warning: Intense workout ahead!");
    }
  }

  // Safely register members with asynchronous locking
  async registerMember(memberName) {
    if (!memberName) {
      throw new Error("Member name is required.");
    }

    // Simulate asynchronous locking
    while (this.memberLock) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait until lock is released
    }

    this.memberLock = true; // Acquire lock
    try {
      console.log(`Registering member: ${memberName}`);
      this.totalMembers++;
    } finally {
      this.memberLock = false; // Release lock
    }
  }

  // Add equipment with validation
  async addEquipment(equipmentName, cost) {
    if (!equipmentName || cost === undefined || cost < 0) {
      throw new Error("Equipment name and valid cost are required.");
    }

    this.equipment.set(equipmentName, cost);
    console.log(`Added equipment: ${equipmentName} with cost $${cost}`);
  }

  // Start a fitness class
  async startFitnessClass(className) {
    const fitnessClass = new FitnessClass(this.name, className);
    await fitnessClass.run();
  }
}

class FitnessClass {
  constructor(gymName, className) {
    if (!gymName || !className) {
      throw new Error("Gym name and class name are required.");
    }
    this.gymName = gymName;
    this.className = className;
    this.status = null;
  }

  // Simulate class execution with a 2-second delay
  async run() {
    this.status = "ongoing";
    console.log(`Fitness class "${this.className}" at ${this.gymName} started.`);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2-second delay

    this.status = "completed";
    console.log(`Fitness class "${this.className}" at ${this.gymName} completed.`);
  }
}

// Export the classes
module.exports = { GymManagement, FitnessClass };

