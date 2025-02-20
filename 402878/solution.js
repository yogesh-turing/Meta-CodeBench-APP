class Solution {

  /**
   * Finds the minimum possible absolute difference between the sums of two partitions.
   *
   * @param {number[]} nums - An integer array of size 2 * n.
   * @returns {number} The minimum absolute difference between the sums of two equal partitions.
   */
  minimumDifference(nums) {
      const total = nums.reduce((acc, num) => acc + num, 0); // Calculate the total sum of the array
      const target = total / 2; // Define the target sum for balanced partitioning
      const n = nums.length / 2; // Half the size of the array

      // Lists to store all possible subset sums
      const sums1 = Array.from({ length: n + 1 }, () => []);
      const sums2 = Array.from({ length: n + 1 }, () => []);

      const subsets = 1 << n; // Total number of subsets for half the array
      for (let mask = 0; mask < subsets; mask++) {
          let count = 0, sum1 = 0, sum2 = 0;

          // Generate subset sums for first and second halves of the array
          for (let bit = 0; bit < n; bit++) {
              if ((mask & (1 << bit)) !== 0) {
                  sum1 += nums[bit];
                  sum2 += nums[n + bit];
                  count++;
              }
          }
          sums1[count].push(sum1);
          sums2[count].push(sum2);
      }

      // Sort sums2 lists for binary search optimization
      for (let i = 0; i <= n; i++) {
          sums2[i].sort((a, b) => a - b);
      }

      let minDiff = Number.MAX_VALUE;

      // Find the minimum absolute difference between partition sums
      for (let i = 0; i <= n; i++) {
          const j = n - i;
          for (const s1 of sums1[i]) {
              const req = target - s1;
              const s2List = sums2[j];
              let closest = s2List[s2List.length - 1];

              // Perform binary search to find the closest match in sums2
              let index = binarySearch(s2List, req);
              if (index < 0) index = -index - 1;
              if (index < s2List.length) closest = s2List[index];

              // Update minimum difference
              minDiff = Math.min(minDiff, Math.abs(total - 2 * (s1 + closest)));
          }
      }

      return minDiff;
  }
}

// Binary search function
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
  }
  return -(left + 1);
}

// Export the Solution class
module.exports = {Solution};