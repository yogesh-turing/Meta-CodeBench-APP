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
        const firstSums = this.generateSubsetSums(firstHalf, n/2);
        const secondSums = this.generateSubsetSums(secondHalf, n/2);
        
        // Sort second sums for binary search
        secondSums.sort((a, b) => a - b);
        
        let minDiff = Infinity;
        const totalSum = nums.reduce((sum, num) => sum + num, 0);
        
        // For each sum in first half, find the closest matching sum in second half
        for (const sum1 of firstSums) {
            const target = (totalSum / 2) - sum1;
            const sum2 = this.findClosestSum(secondSums, target);
            
            const currentDiff = Math.abs((sum1 + sum2) - (totalSum - sum1 - sum2));
            minDiff = Math.min(minDiff, currentDiff);
        }
        
        return minDiff;
    }
    
    /**
     * Generates all possible subset sums for given size
     * @param {number[]} arr - Input array
     * @param {number} targetSize - Target subset size
     * @returns {number[]} Array of possible subset sums
     */
    generateSubsetSums(arr, targetSize) {
        const sums = new Set();
        const n = arr.length;
        
        // Generate all possible combinations using bit manipulation
        for (let mask = 0; mask < (1 << n); mask++) {
            if (this.countBits(mask) === targetSize) {
                let sum = 0;
                for (let i = 0; i < n; i++) {
                    if (mask & (1 << i)) {
                        sum += arr[i];
                    }
                }
                sums.add(sum);
            }
        }
        
        return Array.from(sums);
    }
    
    /**
     * Counts number of set bits in a number
     * @param {number} num - Input number
     * @returns {number} Count of set bits
     */
    countBits(num) {
        let count = 0;
        while (num) {
            count += num & 1;
            num >>= 1;
        }
        return count;
    }
    
    /**
     * Finds closest sum to target using binary search
     * @param {number[]} sums - Sorted array of sums
     * @param {number} target - Target sum
     * @returns {number} Closest sum to target
     */
    findClosestSum(sums, target) {
        let left = 0;
        let right = sums.length - 1;
        
        if (target <= sums[0]) return sums[0];
        if (target >= sums[right]) return sums[right];
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            if (sums[mid] === target) return sums[mid];
            
            if (target < sums[mid]) {
                if (mid > 0 && target > sums[mid - 1]) {
                    return Math.abs(sums[mid] - target) < Math.abs(sums[mid - 1] - target) 
                        ? sums[mid] 
                        : sums[mid - 1];
                }
                right = mid;
            } else {
                if (mid < sums.length - 1 && target < sums[mid + 1]) {
                    return Math.abs(sums[mid] - target) < Math.abs(sums[mid + 1] - target)
                        ? sums[mid]
                        : sums[mid + 1];
                }
                left = mid + 1;
            }
        }
        
        return sums[left];
    }
}

module.exports = {Solution};