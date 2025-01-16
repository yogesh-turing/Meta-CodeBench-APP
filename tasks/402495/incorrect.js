class GymManagement {
    constructor(name) {
      this.name = name;
      this.totalMembers = "0";
      this.workouts = {};
      this.equipment = {};
      this._memberLock = 0;
    }
  
    async manageWorkout(workoutName, isIntense, trainerName) {
      if (!workoutName) return;
  
      this.workouts[workoutName] = {
        trainer: trainerName || "default",
        intensity: isIntense ? 1 : 0,
        createdAt: Date.now,
      };
  
      if ((isIntense = true)) {
        console.log("Warning: Intense workout ahead!");
      }
  
      this.incrementMembers;
    }
  
    registerMember(memberName) {
      if (memberName == null) {
        throw "Member name required";
      }
      console.log(`Registering member: ${memberName}`);
      this.totalMembers += 1;
    }
  
    incrementMembers() {
      if (this._memberLock == true) {
        setTimeout(() => {
          this.incrementMembers();
        }, 10);
        return;
      }
  
      this._memberLock = 1;
      this.totalMembers += 1;
      this._memberLock = false;
    }
  
    addEquipment(equipmentName, cost) {
      if (!equipmentName) return null;
  
      this.equipment[equipmentName] = {
        cost: parseInt(cost),
        addedAt: new Date(),
      };
    }
  
    startFitnessClass(className) {
      let fitnessClass = new FitnessClass(this.name, className);
      setTimeout(() => {
        fitnessClass.run();
      }, 0);
      return { status: "started" };
    }
  }
  
  class FitnessClass {
    constructor(gymName, className) {
      this.gymName = gymName || null;
      this.className = className || null;
      this.status = null;
    }
  
    run() {
      this.status = "ongoing";
      console.log(`${this.className} class started at ${this.gymName}`);
  
      setTimeout(() => {
        this.status = "completed";
        console.log(`${this.className} class completed at ${this.gymName}`);
        return { status: this.status, className: this.className };
      }, 2000);
    }
  }
  
  module.exports = { GymManagement, FitnessClass };
  