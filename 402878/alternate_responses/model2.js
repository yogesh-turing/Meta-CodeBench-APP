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
        
        // Generate all possible subset sums for both halves
        const getSubsetSums = (arr, size) => {
            const sums = new Map();
            
            // Generate all possible combinations using bit manipulation
            for (let mask = 0; mask < (1 << arr.length); mask++) {
                let sum = 0;
                let count = 0;
                
                for (let i = 0; i < arr.length; i++) {
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
            for (const [count, sumArray] of sums) {
                sumArray.sort((a, b) => a - b);
            }
            
            return sums;
        };
        
        const firstSums = getSubsetSums(firstHalf, n);
        const secondSums = getSubsetSums(secondHalf, n);
        
        let minDiff = Infinity;
        
        // For each count in first half
        for (const [count1, sums1] of firstSums) {
            const count2 = n - count1;
            
            if (!secondSums.has(count2)) continue;
            
            const sums2 = secondSums.get(count2);
            
            // For each sum in first half's subset
            for (const sum1 of sums1) {
                // Binary search for closest sum in second half
                const targetSum = sum1;
                
                let left = 0;
                let right = sums2.length - 1;
                
                while (left <= right) {
                    const mid = Math.floor((left + right) / 2);
                    const currentDiff = Math.abs(targetSum - sums2[mid]);
                    minDiff = Math.min(minDiff, currentDiff);
                    
                    if (sums2[mid] < targetSum) {
                        left = mid + 1;
                    } else {
                        right = mid - 1;
                    }
                }
            }
        }
        
        return minDiff;
    }
}

// Export the Solution class
module.exports = {Solution};