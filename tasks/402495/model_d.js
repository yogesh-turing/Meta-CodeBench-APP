class Equipment {
    constructor(name, cost) {
        if (!name || typeof name !== 'string') {
            throw new Error('Equipment name must be a non-empty string');
        }
        if (!cost || typeof cost !== 'number' || cost <= 0) {
            throw new Error('Equipment cost must be a positive number');
        }
        this.name = name;
        this.cost = cost;
    }
}

class Workout {
    constructor(name, isIntense, trainer) {
        if (!name || typeof name !== 'string') {
            throw new Error('Workout name must be a non-empty string');
        }
        if (typeof isIntense !== 'boolean') {
            throw new Error('isIntense must be a boolean value');
        }
        if (!trainer || typeof trainer !== 'string') {
            throw new Error('Trainer name must be a non-empty string');
        }
        this.name = name;
        this.isIntense = isIntense;
        this.trainer = trainer;
    }
}

class FitnessClass {
    #status;

    constructor() {
        this.#status = null;
    }

    async run() {
        this.#status = 'ongoing';
        console.log('Fitness class started.');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.#status = 'completed';
            console.log('Fitness class completed.');
        } catch (error) {
            this.#status = 'failed';
            console.error('Fitness class failed:', error);
        }
    }

    get status() {
        return this.#status;
    }
}

class GymManagement {
    #gymName;
    #totalMembers;
    #workouts;
    #equipment;
    #members;

    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Gym name must be a non-empty string');
        }
        this.#gymName = name;
        this.#totalMembers = 0;
        this.#workouts = new Set();
        this.#equipment = new Map();
        this.#members = new Set();
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        const workout = new Workout(workoutName, isIntense, trainerName);
        this.#workouts.add(workout);

        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        return workout;
    }

    registerMember(memberName) {
        if (!memberName || typeof memberName !== 'string') {
            throw new Error('Member name must be a non-empty string');
        }

        if (this.#members.has(memberName)) {
            throw new Error('Member already registered');
        }

        this.#members.add(memberName);
        this.#totalMembers++;
        console.log(`Registering member: ${memberName}`);
        return this.#totalMembers;
    }

    async startFitnessClass() {
        const fitnessClass = new FitnessClass();
        await fitnessClass.run();
        return fitnessClass;
    }

    addEquipment(equipmentName, cost) {
        const equipment = new Equipment(equipmentName, cost);
        this.#equipment.set(equipmentName, equipment);
        return equipment;
    }

    get totalMembers() {
        return this.#totalMembers;
    }

    get gymName() {
        return this.#gymName;
    }

    getEquipment(equipmentName) {
        return this.#equipment.get(equipmentName);
    }

    getAllEquipment() {
        return Array.from(this.#equipment.values());
    }

    getAllWorkouts() {
        return Array.from(this.#workouts);
    }

    getAllMembers() {
        return Array.from(this.#members);
    }
}

module.exports = { GymManagement, FitnessClass };