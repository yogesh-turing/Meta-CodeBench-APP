class Solution {
  minimumDifference(nums) {
      const n = nums.length / 2;

      // Split array into two halves
      const firstHalf = nums.slice(0, n);
      const secondHalf = nums.slice(n);

      // Calculate total sum for reference
      const totalSum = nums.reduce((acc, num) => acc + num, 0);

      // Generate all possible subset sums for both halves
      const leftSums = this.generateSubsetSums(firstHalf, n);
      const rightSums = this.generateSubsetSums(secondHalf, n);

      // Sort the right sums for binary search
      rightSums.sort((a, b) => a - b);

      let minDiff = Number.MAX_SAFE_INTEGER;
      const target = totalSum / 2;

      // For each sum in left half, find the closest complement in right half
      for (const leftSum of leftSums) {
          const complement = target - leftSum;

          // Binary search for closest value to complement
          let idx = this.binarySearch(rightSums, complement);
          if (idx < 0) {
              idx = -idx - 1;
          }

          // Check closest values
          if (idx < rightSums.length) {
              const currentDiff = Math.abs(
                  leftSum + rightSums[idx] - (totalSum - leftSum - rightSums[idx])
              );
              minDiff = Math.min(minDiff, currentDiff);
          }
          if (idx > 0) {
              const currentDiff = Math.abs(
                  leftSum + rightSums[idx - 1] - (totalSum - leftSum - rightSums[idx - 1])
              );
              minDiff = Math.min(minDiff, currentDiff);
          }
      }

      return minDiff;
  }

  generateSubsetSums(nums, n) {
      const sums = [];
      const len = nums.length;

      // Generate all possible combinations using bit manipulation
      for (let mask = 0; mask < 1 << len; mask++) {
          if (this.bitCount(mask) === len / 2) {
              let sum = 0;
              for (let i = 0; i < len; i++) {
                  if ((mask & (1 << i)) !== 0) {
                      sum += nums[i];
                  }
              }
              sums.push(sum);
          }
      }
      return sums;
  }

  bitCount(x) {
      let count = 0;
      while (x !== 0) {
          x &= x - 1;
          count++;
      }
      return count;
  }

  binarySearch(arr, target) {
      let left = 0;
      let right = arr.length - 1;
      while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (arr[mid] === target) {
              return mid;
          } else if (arr[mid] < target) {
              left = mid + 1;
          } else {
              right = mid - 1;
          }
      }
      return -left - 1;
  }
}

module.exports = {Solution};