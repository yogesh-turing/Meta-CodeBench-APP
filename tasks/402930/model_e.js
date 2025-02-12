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

    async manageWorkout(workoutName, isIntense, trainerName) {
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

        return workoutDetails;
    }

    async registerMember(memberName) {
        if (!memberName || typeof memberName !== 'string') {
            throw new Error('Valid member name is required');
        }

        while (this.memberLock) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        try {
            this.memberLock = true;
            this.totalMembers++;
            console.log(`Registering member: ${memberName}`);
            console.log(`Total registered members: ${this.totalMembers}`);
            return this.totalMembers;
        } finally {
            this.memberLock = false;
        }
    }

    addEquipment(equipmentName, cost) {
        if (!equipmentName || typeof equipmentName !== 'string') {
            throw new Error('Valid equipment name is required');
        }

        if (typeof cost !== 'number' || cost <= 0) {
            throw new Error('Cost must be a positive number');
        }

        const equipmentDetails = {
            cost: cost,
            dateAdded: new Date()
        };

        this.equipment.set(equipmentName, equipmentDetails);
        return equipmentDetails;
    }

    async startFitnessClass(className) {
        if (!className) {
            throw new Error('Class name is required');
        }
        const fitnessClass = new FitnessClass(this.gymName, className);
        await fitnessClass.run();
        return fitnessClass;
    }
}

class FitnessClass {
    constructor(gymName, className) {
        if (!gymName || !className) {
            throw new Error('Gym name and class name are required');
        }
        this.gymName = gymName;
        this.className = className;
        this.status = 'pending';
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