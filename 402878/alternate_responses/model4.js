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
        
        // Split array into two halves
        const firstHalf = nums.slice(0, n);
        const secondHalf = nums.slice(n);
        
        // Generate all possible subset sums for each half
        const leftSums = this.generateSubsetSums(firstHalf);
        const rightSums = this.generateSubsetSums(secondHalf);
        
        let minDiff = Infinity;
        
        // For each possible sum in left half, find closest matching sum in right half
        for (const [count, leftSum] of leftSums) {
            const target = n - count;
            const rightSumsForTarget = rightSums.get(target);
            
            if (rightSumsForTarget) {
                // Binary search for closest sum
                const closestSum = this.findClosestSum(rightSumsForTarget, -leftSum);
                minDiff = Math.min(minDiff, Math.abs(leftSum + closestSum));
            }
        }
        
        return minDiff;
    }
    
    /**
     * Generates all possible subset sums for an array.
     * @param {number[]} arr - Input array
     * @returns {Map<number, number[]>} Map of count to sorted sums
     */
    generateSubsetSums(arr) {
        const sums = new Map();
        const n = arr.length;
        
        // Generate all possible combinations
        for (let mask = 0; mask < (1 << n); mask++) {
            let sum = 0;
            let count = 0;
            
            for (let i = 0; i < n; i++) {
                if (mask & (1 << i)) {
                    sum += arr[i];
                    count++;
                }
            }
            
            if (!sums.has(count)) {
                sums.set(count, []);
            }
            sums.get(count).push(sum);
        }
        
        // Sort sums for each count
        for (const sumsArray of sums.values()) {
            sumsArray.sort((a, b) => a - b);
        }
        
        return sums;
    }
    
    /**
     * Finds the closest sum to target in a sorted array.
     * @param {number[]} arr - Sorted array of sums
     * @param {number} target - Target sum
     * @returns {number} Closest sum to target
     */
    findClosestSum(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        
        if (target <= arr[0]) return arr[0];
        if (target >= arr[right]) return arr[right];
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (arr[mid] === target) return arr[mid];
            
            if (target < arr[mid]) {
                if (mid > 0 && target > arr[mid - 1]) {
                    return Math.abs(arr[mid] - target) < Math.abs(arr[mid - 1] - target) 
                        ? arr[mid] 
                        : arr[mid - 1];
                }
                right = mid - 1;
            } else {
                if (mid < arr.length - 1 && target < arr[mid + 1]) {
                    return Math.abs(arr[mid] - target) < Math.abs(arr[mid + 1] - target) 
                        ? arr[mid] 
                        : arr[mid + 1];
                }
                left = mid + 1;
            }
        }
        
        return arr[left];
    }
}

module.exports = {Solution};