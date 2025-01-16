class GymManagement {
    constructor(name) {
      if (!name) throw new Error("Gym name is required");
      this.gymName = name;
      this.totalMembers = 0;
      this.workouts = new Map();
      this.equipment = new Map();
      this._memberLock = false;
    }
  
    async manageWorkout(workoutName, isIntense, trainerName) {
      if (!workoutName || !trainerName) {
        throw new Error("Workout name and trainer name are required");
      }
  
      this.workouts.set(workoutName, {
        trainer: trainerName,
        intensity: isIntense,
        createdAt: new Date(),
      });
  
      console.log(`${trainerName} designed the workout: ${workoutName}`);
      if (isIntense) console.log("Warning: Intense workout ahead!");
  
      await this.incrementMembers();
    }
  
    async registerMember(memberName) {
      if (!memberName) {
        throw new Error("Member name is required");
      }
  
      console.log(`Registering member: ${memberName}`);
      await this.incrementMembers();
    }
  
    async incrementMembers() {
      while (this._memberLock) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
  
      this._memberLock = true;
      try {
        this.totalMembers++;
        console.log(`Total registered members: ${this.totalMembers}`);
      } finally {
        this._memberLock = false;
      }
    }
  
    addEquipment(equipmentName, cost) {
      if (!equipmentName || typeof cost !== "number" || cost <= 0) {
        throw new Error("Valid equipment name and positive cost are required");
      }
  
      this.equipment.set(equipmentName, {
        cost,
        addedAt: new Date(),
      });
    }
  
    async startFitnessClass(className = "General Fitness") {
      const fitnessClass = new FitnessClass(this.gymName, className);
      return fitnessClass.run();
    }
  }
  
  class FitnessClass {
    constructor(gymName, className) {
      if (!gymName || !className) {
        throw new Error("Gym name and class name are required");
      }
  
      this.gymName = gymName || null;
      this.className = className || null ;
      this.status = null;
    }
  
    async run() {
      this.status = "ongoing";
      console.log(`${this.className} class started at ${this.gymName}`);
  
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.status = "completed";
        console.log(`${this.className} class completed at ${this.gymName}`);
        return { status: this.status, className: this.className };
      } catch (error) {
        this.status = "failed";
        throw error;
      }
    }
  }
  module.exports =  { GymManagement, FitnessClass };