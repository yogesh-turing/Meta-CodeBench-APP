class Solution {
  taskAssign(tasks, workers, pills, strength) {
    // Handle invalid inputs
    if (!tasks || !workers || !tasks.length || !workers.length || pills < 0 || strength < 0) {
      return 0;
    }

    // Filter out negative values and sort both arrays in ascending order
    tasks = tasks.filter((t) => t > 0).sort((a, b) => a - b);
    workers = workers.filter((w) => w > 0).sort((a, b) => a - b);

    if (!tasks.length || !workers.length) return 0;

    // Binary search on the number of tasks that can be assigned
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

    // Get n hardest tasks and n strongest workers
    const neededTasks = tasks.slice(-n);
    const availableWorkers = workers.slice(-n);

    // Try all possible pill assignments using backtracking
    return this.tryAssignment(neededTasks, availableWorkers, pills, strength, n - 1);
  }

  tryAssignment(tasks, workers, pills, strength, index) {
    // Base case: all tasks assigned
    if (index < 0) return true;

    const task = tasks[index];
    const worker = workers[index];

    // Try without pill first
    if (worker >= task) {
      return this.tryAssignment(tasks, workers, pills, strength, index - 1);
    }

    // Try with pill if available
    if (pills > 0 && worker + strength >= task) {
      return this.tryAssignment(tasks, workers, pills - 1, strength, index - 1);
    }

    // Try matching this task with any stronger available worker
    for (let i = index + 1; i < workers.length; i++) {
      if (workers[i] >= task) {
        // Swap workers and try assignment
        [workers[index], workers[i]] = [workers[i], workers[index]];
        const result = this.tryAssignment(tasks, workers, pills, strength, index - 1);
        [workers[index], workers[i]] = [workers[i], workers[index]]; // backtrack
        if (result) return true;
      }
      // Try with pill for stronger worker
      if (pills > 0 && workers[i] + strength >= task) {
        [workers[index], workers[i]] = [workers[i], workers[index]];
        const result = this.tryAssignment(tasks, workers, pills - 1, strength, index - 1);
        [workers[index], workers[i]] = [workers[i], workers[index]]; // backtrack
        if (result) return true;
      }
    }

    return false;
  }
}

module.exports = { Solution };