class Solution {
    taskAssign(tasks, workers, pills, strength) {
        // Binary search for maximum possible tasks
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
        if (n === 0) return true;
        if (n > tasks.length || n > workers.length) return false;

        // Sort tasks in ascending order and take n easiest tasks
        const sortedTasks = [...tasks].sort((a, b) => a - b).slice(0, n);
        // Sort workers in descending order for optimal pill usage
        const sortedWorkers = [...workers].sort((a, b) => b - a).slice(0, n);
        
        let pillsLeft = pills;
        let taskIndex = n - 1;  // Start with hardest task
        
        for (let i = 0; i < n; i++) {
            if (sortedWorkers[i] >= sortedTasks[taskIndex]) {
                // Worker can handle task without pill
                taskIndex--;
            } else if (pillsLeft > 0 && (sortedWorkers[i] + strength) >= sortedTasks[taskIndex]) {
                // Worker can handle task with pill
                pillsLeft--;
                taskIndex--;
            } else {
                return false;  // Cannot assign this task
            }
        }
        
        return true;
    }
}

module.exports = {Solution};