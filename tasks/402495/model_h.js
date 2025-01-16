class GymManagement {
    /**
     * Initialize the GymManagement class.
     * @param {string} name - Name of the gym.
     */
    constructor(name) {
        this.gymName = name;
        this.totalMembers = 0;
        this.workouts = new Map();
        this.equipmentList = new Map();
    }

    /**
     * Manage a workout.
     * @param {string} workoutName - Name of the workout.
     * @param {boolean} isIntense - Whether the workout is intense.
     * @param {string} trainerName - Name of the trainer.
     */
    manageWorkout(workoutName, isIntense, trainerName) {
        if (typeof workoutName !== 'string' || typeof trainerName !== 'string') {
            throw new Error('Invalid input type. Workout name and trainer name must be strings.');
        }

        this.workouts.set(workoutName, { isIntense, trainerName });
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        this.totalMembers++;
        console.log(`Total registered members: ${this.totalMembers}`);
    }

    /**
     * Register a member.
     * @param {string} memberName - Name of the member.
     */
    registerMember(memberName) {
        if (typeof memberName !== 'string') {
            throw new Error('Invalid input type. Member name must be a string.');
        }

        console.log(`Registering member: ${memberName}`);
        this.totalMembers++;
    }

    /**
     * Start a fitness class.
     */
    async startFitnessClass() {
        const fitnessClass = new FitnessClass();
        await fitnessClass.run();
    }

    /**
     * Add equipment to the gym.
     * @param {string} equipmentName - Name of the equipment.
     * @param {number} cost - Cost of the equipment.
     */
    addEquipment(equipmentName, cost) {
        if (typeof equipmentName !== 'string' || typeof cost !== 'number') {
            throw new Error('Invalid input type. Equipment name must be a string and cost must be a number.');
        }

        this.equipmentList.set(equipmentName, cost);
    }
}

class FitnessClass {
    constructor() {
        this.status = null;
    }

    /**
     * Run the fitness class.
     */
    async run() {
        this.status = 'ongoing';
        console.log('Fitness class started.');
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.status = 'completed';
        console.log('Fitness class completed.');
    }
}

module.exports = { GymManagement, FitnessClass };