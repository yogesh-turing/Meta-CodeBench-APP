class Solution {
    taskAssign(tasks, workers, pills, strength) {
        tasks.sort((a, b) => a - b);
        workers.sort((a, b) => a - b);
        
        let low = 0;
        let high = tasks.length;
        let maxTasks = 0;
        
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (this.isThatPossible(tasks, workers, pills, strength, mid)) {
                maxTasks = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return maxTasks;
    }

    isThatPossible(tasks, workers, pills, strength, n) {
        let taskIndex = n - 1;
        let workerIndex = workers.length - 1;
        let pillsUsed = 0;
        
        while (taskIndex >= 0 && workerIndex >= 0) {
            if (workers[workerIndex] >= tasks[taskIndex]) {
                taskIndex--;
                workerIndex--;
            } else if (pillsUsed < pills && workers[workerIndex] + strength >= tasks[taskIndex]) {
                pillsUsed++;
                taskIndex--;
                workerIndex--;
            } else {
                workerIndex--;
            }
        }
        
        return taskIndex < 0;
    }
}

module.exports = { Solution };