class GymManagement {
    /**
     * Constructor to initialize the GymManagement object.
     * @param {string} name - The name of the gym.
     */
    constructor(name) {
        this._gymName = name;
        this._totalMembers = 0;
        this._workouts = [];
        this._equipmentList = new Map();
    }

    /**
     * Method to manage a workout.
     * @param {string} workoutName - The name of the workout.
     * @param {boolean} isIntense - Whether the workout is intense.
     * @param {string} trainerName - The name of the trainer.
     */
    manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || !trainerName) {
            throw new Error("Workout name and trainer name are required.");
        }

        this._workouts.push(workoutName);

        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log("Warning: Intense workout ahead!");
        }

        this._totalMembers++;
        console.log(`Total registered members: ${this._totalMembers}`);
    }

    /**
     * Method to register a member.
     * @param {string} memberName - The name of the member.
     */
    registerMember(memberName) {
        if (!memberName) {
            throw new Error("Member name is required.");
        }

        console.log(`Registering member: ${memberName}`);
        this._totalMembers++;
    }

    /**
     * Method to start a fitness class.
     */
    async startFitnessClass() {
        const fitnessClass = new FitnessClass();
        await fitnessClass.run();
    }

    /**
     * Method to add equipment.
     * @param {string} equipmentName - The name of the equipment.
     * @param {number} cost - The cost of the equipment.
     */
    addEquipment(equipmentName, cost) {
        if (!equipmentName || !cost) {
            throw new Error("Equipment name and cost are required.");
        }

        this._equipmentList.set(equipmentName, cost);
    }

    /**
     * Method to get the total members.
     * @returns {number} The total members.
     */
    getTotalMembers() {
        return this._totalMembers;
    }
}

class FitnessClass {
    /**
     * Constructor to initialize the FitnessClass object.
     */
    constructor() {
        this._status = null;
    }

    /**
     * Method to run the fitness class.
     */
    async run() {
        this._status = "ongoing";
        console.log("Fitness class started.");
        await new Promise(resolve => setTimeout(resolve, 2000));
        this._status = "completed";
        console.log("Fitness class completed.");
    }

    /**
     * Method to get the status of the fitness class.
     * @returns {string} The status of the fitness class.
     */
    getStatus() {
        return this._status;
    }
}

module.exports = { GymManagement, FitnessClass };