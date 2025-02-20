class GymManagement {
  constructor(name) {
    if (!name) {
      throw new Error("Gym name is required.");
    }
    this.gymName = name;
    this.workouts = new Map();
    this.equipment = new Map();
    this.totalMembers = 0;
  }

  async manageWorkout(workoutName, isIntense, trainerName) {
    if (!workoutName || !trainerName) {
      throw new Error("Workout name and trainer name are required.");
    }
    this.workouts.set(workoutName, { isIntense, trainerName });
    console.log(`${trainerName} designed the workout: ${workoutName}`);
    if (isIntense) {
      console.log("Warning: Intense workout ahead!");
    }
  }

  async registerMember(memberName) {
    if (!memberName) {
      throw new Error("Member name is required.");
    }
    await this.lockMemberRegistration(async () => {
      this.totalMembers++;
    });
    console.log(`Registered member: ${memberName}`);
  }

  async addEquipment(equipmentName, cost) {
    if (!equipmentName || !cost) {
      throw new Error("Equipment name and cost are required.");
    }
    this.equipment.set(equipmentName, cost);
  }

  async lockMemberRegistration(callback) {
    // Acquire lock
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      await callback();
    } finally {
      // Release lock
    }
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

  async run() {
    this.status = "ongoing";
    console.log(`Fitness class ${this.className} started at ${this.gymName}.`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.status = "completed";
    console.log(`Fitness class ${this.className} completed at ${this.gymName}.`);
  }
}

module.exports = { GymManagement, FitnessClass };