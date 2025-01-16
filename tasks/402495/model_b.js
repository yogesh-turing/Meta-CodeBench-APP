class Equipment {
    #name;
    #cost;

    constructor(name, cost) {
        this.#validateEquipmentData(name, cost);
        this.#name = name;
        this.#cost = cost;
    }

    #validateEquipmentData(name, cost) {
        if (!name || typeof name !== 'string') {
            throw new Error('Equipment name must be a non-empty string');
        }
        if (!cost || typeof cost !== 'number' || cost <= 0) {
            throw new Error('Equipment cost must be a positive number');
        }
    }

    getName() {
        return this.#name;
    }

    getCost() {
        return this.#cost;
    }
}

class Workout {
    #name;
    #intensity;
    #trainer;

    constructor(name, isIntense, trainer) {
        this.#validateWorkoutData(name, trainer);
        this.#name = name;
        this.#intensity = isIntense;
        this.#trainer = trainer;
    }

    #validateWorkoutData(name, trainer) {
        if (!name || typeof name !== 'string') {
            throw new Error('Workout name must be a non-empty string');
        }
        if (!trainer || typeof trainer !== 'string') {
            throw new Error('Trainer name must be a non-empty string');
        }
    }

    getDetails() {
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
        this.#status = 'pending';
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
            console.error('Fitness class failed:', error.message);
        }
    }

    getStatus() {
        return this.#status;
    }
}

class GymManagement {
    #gymName;
    #totalMembers;
    #equipment;
    #workouts;
    #members;

    constructor(name) {
        this.#validateGymName(name);
        this.#gymName = name;
        this.#totalMembers = 0;
        this.#equipment = new Map();
        this.#workouts = new Set();
        this.#members = new Set();
    }

    #validateGymName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Gym name must be a non-empty string');
        }
    }

    addEquipment(equipmentName, cost) {
        const equipment = new Equipment(equipmentName, cost);
        this.#equipment.set(equipmentName, equipment);
        return equipment;
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        const workout = new Workout(workoutName, isIntense, trainerName);
        this.#workouts.add(workout);
        
        const { name, intensity, trainer } = workout.getDetails();
        console.log(`${trainer} designed the workout: ${name}`);
        
        if (intensity) {
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
        console.log(`Total registered members: ${this.#totalMembers}`);
    }

    async startFitnessClass() {
        const fitnessClass = new FitnessClass();
        await fitnessClass.run();
        return fitnessClass;
    }

    getTotalMembers() {
        return this.#totalMembers;
    }

    getGymName() {
        return this.#gymName;
    }
}

module.exports = { GymManagement, FitnessClass, Workout, Equipment };