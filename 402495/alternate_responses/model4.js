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
        if (!workoutName || typeof workoutName !== 'string') {
            throw new Error('Workout name is required and must be a string');
        }
        if (typeof isIntense !== 'boolean') {
            throw new Error('isIntense must be a boolean value');
        }
        if (!trainerName || typeof trainerName !== 'string') {
            throw new Error('Trainer name is required and must be a string');
        }

        this.#workouts.set(workoutName, {
            isIntense,
            trainerName,
            createdAt: new Date()
        });

        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        return {
            workoutName,
            trainerName,
            isIntense
        };
    }

    async registerMember(memberName) {
        if (!memberName || typeof memberName !== 'string') {
            throw new Error('Member name is required and must be a string');
        }

        // Use atomic increment with async lock
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
            throw new Error('Cost must be a positive number');
        }

        if (this.#equipment.has(equipmentName)) {
            throw new Error('Equipment already exists');
        }

        this.#equipment.set(equipmentName, {
            cost,
            addedAt: new Date()
        });

        return {
            equipmentName,
            cost
        };
    }

    startFitnessClass(className) {
        if (!className || typeof className !== 'string') {
            throw new Error('Class name is required and must be a string');
        }
        
        const fitnessClass = new FitnessClass(this.gymName, className);
        return fitnessClass.run();
    }

    getWorkouts() {
        return Array.from(this.#workouts.entries()).map(([name, details]) => ({
            name,
            ...details
        }));
    }

    getEquipment() {
        return Array.from(this.#equipment.entries()).map(([name, details]) => ({
            name,
            ...details
        }));
    }
}

class FitnessClass {
    #status = null;
    #gymName;
    #className;

    constructor(gymName, className) {
        if (!gymName || typeof gymName !== 'string') {
            throw new Error('Gym name is required and must be a string');
        }
        if (!className || typeof className !== 'string') {
            throw new Error('Class name is required and must be a string');
        }

        this.#gymName = gymName;
        this.#className = className;
    }

    async run() {
        this.#status = 'ongoing';
        console.log(`Fitness class ${this.#className} started at ${this.#gymName}`);

        return new Promise((resolve) => {
            setTimeout(() => {
                this.#status = 'completed';
                console.log(`Fitness class ${this.#className} completed at ${this.#gymName}`);
                resolve(this.#status);
            }, 2000);
        });
    }

    getStatus() {
        return this.#status;
    }
}

module.exports = { GymManagement, FitnessClass };