class GymManagement {
    #workouts = new Map();
    #equipment = new Map();
    #memberLock = false;

    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Gym name is required and must be a string');
        }
        this.gymName = name;
        this.totalMembers = 0;
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || !trainerName) {
            throw new Error('Workout name and trainer name are required');
        }

        if (typeof isIntense !== 'boolean') {
            throw new Error('isIntense must be a boolean value');
        }

        const workoutDetails = {
            trainer: trainerName,
            intense: isIntense,
            dateAdded: new Date()
        };

        this.#workouts.set(workoutName, workoutDetails);

        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        return workoutDetails;
    }

    async registerMember(memberName) {
        if (!memberName) {
            throw new Error('Member name is required');
        }

        // Simple async lock mechanism
        while (this.#memberLock) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        try {
            this.#memberLock = true;
            console.log(`Registering member: ${memberName}`);
            this.totalMembers++;
            return this.totalMembers;
        } finally {
            this.#memberLock = false;
        }
    }

    addEquipment(equipmentName, cost) {
        if (!equipmentName || typeof equipmentName !== 'string') {
            throw new Error('Equipment name is required and must be a string');
        }

        if (typeof cost !== 'number' || cost <= 0) {
            throw new Error('Cost must be a positive number');
        }

        const equipmentDetails = {
            cost,
            dateAdded: new Date()
        };

        this.#equipment.set(equipmentName, equipmentDetails);
        return equipmentDetails;
    }

    getWorkouts() {
        return new Map(this.#workouts);
    }

    getEquipment() {
        return new Map(this.#equipment);
    }

    startFitnessClass(className) {
        if (!className) {
            throw new Error('Class name is required');
        }
        return new FitnessClass(this.gymName, className);
    }
}

class FitnessClass {
    #status = null;
    #gymName;
    #className;

    constructor(gymName, className) {
        if (!gymName || !className) {
            throw new Error('Gym name and class name are required');
        }
        this.#gymName = gymName;
        this.#className = className;
    }

    async run() {
        this.#status = 'ongoing';
        console.log(`Fitness class '${this.#className}' started at ${this.#gymName}`);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.#status = 'completed';
            console.log(`Fitness class '${this.#className}' completed at ${this.#gymName}`);
            return this.#status;
        } catch (error) {
            this.#status = 'failed';
            throw new Error(`Fitness class failed: ${error.message}`);
        }
    }

    getStatus() {
        return this.#status;
    }
}

module.exports = { GymManagement, FitnessClass };