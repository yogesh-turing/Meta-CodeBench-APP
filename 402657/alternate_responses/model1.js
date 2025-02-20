class Solution {
    taskAssign(tasks, workers, pills, strength) {
        let left = 0;
        let right = Math.min(tasks.length, workers.length);
        
        while (left < right) {
            const mid = Math.ceil((left + right) / 2);
            if (this.isThatPossible(tasks, workers, pills, strength, mid)) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }
        
        return this.isThatPossible(tasks, workers, pills, strength, left) ? left : 0;
    }

    isThatPossible(tasks, workers, pills, strength, n) {
        // Sort tasks and workers in ascending order
        const sortedTasks = tasks.slice(0, n).sort((a, b) => a - b);
        const sortedWorkers = workers.slice().sort((a, b) => a - b);
        
        if (n > sortedWorkers.length) return false;
        
        let pillsUsed = 0;
        let workerIndex = sortedWorkers.length - 1;
        
        // Try to assign tasks from hardest to easiest
        for (let i = n - 1; i >= 0; i--) {
            const task = sortedTasks[i];
            
            // If strongest worker can handle task without pill
            if (sortedWorkers[workerIndex] >= task) {
                workerIndex--;
                continue;
            }
            
            // Check if we can use a pill
            if (pills > pillsUsed && 
                sortedWorkers[workerIndex] + strength >= task) {
                pillsUsed++;
                workerIndex--;
                continue;
            }
            
            // If we can't assign this task, return false
            return false;
        }
        
        return true;
    }
}

module.exports = {Solution};