class GymManagement {
    #workouts = new Map();
    #equipment = new Map();
    #memberLock = Promise.resolve();

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
            name: workoutName,
            trainer: trainerName,
            intense: isIntense,
            createdAt: new Date()
        };

        this.#workouts.set(workoutName, workoutDetails);
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        return workoutDetails;
    }

    async registerMember(memberName) {
        if (!memberName || typeof memberName !== 'string') {
            throw new Error('Valid member name is required');
        }

        // Use async lock for thread-safe member registration
        this.#memberLock = this.#memberLock.then(async () => {
            console.log(`Registering member: ${memberName}`);
            this.totalMembers++;
            return this.totalMembers;
        });

        return this.#memberLock;
    }

    addEquipment(equipmentName, cost) {
        if (!equipmentName || typeof equipmentName !== 'string') {
            throw new Error('Equipment name is required and must be a string');
        }

        if (typeof cost !== 'number' || cost <= 0) {
            throw new Error('Equipment cost must be a positive number');
        }

        const equipmentDetails = {
            name: equipmentName,
            cost: cost,
            addedAt: new Date()
        };

        this.#equipment.set(equipmentName, equipmentDetails);
        return equipmentDetails;
    }

    startFitnessClass(className) {
        if (!className) {
            throw new Error('Class name is required');
        }
        return new FitnessClass(this.gymName, className).run();
    }

    getWorkouts() {
        return Array.from(this.#workouts.values());
    }

    getEquipment() {
        return Array.from(this.#equipment.values());
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
        console.log(`Fitness class ${this.#className} started at ${this.#gymName}`);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.#status = 'completed';
            console.log(`Fitness class ${this.#className} completed at ${this.#gymName}`);
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