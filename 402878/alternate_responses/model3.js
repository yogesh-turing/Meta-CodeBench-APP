/**
 * Solution class to partition an array into two subarrays of equal length
 * and minimize the absolute difference between their sums.
 */
class Solution {
    
    /**
     * Finds the minimum possible absolute difference between the sums of two partitions.
     *
     * @param {number[]} nums - An integer array of size 2 * n.
     * @returns {number} The minimum absolute difference between the sums of two equal partitions.
     */
    minimumDifference(nums) {
        const n = nums.length / 2;
        
        // Generate subset sums for first and second half
        const leftSums = this.generateSubsetSums(nums.slice(0, n), n/2);
        const rightSums = this.generateSubsetSums(nums.slice(n), n/2);
        
        // Sort right sums for binary search
        rightSums.sort((a, b) => a - b);
        
        let minDiff = Infinity;
        const totalSum = nums.reduce((sum, num) => sum + num, 0);
        
        // For each sum in left half, find the closest sum in right half
        for (const leftSum of leftSums) {
            const target = totalSum/2 - leftSum;
            const rightSum = this.findClosestSum(rightSums, target);
            
            if (rightSum !== null) {
                minDiff = Math.min(minDiff, Math.abs(totalSum - 2 * (leftSum + rightSum)));
            }
        }
        
        return minDiff;
    }
    
    /**
     * Generates all possible subset sums with the given target size.
     *
     * @param {number[]} nums - Array to generate subset sums from
     * @param {number} targetSize - Required size of subsets
     * @returns {number[]} Array of all possible subset sums
     */
    generateSubsetSums(nums, targetSize) {
        const sums = new Set();
        
        const generate = (index, count, sum) => {
            if (count === targetSize) {
                sums.add(sum);
                return;
            }
            if (index >= nums.length) return;
            
            // Include current number
            generate(index + 1, count + 1, sum + nums[index]);
            // Exclude current number
            generate(index + 1, count, sum);
        };
        
        generate(0, 0, 0);
        return Array.from(sums);
    }
    
    /**
     * Finds the closest sum to the target value using binary search.
     *
     * @param {number[]} sums - Sorted array of sums
     * @param {number} target - Target value to find
     * @returns {number|null} Closest sum to target or null if array is empty
     */
    findClosestSum(sums, target) {
        if (sums.length === 0) return null;
        
        let left = 0;
        let right = sums.length - 1;
        
        while (left + 1 < right) {
            const mid = Math.floor((left + right) / 2);
            if (sums[mid] === target) return sums[mid];
            if (sums[mid] < target) {
                left = mid;
            } else {
                right = mid;
            }
        }
        
        // Return the closest sum to target
        if (Math.abs(sums[left] - target) <= Math.abs(sums[right] - target)) {
            return sums[left];
        }
        return sums[right];
    }
}

module.exports = {Solution};