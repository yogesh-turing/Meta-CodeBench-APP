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

        if (this.#workouts.has(workoutName)) {
            throw new Error('Workout already exists');
        }

        this.#workouts.set(workoutName, {
            trainer: trainerName,
            intense: isIntense
        });

        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        return true;
    }

    async registerMember(memberName) {
        if (!memberName || typeof memberName !== 'string') {
            throw new Error('Valid member name is required');
        }

        while (this.#memberLock) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        try {
            this.#memberLock = true;
            console.log(`Registering member: ${memberName}`);
            this.totalMembers++;
            return true;
        } finally {
            this.#memberLock = false;
        }
    }

    addEquipment(equipmentName, cost) {
        if (!equipmentName || typeof equipmentName !== 'string') {
            throw new Error('Valid equipment name is required');
        }

        if (typeof cost !== 'number' || cost <= 0) {
            throw new Error('Cost must be a positive number');
        }

        if (this.#equipment.has(equipmentName)) {
            throw new Error('Equipment already exists');
        }

        this.#equipment.set(equipmentName, cost);
        return true;
    }

    async startFitnessClass(className) {
        if (!className) {
            throw new Error('Class name is required');
        }
        const fitnessClass = new FitnessClass(this.gymName, className);
        await fitnessClass.run();
        return fitnessClass;
    }
}

class FitnessClass {
    constructor(gymName, className) {
        if (!gymName || !className) {
            throw new Error('Gym name and class name are required');
        }
        this.gymName = gymName;
        this.className = className;
        this.status = null;
    }

    async run() {
        this.status = 'ongoing';
        console.log(`Fitness class ${this.className} started at ${this.gymName}`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.status = 'completed';
        console.log(`Fitness class ${this.className} completed at ${this.gymName}`);
        return this.status;
    }
}

module.exports = { GymManagement, FitnessClass };