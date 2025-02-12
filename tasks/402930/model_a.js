class GymManagement {
    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Gym name is required and must be a string');
        }
        this.gymName = name;
        this.totalMembers = 0;
        this.workouts = new Map();
        this.equipment = new Map();
        this.memberLock = Promise.resolve(); // For async locking
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || typeof workoutName !== 'string') {
            throw new Error('Workout name is required and must be a string');
        }
        if (typeof isIntense !== 'boolean') {
            throw new Error('isIntense must be a boolean');
        }
        if (!trainerName || typeof trainerName !== 'string') {
            throw new Error('Trainer name is required and must be a string');
        }

        this.workouts.set(workoutName, {
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
            throw new Error('Member name is required and must be a string');
        }

        // Ensure thread-safe increment using async lock
        this.memberLock = this.memberLock.then(async () => {
            console.log(`Registering member: ${memberName}`);
            this.totalMembers++;
            console.log(`Total registered members: ${this.totalMembers}`);
            return this.totalMembers;
        });

        return this.memberLock;
    }

    addEquipment(equipmentName, cost) {
        if (!equipmentName || typeof equipmentName !== 'string') {
            throw new Error('Equipment name is required and must be a string');
        }
        if (typeof cost !== 'number' || cost <= 0) {
            throw new Error('Cost must be a positive number');
        }

        this.equipment.set(equipmentName, cost);
        return true;
    }

    startFitnessClass(className) {
        if (!className || typeof className !== 'string') {
            throw new Error('Class name is required and must be a string');
        }
        const fitnessClass = new FitnessClass(this.gymName, className);
        return fitnessClass.run();
    }
}

class FitnessClass {
    constructor(gymName, className) {
        if (!gymName || typeof gymName !== 'string') {
            throw new Error('Gym name is required and must be a string');
        }
        if (!className || typeof className !== 'string') {
            throw new Error('Class name is required and must be a string');
        }
        
        this.gymName = gymName;
        this.className = className;
        this.status = null;
    }

    async run() {
        this.status = 'ongoing';
        console.log(`Fitness class ${this.className} started at ${this.gymName}`);

        return new Promise((resolve) => {
            setTimeout(() => {
                this.status = 'completed';
                console.log(`Fitness class ${this.className} completed at ${this.gymName}`);
                resolve(this.status);
            }, 2000);
        });
    }
}

module.exports = { GymManagement, FitnessClass };