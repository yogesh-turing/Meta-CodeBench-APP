class GymManagement {
    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Gym name is required and must be a string');
        }
        this.gymName = name;
        this.totalMembers = 0;
        this.workouts = new Map();
        this.equipment = new Map();
        this.memberLock = false;
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

        this.workouts.set(workoutName, workoutDetails);
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }
    }

    async registerMember(memberName) {
        if (!memberName) {
            throw new Error('Member name is required');
        }

        while (this.memberLock) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        try {
            this.memberLock = true;
            console.log(`Registering member: ${memberName}`);
            this.totalMembers++;
            console.log(`Total registered members: ${this.totalMembers}`);
        } finally {
            this.memberLock = false;
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
            cost: cost,
            dateAdded: new Date()
        };

        this.equipment.set(equipmentName, equipmentDetails);
        console.log(`Added equipment: ${equipmentName} with cost: $${cost}`);
    }

    startFitnessClass(className) {
        if (!className) {
            throw new Error('Class name is required');
        }
        const fitnessClass = new FitnessClass(this.gymName, className);
        return fitnessClass.run();
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
        try {
            this.status = 'ongoing';
            console.log(`Fitness class ${this.className} started at ${this.gymName}`);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.status = 'completed';
            console.log(`Fitness class ${this.className} completed at ${this.gymName}`);
            return this.status;
        } catch (error) {
            this.status = 'error';
            console.error(`Error in fitness class: ${error.message}`);
            throw error;
        }
    }
}

module.exports = { GymManagement, FitnessClass };