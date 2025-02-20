class Solution {
    taskAssign(tasks, workers, pills, strength) {
        // Sort tasks and workers in ascending order
        tasks.sort((a, b) => a - b);
        workers.sort((a, b) => a - b);
        
        // Binary search for the maximum number of tasks
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
        // Create copies of arrays to avoid modifying originals
        const sortedTasks = tasks.slice(0, n).sort((a, b) => a - b);
        const sortedWorkers = workers.slice().sort((a, b) => a - b);
        let remainingPills = pills;
        
        // Try to assign n tasks starting from the easiest ones
        for (let i = n - 1; i >= 0; i--) {
            const task = sortedTasks[i];
            const worker = sortedWorkers[sortedWorkers.length - 1];
            
            if (worker >= task) {
                // Worker can handle task without pill
                sortedWorkers.pop();
            } else if (worker + strength >= task && remainingPills > 0) {
                // Worker can handle task with pill
                sortedWorkers.pop();
                remainingPills--;
            } else {
                return false;
            }
        }
        
        return true;
    }
}

module.exports = {Solution};