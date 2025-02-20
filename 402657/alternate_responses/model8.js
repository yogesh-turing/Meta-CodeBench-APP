class Solution {
    taskAssign(tasks, workers, pills, strength) {
        tasks.sort((a, b) => b - a);
        workers.sort((a, b) => b - a);
        let low = 0, high = tasks.length;
        while (low < high) {
            let mid = Math.floor((low + high + 1) / 2);
            if (this.isThatPossible(tasks, workers, pills, strength, mid)) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }
        return low;
    }

    isThatPossible(tasks, workers, pills, strength, n) {
        let taskIndex = 0, workerIndex = 0;
        while (taskIndex < n) {
            if (workers[workerIndex] >= tasks[taskIndex]) {
                workerIndex++;
                taskIndex++;
            } else if (pills > 0 && workers[workerIndex] + strength >= tasks[taskIndex]) {
                pills--;
                workerIndex++;
                taskIndex++;
            } else {
                return false;
            }
        }
        return true;
    }
}

module.exports = {Solution};