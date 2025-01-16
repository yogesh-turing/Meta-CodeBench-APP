class GymManagement {
  /**
   * Creates an instance of GymManagement.
   * @param {string} name - Name of the gym
   */
  constructor(name) {
    this.gymName = name;
    this.totalMembers = 0;
    this.workouts = [];
    this.equipmentList = [];
    this.equipmentCost = [];
  }

  /**
   * Manages workout
   * @param {string} workoutName - Name of the workout
   * @param {boolean} isIntense - Whether the workout is intense
   * @param {string} trainerName - Name of the trainer
   */
  async manageWorkout(workoutName, isIntense, trainerName) {
    try {
      // Validate input
      if (!workoutName || !trainerName) {
        throw new Error("Workout name and trainer name are required.");
      }

      // Assign workout
      this.workouts.push(workoutName);

      console.log(`${trainerName} designed the workout: ${workoutName}`);
      if (isIntense) {
        console.log("Warning: Intense workout ahead!");
      }

      // Increment members
      this.totalMembers++;
      console.log(`Total registered members: ${this.totalMembers}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  /**
   * Registers a member
   * @param {string} memberName - Name of the member
   */
  async registerMember(memberName) {
    try {
      // Validate input
      if (!memberName) {
        throw new Error("Member name is required.");
      }

      console.log(`Registering member: ${memberName}`);
      this.totalMembers++;
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  /**
   * Starts a fitness class
   */
  async startFitnessClass() {
    try {
      const fitnessClass = new FitnessClass();
      await fitnessClass.run();
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  /**
   * Adds equipment
   * @param {string} equipmentName - Name of the equipment
   * @param {number} cost - Cost of the equipment
   */
  static async addEquipment(equipmentName, cost) {
    try {
      // Validate input
      if (!equipmentName || !cost) {
        throw new Error("Equipment name and cost are required.");
      }

      // Add equipment
      this.equipmentList.push(equipmentName);
      this.equipmentCost.push(cost);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

class FitnessClass {
  /**
   * Creates an instance of FitnessClass.
   */
  constructor() {
    this.status = null;
  }

  /**
   * Runs the fitness class
   */
  async run() {
    try {
      this.status = "ongoing";
      console.log("Fitness class started.");

      // Simulate a 2-second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      this.status = "completed";
      console.log("Fitness class completed.");
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

module.exports = { GymManagement, FitnessClass };