class GymManagement {
  #workouts;
  #equipment;
  #totalMembers;
  #lock;

  constructor(name) {
    if (!name) {
      throw new Error("Name is required");
    }
    this.name = name;
    this.#workouts = new Map();
    this.#equipment = new Map();
    this.#totalMembers = 0;
    this.#lock = false;
  }

  async manageWorkout(workoutName, isIntense, trainerName) {
    if (!workoutName || !trainerName) {
      throw new Error("Workout name and trainer name are required");
    }
    this.#workouts.set(workoutName, { isIntense, trainerName });
    console.log(`${trainerName} designed the workout: ${workoutName}`);
    if (isIntense) {
      console.log("Warning: Intense workout ahead!");
    }
  }

  async registerMember(memberName) {
    if (!memberName) {
      throw new Error("Member name is required");
    }
    while (this.#lock) {
      await new Promise(resolve => globalThis.setTimeout(resolve, 10));
    }
    this.#lock = true;
    try {
      console.log(`Registering member: ${memberName}`);
      this.#totalMembers++;
    } finally {
      this.#lock = false;
    }
  }

  async addEquipment(equipmentName, cost) {
    if (!equipmentName || !cost) {
      throw new Error("Equipment name and cost are required");
    }
    this.#equipment.set(equipmentName, cost);
  }

  async startFitnessClass(className) {
    const fitnessClass = new FitnessClass(this.name, className);
    await fitnessClass.run();
  }
}

class FitnessClass {
  #status;

  constructor(gymName, className) {
    if (!gymName || !className) {
      throw new Error("Gym name and class name are required");
    }
    this.gymName = gymName;
    this.className = className;
    this.#status = null;
  }

  async run() {
    this.#status = "ongoing";
    console.log(`Fitness class ${this.className} started at ${this.gymName}.`);
    await new Promise(resolve => globalThis.setTimeout(resolve, 2000));
    this.#status = "completed";
    console.log(`Fitness class ${this.className} completed at ${this.gymName}.`);
  }
}

module.exports = { GymManagement, FitnessClass };