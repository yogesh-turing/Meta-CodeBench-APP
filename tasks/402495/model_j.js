class GymManagement {
    #workouts;
    #equipment;
    #totalMembers;
    #mutex;

    constructor(name) {
        if (!name) {
            throw new Error("Gym name is required.");
        }
        this.gymName = name;
        this.#workouts = new Map();
        this.#equipment = new Map();
        this.#totalMembers = 0;
        this.#mutex = new Mutex();
    }

    async manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || !trainerName) {
            throw new Error("Workout name and trainer name are required.");
        }
        if (typeof isIntense !== "boolean") {
            throw new Error("Intensity must be a boolean value.");
        }

        this.#workouts.set(workoutName, { trainer: trainerName, isIntense });
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log("Warning: Intense workout ahead!");
        }
    }

    async registerMember(memberName) {
        if (!memberName) {
            throw new Error("Member name is required.");
        }

        await this.#mutex.runExclusive(async () => {
            this.#totalMembers++;
            console.log(`Registering member: ${memberName}`);
        });
    }

    async addEquipment(equipmentName, cost) {
        if (!equipmentName || !cost) {
            throw new Error("Equipment name and cost are required.");
        }
        if (typeof cost !== "number" || cost <= 0) {
            throw new Error("Cost must be a positive number.");
        }

        this.#equipment.set(equipmentName, cost);
    }

    async startFitnessClass(className) {
        const fitnessClass = new FitnessClass(this.gymName, className);
        await fitnessClass.run();
    }
}

class FitnessClass {
    #status;

    constructor(gymName, className) {
        if (!gymName || !className) {
            throw new Error("Gym name and class name are required.");
        }
        this.gymName = gymName;
        this.className = className;
        this.#status = null;
    }

    async run() {
        this.#status = "ongoing";
        console.log(`Fitness class ${this.className} started at ${this.gymName}.`);
        await new Promise(resolve => globalThis.setTimeout(resolve, 2000));
        this.#status = "completed";
        console.log(`Fitness class ${this.className} completed at ${this.gymName}.`);
    }
}

class Mutex {
    #mutex = Promise.resolve();

    async runExclusive(callback) {
        const currentMutex = this.#mutex;
        let nextMutex;
        this.#mutex = (async () => {
            await currentMutex;
            try {
                return await callback();
            } finally {
                nextMutex?.();
            }
        })();
        nextMutex = this.#mutex.then.bind(this.#mutex);
        return this.#mutex;
    }
}

module.exports = { GymManagement, FitnessClass };