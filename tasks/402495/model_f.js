// Importing the required modules

class Equipment {
    /**
     * Initializes a new instance of the Equipment class.
     * @param {string} name - The name of the equipment.
     * @param {number} cost - The cost of the equipment.
     */
    constructor(name, cost) {
      this._name = name;
      this._cost = cost;
    }
  
    /**
     * Gets the name of the equipment.
     * @returns {string} The name of the equipment.
     */
    get name() {
      return this._name;
    }
  
    /**
     * Gets the cost of the equipment.
     * @returns {number} The cost of the equipment.
     */
    get cost() {
      return this._cost;
    }
  }

class FitnessClass {
  /**
   * Initializes a new instance of the FitnessClass class.
   */
  constructor() {
    this._status = null;
  }

  /**
   * Gets the status of the fitness class.
   * @returns {string} The status of the fitness class.
   */
  get status() {
    return this._status;
  }

  /**
   * Runs the fitness class.
   */
  async run() {
    this._status = "ongoing";
    console.log("Fitness class started.");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this._status = "completed";
    console.log("Fitness class completed.");
  }
}

class Workout {
    /**
     * Initializes a new instance of the Workout class.
     * @param {string} name - The name of the workout.
     * @param {boolean} isIntense - Whether the workout is intense.
     * @param {string} trainerName - The name of the trainer.
     */
    constructor(name, isIntense, trainerName) {
      this._name = name;
      this._isIntense = isIntense;
      this._trainerName = trainerName;
    }
  
    /**
     * Gets the name of the workout.
     * @returns {string} The name of the workout.
     */
    get name() {
      return this._name;
    }
  
    /**
     * Gets whether the workout is intense.
     * @returns {boolean} Whether the workout is intense.
     */
    get isIntense() {
      return this._isIntense;
    }
  
    /**
     * Gets the name of the trainer.
     * @returns {string} The name of the trainer.
     */
    get trainerName() {
      return this._trainerName;
    }
  }

  
// Defining the GymManagement class
class GymManagement {
  /**
   * Initializes a new instance of the GymManagement class.
   * @param {string} name - The name of the gym.
   */
  constructor(name) {
    this._gymName = name;
    this._totalMembers = 0;
    this._workouts = new Set();
    this._equipment = new Map();
  }

  /**
   * Gets the total number of members.
   * @returns {number} The total number of members.
   */
  get totalMembers() {
    return this._totalMembers;
  }

  /**
   * Manages a workout.
   * @param {Workout} workout - The workout to manage.
   */
  async manageWorkout(workout) {
    if (!(workout instanceof Workout)) {
      throw new Error("Invalid workout provided.");
    }

    this._workouts.add(workout);
    console.log(`${workout.trainerName} designed the workout: ${workout.name}`);

    if (workout.isIntense) {
      console.log("Warning: Intense workout ahead!");
    }

    this._totalMembers++;
    console.log(`Total registered members: ${this._totalMembers}`);
  }

  /**
   * Registers a member.
   * @param {string} memberName - The name of the member to register.
   */
  async registerMember(memberName) {
    if (!memberName) {
      throw new Error("Member name is missing.");
    }

    console.log(`Registering member: ${memberName}`);
    this._totalMembers++;
  }

  /**
   * Starts a fitness class.
   */
  async startFitnessClass() {
    const fitnessClass = new FitnessClass();
    await fitnessClass.run();
  }

  /**
   * Adds equipment to the gym.
   * @param {Equipment} equipment - The equipment to add.
   */
  static async addEquipment(equipment) {
    if (!(equipment instanceof Equipment)) {
      throw new Error("Invalid equipment provided.");
    }

    // Assuming equipmentList and equipmentCost are defined elsewhere
    // equipmentList.push(equipment.name);
    // equipmentCost.push(equipment.cost);
  }
}

module.exports = { GymManagement };