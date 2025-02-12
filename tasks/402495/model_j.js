class GymManagement {
    #workouts;
    #equipment;
    #totalMembers;
    #name;

    constructor(name) {
        if (!name) {
            throw new Error("Gym name is required");
        }
        this.#name = name;
        this.#workouts = new Map();
        this.#equipment = new Map();
        this.#totalMembers = 0;
    }

    manageWorkout(workoutName, isIntense, trainerName) {
        if (!workoutName || !trainerName) {
            console.error("Workout name and trainer name are required");
            return;
        }
        this.#workouts.set(workoutName, { isIntense, trainerName });
        console.log(`${trainerName} designed the workout: ${workoutName}`);
        if (isIntense) {
            console.log("Warning: Intense workout ahead!");
        }
    }

    async registerMember(memberName) {
        if (!memberName) {
            console.error("Member name is required");
            return;
        }
        await this.#incrementTotalMembers();
        console.log(`Registering member: ${memberName}`);
    }

    async #incrementTotalMembers() {
        await new Promise(resolve => globalThis.setTimeout(resolve, 0));
        this.#totalMembers++;
    }

    addEquipment(equipmentName, cost) {
        if (!equipmentName || !cost) {
            console.error("Equipment name and cost are required");
            return;
        }
        this.#equipment.set(equipmentName, cost);
    }

    get totalMembers() {
        return this.#totalMembers;
    }
}

class FitnessClass {
    #status;
    #gymName;
    #className;

    constructor(gymName, className) {
        if (!gymName || !className) {
            throw new Error("Gym name and class name are required");
        }
        this.#gymName = gymName;
        this.#className = className;
        this.#status = null;
    }

    async run() {
        this.#status = "ongoing";
        globalThis.console.log(`Fitness class started at ${this.#gymName}: ${this.#className}`);
        await new Promise(resolve => globalThis.setTimeout(resolve, 2000));
        this.#status = "completed";
        globalThis.console.log(`Fitness class completed at ${this.#gymName}: ${this.#className}`);
    }

    get status() {
        return this.#status;
    }
}

const gym = new GymManagement("Fitness Center");
gym.manageWorkout("Weightlifting", true, "John Doe");
gym.registerMember("Jane Doe");
gym.addEquipment("Treadmill", 500);

const fitnessClass = new FitnessClass("Fitness Center", "Yoga");
fitnessClass.run();