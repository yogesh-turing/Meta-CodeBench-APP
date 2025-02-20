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
        let pillsUsed = 0;
        
        while (taskIndex < n && workerIndex < workers.length) {
            if (workers[workerIndex] >= tasks[taskIndex]) {
                taskIndex++;
                workerIndex++;
            } else if (pillsUsed < pills && workers[workerIndex] + strength >= tasks[taskIndex]) {
                pillsUsed++;
                taskIndex++;
                workerIndex++;
            } else {
                workerIndex++;
            }
        }
        return taskIndex == n;
    }
}
module.exports = {Solution};