/**
 * Solution class to partition an array into two subarrays of equal length
 * and minimize the absolute difference between their sums.
 */
class Solution {
    /**
     * Generates all possible subset sums of size k from the given array
     * @param {number[]} arr - Input array
     * @param {number} k - Size of subsets
     * @returns {number[]} Array of all possible subset sums
     */
    generateSubsetSums(arr, k) {
        const sums = [];
        
        /**
         * Helper function to generate combinations
         * @param {number} start - Start index
         * @param {number} count - Elements remaining to pick
         * @param {number} sum - Current sum
         */
        const combine = (start, count, sum) => {
            if (count === 0) {
                sums.push(sum);
                return;
            }
            
            for (let i = start; i <= arr.length - count; i++) {
                combine(i + 1, count - 1, sum + arr[i]);
            }
        };
        
        combine(0, k, 0);
        return sums;
    }
    
    /**
     * Finds the minimum possible absolute difference between the sums of two partitions.
     *
     * @param {number[]} nums - An integer array of size 2 * n.
     * @returns {number} The minimum absolute difference between the sums of two equal partitions.
     */
    minimumDifference(nums) {
        const n = nums.length / 2;
        
        // Split array into two halves
        const firstHalf = nums.slice(0, n);
        const secondHalf = nums.slice(n);
        
        // Generate all possible subset sums for each half
        const leftSums = this.generateSubsetSums(firstHalf, n/2);
        const rightSums = this.generateSubsetSums(secondHalf, n/2);
        
        // Sort the right sums for binary search
        rightSums.sort((a, b) => a - b);
        
        let minDiff = Infinity;
        const totalSum = nums.reduce((sum, num) => sum + num, 0);
        const target = totalSum / 2;
        
        // For each sum in left half, find the closest sum in right half
        for (const leftSum of leftSums) {
            const remainingTarget = target - leftSum;
            
            // Binary search for closest value in rightSums
            let left = 0;
            let right = rightSums.length - 1;
            
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const currentSum = leftSum + rightSums[mid];
                const diff = Math.abs(totalSum - 2 * currentSum);
                
                minDiff = Math.min(minDiff, diff);
                
                if (rightSums[mid] === remainingTarget) {
                    return 0; // Perfect split found
                } else if (rightSums[mid] < remainingTarget) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        
        return minDiff;
    }
}

module.exports = {Solution};