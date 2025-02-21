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
        const leftSums = this.getSortedSums(nums.slice(0, n));
        const rightSums = this.getSortedSums(nums.slice(n));
        
        let minDiff = Infinity;
        for (let i = 0; i < leftSums.length; i++) {
            const closestIndex = this.binarySearch(rightSums, leftSums[i]);
            if (closestIndex !== -1) {
                minDiff = Math.min(minDiff, Math.abs(leftSums[i] - rightSums[closestIndex]));
            }
        }
        
        return minDiff;
    }
    
    /**
     * Generates all possible subset sums for a given array and returns them in sorted order.
     *
     * @param {number[]} nums - The input array.
     * @returns {number[]} A sorted array of subset sums.
     */
    getSortedSums(nums) {
        const sums = [];
        const n = nums.length;
        
        // Generate all possible subset sums using bit manipulation
        for (let i = 0; i < (1 << n); i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if ((i & (1 << j)) !== 0) {
                    sum += nums[j];
                }
            }
            sums.push(sum);
        }
        
        // Sort the subset sums in ascending order
        sums.sort((a, b) => a - b);
        
        return sums;
    }
    
    /**
     * Performs a binary search in a sorted array to find the closest element to a target value.
     *
     * @param {number[]} arr - The sorted array.
     * @param {number} target - The target value.
     * @returns {number} The index of the closest element, or -1 if not found.
     */
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
        
        // If the target is not found, return the index of the closest element
        if (Math.abs(arr[left] - target) < Math.abs(arr[right] - target)) {
            return left;
        } else {
            return right;
        }
    }
}

// Export the Solution class
module.exports = {Solution};