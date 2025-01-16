class Equipment {
    #name;
    #cost;

    constructor(name, cost) {
        this.#validateEquipment(name, cost);
        this.#name = name;
        this.#cost = cost;
    }

    #validateEquipment(name, cost) {
        if (!name || typeof name !== 'string') {
            throw new Error('Equipment name must be a non-empty string');
        }
        if (!cost || typeof cost !== 'number' || cost <= 0) {
            throw new Error('Equipment cost must be a positive number');
        }
    }

    get name() {
        return this.#name;
    }

    get cost() {
        return this.#cost;
    }
}

class Workout {
    #name;
    #intensity;
    #trainer;

    constructor(name, isIntense, trainer) {
        this.#validateWorkout(name, trainer);
        this.#name = name;
        this.#intensity = isIntense;
        this.#trainer = trainer;
    }

    #validateWorkout(name, trainer) {
        if (!name || typeof name !== 'string') {
            throw new Error('Workout name must be a non-empty string');
        }
        if (!trainer || typeof trainer !== 'string') {
            throw new Error('Trainer name must be a non-empty string');
        }
    }

    get details() {
        return {
            name: this.#name,
            intensity: this.#intensity,
            trainer: this.#trainer
        };
    }
}

class FitnessClass {
    #status;

    constructor() {
        this.#status = null;
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
    #totalMembers;
    #equipment;
    #workouts;
    #members;

    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Gym name must be a non-empty string');
        }
        this.#gymName = name;
        this.#totalMembers = 0;
        this.#equipment = new Map();
        this.#workouts = new Set();
        this.#members = new Set();
    }

    get gymName() {
        return this.#gymName;
    }

    get totalMembers() {
        return this.#totalMembers;
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        try {
            const workout = new Workout(workoutName, isIntense, trainerName);
            this.#workouts.add(workout);
            
            const { name, intensity, trainer } = workout.details;
            console.log(`${trainer} designed the workout: ${name}`);
            
            if (intensity) {
                console.log('Warning: Intense workout ahead!');
            }
            
            return workout;
        } catch (error) {
            console.error(`Failed to manage workout: ${error.message}`);
            throw error;
        }
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
        return true;
    }

    async startFitnessClass() {
        try {
            const fitnessClass = new FitnessClass();
            await fitnessClass.run();
            return fitnessClass;
        } catch (error) {
            console.error(`Failed to start fitness class: ${error.message}`);
            throw error;
        }
    }

    addEquipment(equipmentName, cost) {
        try {
            const equipment = new Equipment(equipmentName, cost);
            this.#equipment.set(equipmentName, equipment);
            console.log(`Added equipment: ${equipmentName} (Cost: $${cost})`);
            return equipment;
        } catch (error) {
            console.error(`Failed to add equipment: ${error.message}`);
            throw error;
        }
    }

    getEquipment(equipmentName) {
        return this.#equipment.get(equipmentName);
    }
}

module.exports = { GymManagement, FitnessClass };