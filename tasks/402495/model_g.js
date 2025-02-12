class GymManagement {
  constructor(name) {
    if (!name) {
      throw new Error("Gym name is required");
    }
    this.gymName = name;
    this.totalMembers = 0;
    this.workouts = new Map();
    this.equipment = new Map();
  }

  async manageWorkout(workoutName, isIntense, trainerName) {
    if (!workoutName || !trainerName) {
      throw new Error("Workout name and trainer name are required");
    }
    this.workouts.set(workoutName, { isIntense, trainerName });
    console.log(`${trainerName} designed the workout: ${workoutName}`);
    if (isIntense) {
      console.log("Warning: Intense workout ahead!");
    }
    await this.incrementMembers();
  }

  async registerMember(memberName) {
    if (!memberName) {
      throw new Error("Member name is required");
    }
    console.log(`Registering member: ${memberName}`);
    await this.incrementMembers();
  }

  async incrementMembers() {
    // Using async/await to ensure atomicity
    await new Promise(resolve => {
      this.totalMembers++;
      resolve();
    });
    console.log(`Total registered members: ${this.totalMembers}`);
  }

  addEquipment(equipmentName, cost) {
    if (!equipmentName || !cost) {
      throw new Error("Equipment name and cost are required");
    }
    this.equipment.set(equipmentName, cost);
  }
}

class FitnessClass {
  constructor(gymName, className) {
    if (!gymName || !className) {
      throw new Error("Gym name and class name are required");
    }
    this.gymName = gymName;
    this.className = className;
    this.status = null;
  }

  async run() {
    this.status = "ongoing";
    console.log(`Fitness class ${this.className} started.`);
    await new Promise(resolve => {
      setTimeout(() => {
        this.status = "completed";
        console.log(`Fitness class ${this.className} completed.`);
        resolve();
      }, 2000);
    });
  }
}

module.exports = { GymManagement, FitnessClass };