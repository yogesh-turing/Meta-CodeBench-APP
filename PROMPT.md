Base Code:
```javascript
function GymManagement(name) {
    this.gymName = name;
    this.totalMembers = 0;

    this.manageWorkout = function (workoutName, isIntense, trainerName) {
        var workouts = new Array(3); // Fixed size
        var workoutCount = 0;

        workouts[workoutCount] = workoutName; // Assign workout
        workoutCount++; // Increment count

        console.log(trainerName + " designed the workout: " + workoutName);
        if (isIntense) {
            console.log("Warning: Intense workout ahead!");
        }

        this.totalMembers++; // Increment members
        console.log("Total registered members: " + this.totalMembers);
    };

    this.registerMember = function (memberName) {
        if (memberName == null || memberName == undefined) {
            console.log("Error: Member name is missing.");
        } else {
            console.log("Registering member: " + memberName);
            this.totalMembers++;
        }
    };

    this.startFitnessClass = function () {
        var fitnessClass = new FitnessClass();
        var fitnessThread = setTimeout(function () {
            fitnessClass.run();
        }, 0);
    };
}

GymManagement.addEquipment = function (equipmentName, cost) {
    var equipmentList = new Array(2); // Fixed size
    var equipmentCost = new Array(2); // Fixed size
    var equipmentCount = 0;

    equipmentList[equipmentCount] = equipmentName;
    equipmentCost[equipmentCount] = cost;
    equipmentCount++;
};

function FitnessClass() {
    this.status = null;

    this.run = function () {
        var that = this;
        this.status = "ongoing";
        console.log("Fitness class started.");
        setTimeout(function () {
            that.status = "completed";
            console.log("Fitness class completed.");
        }, 2000);
    };
}

module.exports = { GymManagement, FitnessClass };
```

Prompt:

Refactor and implement a GymManagement and FitnessClass system in JavaScript using ES6 classes, ensuring modularity, proper validation, and error handling.

Requirements:
GymManagement:
-Require name in the constructor; throw an error if missing.
-Maintain workouts and equipment as Maps to track details like trainer, intensity, and cost.
-Implement manageWorkout(workoutName, isIntense, trainerName) to log and add workouts, ensuring proper input validation.
-Provide registerMember(memberName) to safely increment totalMembers using asynchronous locking.
-Implement addEquipment(equipmentName, cost) to validate and store equipment details.

FitnessClass:
-Require gymName and className in the constructor; ensure they are mandatory and validated.
-Implement an asynchronous run() method to simulate class execution, transitioning between "ongoing" and "completed" statuses with a 2-second delay.

General:
-Refactor with best practices, improving maintainability and readability.
-Ensure robust validation, descriptive variables, and asynchronous patterns.
-Avoid unsafe practices and align the implementation with the provided Ideal Response.