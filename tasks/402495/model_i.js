class GymManagement {
    /**
     * @param {string} name - Name of the gym
     */
    constructor(name) {
        this.gymName = name;
        this.totalMembers = 0;
        this.workouts = [];
        this.equipmentList = new Map();
    }

    /**
     * Manage a workout
     * @param {string} workoutName - Name of the workout
     * @param {boolean} isIntense - Intensity of the workout
     * @param {string} trainerName - Name of the trainer
     */
    manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || !trainerName) {
            throw new Error('Workout name and trainer name are required');
        }

        this.workouts.push(workoutName);
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        this.totalMembers++;
        console.log(`Total registered members: ${this.totalMembers}`);
    }

    /**
     * Register a member
     * @param {string} memberName - Name of the member
     */
    registerMember(memberName) {
        if (!memberName) {
            throw new Error('Member name is required');
        }

        console.log(`Registering member: ${memberName}`);
        this.totalMembers++;
    }

    /**
     * Start a fitness class
     */
    async startFitnessClass() {
        const fitnessClass = new FitnessClass();
        await fitnessClass.run();
    }

    /**
     * Add equipment to the gym
     * @param {string} equipmentName - Name of the equipment
     * @param {number} cost - Cost of the equipment
     */
    addEquipment(equipmentName, cost) {
        if (!equipmentName || !cost) {
            throw new Error('Equipment name and cost are required');
        }

        this.equipmentList.set(equipmentName, cost);
    }
}

class FitnessClass {
    constructor() {
        this.status = null;
    }

    /**
     * Run the fitness class
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