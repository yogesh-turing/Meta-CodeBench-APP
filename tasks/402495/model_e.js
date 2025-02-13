class GymManagement {
    constructor(name) {
        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw new Error('Gym name is required and must be a non-empty string');
        }
        this.gymName = name;
        this.totalMembers = 0;
        this.workouts = new Map();
        this.equipment = new Map();
        this.memberLock = Promise.resolve(); // For async locking
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || typeof workoutName !== 'string') {
            throw new Error('Valid workout name is required');
        }
        if (typeof isIntense !== 'boolean') {
            throw new Error('isIntense must be a boolean value');
        }
        if (!trainerName || typeof trainerName !== 'string') {
            throw new Error('Valid trainer name is required');
        }

        const workoutDetails = {
            name: workoutName,
            intense: isIntense,
            trainer: trainerName,
            createdAt: new Date()
        };

        this.workouts.set(workoutName, workoutDetails);
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        
        if (isIntense) {
            console.log('Warning: Intense workout ahead!');
        }

        return workoutDetails;
    }

    async registerMember(memberName) {
        if (!memberName || typeof memberName !== 'string' || memberName.trim() === '') {
            throw new Error('Valid member name is required');
        }

        // Use async lock for thread-safe increment
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
            throw new Error('Valid equipment name is required');
        }
        if (typeof cost !== 'number' || cost <= 0) {
            throw new Error('Cost must be a positive number');
        }

        const equipmentDetails = {
            name: equipmentName,
            cost: cost,
            addedAt: new Date()
        };

        this.equipment.set(equipmentName, equipmentDetails);
        return equipmentDetails;
    }

    startFitnessClass(className) {
        if (!className || typeof className !== 'string') {
            throw new Error('Valid class name is required');
        }
        const fitnessClass = new FitnessClass(this.gymName, className);
        return fitnessClass.run();
    }
}

class FitnessClass {
    constructor(gymName, className) {
        if (!gymName || typeof gymName !== 'string') {
            throw new Error('Valid gym name is required');
        }
        if (!className || typeof className !== 'string') {
            throw new Error('Valid class name is required');
        }
        
        this.gymName = gymName;
        this.className = className;
        this.status = 'initialized';
    }

    async run() {
        this.status = 'ongoing';
        console.log(`Fitness class '${this.className}' started at ${this.gymName}`);

        return new Promise((resolve) => {
            setTimeout(() => {
                this.status = 'completed';
                console.log(`Fitness class '${this.className}' completed at ${this.gymName}`);
                resolve(this.status);
            }, 2000);
        });
    }
}

module.exports = { GymManagement, FitnessClass };