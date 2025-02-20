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
        if (n === 0) return true;
        
        // Get the n hardest tasks and n strongest workers
        const selectedTasks = tasks.slice(tasks.length - n);
        const selectedWorkers = workers.slice(workers.length - n);
        let remainingPills = pills;
        
        // Try to assign tasks from hardest to easiest
        for (let i = n - 1; i >= 0; i--) {
            if (selectedWorkers[i] >= selectedTasks[i]) {
                continue; // Worker can handle task without pill
            }
            
            // Check if a pill would help
            if (remainingPills > 0 && (selectedWorkers[i] + strength) >= selectedTasks[i]) {
                remainingPills--;
                continue;
            }
            
            return false; // Can't assign this task
        }
        
        return true;
    }
}

module.exports = {Solution};