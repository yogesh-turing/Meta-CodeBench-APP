class GymManagement {
    constructor(name) {
        if (!name) {
            throw new Error("Gym name is required.");
        }
        this.gymName = name;
        this.totalMembers = 0;
        this.workouts = new Map();
        this.equipment = new Map();
    }

    async manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || !trainerName) {
            throw new Error("Workout name and trainer name are required.");
        }
        this.workouts.set(workoutName, { isIntense, trainerName });
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log("Warning: Intense workout ahead!");
        }
        await this.incrementMembers();
        console.log(`Total registered members: ${this.totalMembers}`);
    }

    async registerMember(memberName) {
        if (!memberName) {
            throw new Error("Member name is required.");
        }
        console.log(`Registering member: ${memberName}`);
        await this.incrementMembers();
    }

    async incrementMembers() {
        await this.lock();
        try {
            this.totalMembers++;
        } finally {
            this.unlock();
        }
    }

    async lock() {
        while (this.locked) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

    addEquipment(equipmentName, cost) {
        if (!equipmentName || !cost) {
            throw new Error("Equipment name and cost are required.");
        }
        this.equipment.set(equipmentName, cost);
        console.log(`Added equipment: ${equipmentName} at a cost of ${cost}`);
    }
}

class FitnessClass {
    constructor(gymName, className) {
        if (!gymName || !className) {
            throw new Error("Gym name and class name are required.");
        }
        this.gymName = gymName;
        this.className = className;
        this.status = null;
    }

    async run() {
        this.status = "ongoing";
        console.log(`Fitness class ${this.className} started at ${this.gymName}.`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.status = "completed";
        console.log(`Fitness class ${this.className} completed at ${this.gymName}.`);
    }
}

module.exports = { GymManagement, FitnessClass };