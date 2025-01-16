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
            console.error('Fitness class failed:', error);
        }
    }
}

class GymManagement {
    #gymName;
    #totalMembers = 0;
    #workouts = new Set();
    #equipment = new Map();
    #members = new Set();

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

    manageWorkout(workoutName, isIntense, trainerName) {
        try {
            const workout = new Workout(workoutName, isIntense, trainerName);
            this.#workouts.add(workout);
            console.log(`${trainerName} designed the workout: ${workoutName}`);
            
            if (isIntense) {
                console.log('Warning: Intense workout ahead!');
            }
            
            this.#totalMembers++;
            console.log(`Total registered members: ${this.#totalMembers}`);
            return workout;
        } catch (error) {
            console.error('Error managing workout:', error.message);
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
        const fitnessClass = new FitnessClass();
        try {
            await fitnessClass.run();
            return fitnessClass;
        } catch (error) {
            console.error('Error starting fitness class:', error.message);
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
            console.error('Error adding equipment:', error.message);
            throw error;
        }
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
}

module.exports = { GymManagement, FitnessClass };