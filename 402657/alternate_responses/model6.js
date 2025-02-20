class Solution {
    taskAssign(tasks, workers, pills, strength) {
        // Sort the tasks and workers in descending order
        tasks.sort((a, b) => b - a);
        workers.sort((a, b) => b - a);

        let low = 0;
        let high = Math.min(tasks.length, workers.length);

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (this.isThatPossible(tasks, workers, pills, strength, mid)) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return high;
    }

    isThatPossible(tasks, workers, pills, strength, n) {
        let usedPills = 0;
        let workerIndex = 0;

        for (let i = 0; i < n; i++) {
            // If the worker can complete the task without a pill, move to the next worker
            if (workers[workerIndex] >= tasks[i]) {
                workerIndex++;
            }
            // If the worker can complete the task with a pill, use a pill and move to the next worker
            else if (usedPills < pills && workers[workerIndex] + strength >= tasks[i]) {
                usedPills++;
                workerIndex++;
            }
            // If the worker cannot complete the task even with a pill, return false
            else {
                return false;
            }
        }

        return true;
    }
}
module.exports = { Solution };