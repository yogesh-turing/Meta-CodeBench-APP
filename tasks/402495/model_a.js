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
    #status = null;

    constructor() {
        this.#status = 'pending';
    }

    get status() {
        return this.#status;
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
            console.error(`Fitness class failed: ${error.message}`);
        }
    }
}

class GymManagement {
    #gymName;
    #totalMembers = 0;
    #equipment = new Map();
    #workouts = new Set();

    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Gym name must be a non-empty string');
        }
        this.#gymName = name;
    }

    get gymName() {
        return this.#gymName;
    }

    get totalMembers() {
        return this.#totalMembers;
    }

    get equipmentList() {
        return Array.from(this.#equipment.entries());
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        const workout = new Workout(workoutName, isIntense, trainerName);
        this.#workouts.add(workout);
        
        console.log(`${workout.trainer} designed the workout: ${workout.name}`);
        if (workout.isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        this.#totalMembers++;
        console.log(`Total registered members: ${this.#totalMembers}`);
    }

    registerMember(memberName) {
        if (!memberName || typeof memberName !== 'string') {
            throw new Error('Member name must be a non-empty string');
        }

        console.log(`Registering member: ${memberName}`);
        this.#totalMembers++;
        return this.#totalMembers;
    }

    addEquipment(equipmentName, cost) {
        const equipment = new Equipment(equipmentName, cost);
        this.#equipment.set(equipment.name, equipment);
        return equipment;
    }

    async startFitnessClass() {
        const fitnessClass = new FitnessClass();
        try {
            await fitnessClass.run();
            return fitnessClass.status;
        } catch (error) {
            console.error(`Failed to start fitness class: ${error.message}`);
            throw error;
        }
    }

    getEquipmentCost(equipmentName) {
        const equipment = this.#equipment.get(equipmentName);
        if (!equipment) {
            throw new Error(`Equipment '${equipmentName}' not found`);
        }
        return equipment.cost;
    }
}

module.exports = { GymManagement, FitnessClass };