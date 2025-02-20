class Solution {
    taskAssign(tasks, workers, pills, strength) {
        tasks.sort((a, b) => a - b);
        workers.sort((a, b) => a - b);
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
        let taskIndex = n - 1, workerIndex = n - 1, pillsUsed = 0;
        while (taskIndex >= 0) {
            if (workers[workerIndex] >= tasks[taskIndex]) {
                taskIndex--;
                workerIndex--;
            } else if (pillsUsed < pills && workers[workerIndex] + strength >= tasks[taskIndex]) {
                pillsUsed++;
                taskIndex--;
                workerIndex--;
            } else {
                return false;
            }
        }
        return true;
    }
}
module.exports = {Solution};