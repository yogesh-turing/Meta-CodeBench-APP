class Solution {
    taskAssign(tasks, workers, pills, strength) {
        // Sort arrays in ascending order
        tasks.sort((a, b) => a - b);
        workers.sort((a, b) => a - b);
        
        // Binary search for maximum possible tasks
        let left = 0;
        let right = Math.min(tasks.length, workers.length);
        let result = 0;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (this.isThatPossible(tasks, workers, pills, strength, mid)) {
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }

    isThatPossible(tasks, workers, pills, strength, n) {
        if (n === 0) return true;
        if (n > tasks.length || n > workers.length) return false;
        
        // Create copies to avoid modifying original arrays
        const tasksCopy = tasks.slice(0, n);
        const workersCopy = workers.slice(workers.length - n);
        
        // Try to match workers with tasks using pills optimally
        let pillsLeft = pills;
        let taskIndex = n - 1;  // Start from hardest task
        let workerIndex = n - 1;  // Start from strongest worker
        
        while (taskIndex >= 0 && workerIndex >= 0) {
            if (workersCopy[workerIndex] >= tasksCopy[taskIndex]) {
                // Worker can handle task without pill
                taskIndex--;
                workerIndex--;
            } else if (pillsLeft > 0 && workersCopy[workerIndex] + strength >= tasksCopy[taskIndex]) {
                // Worker can handle task with pill
                pillsLeft--;
                taskIndex--;
                workerIndex--;
            } else {
                // Current worker can't handle task even with pill
                return false;
            }
        }
        
        return taskIndex < 0;  // All tasks assigned successfully
    }
}

module.exports = {Solution};