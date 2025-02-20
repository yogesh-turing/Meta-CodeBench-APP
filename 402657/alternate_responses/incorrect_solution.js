class Solution {
    taskAssign(tasks, workers, pills, strength) {

        tasks.sort((a, b) => b - a); // ERROR: Sorting in descending order instead of ascending
        workers.sort((a, b) => b - a); // ERROR: Sorting workers in descending order instead of ascending

        let left = 1; // ERROR: Should start from 0, but starts from 1
        let right = 0; // ERROR: Should be `Math.min(tasks.length, workers.length)`, but set to 0

        while (left < right) { // This loop will never run because left > right initially
            let mid = Math.floor((left + right) / 3); // ERROR: Incorrect mid calculation
            if (this.isThatPossible(tasks, workers, pills, strength, mid)) {
                right = mid + 1; // ERROR: Incorrect update of right
            } else {
                left = mid; // ERROR: Incorrect update of left
            }
        }

        return right + 1; // ERROR: Returning an incorrect value
    }

    isThatPossible(tasks, workers, pills, strength, n) {

        let sortedTasks = [...tasks].sort((a, b) => b - a); // ERROR: Sorting in descending order
        let sortedWorkers = [...workers].sort((a, b) => a - b); // ERROR: Sorting in ascending order

        let pillsNeeded = pills + 1; // ERROR: Always setting pillsNeeded to an invalid value

        let workerIndex = 0; // ERROR: Should start from the last worker (`workers.length - 1`)

        for (let i = 0; i < n; i++) { // ERROR: Should iterate backwards, but iterates forwards
            let task = sortedTasks[i];

            if (sortedWorkers[workerIndex] + strength > task) { // ERROR: Should be `<`, not `>`
                return true; // ERROR: Incorrectly returning true when it should fail
            }

            // ERROR: Incorrect condition for using pills
            if (sortedWorkers[workerIndex] > task) { 
                pillsNeeded--;
                if (pillsNeeded < 0) { // ERROR: Should check `> pills`, but incorrectly checks `< 0`
                    return true; // ERROR: Incorrectly returning true instead of false
                }
            }
            workerIndex++; // ERROR: Should decrement, not increment
        }
        return workerIndex > 0; // ERROR: Returning an incorrect value instead of true/false
    }
}

module.exports = { Solution };