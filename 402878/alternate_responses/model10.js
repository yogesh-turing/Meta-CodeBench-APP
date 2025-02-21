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
        // Calculate the total sum of the array
        const totalSum = nums.reduce((a, b) => a + b, 0);
        
        // Calculate the target sum for each partition
        const targetSum = Math.floor(totalSum / 2);
        
        // Initialize a set to store the subset sums for the first half of the array
        const subsetSums = new Set();
        
        // Compute all possible subset sums for the first half of the array
        for (let i = 0; i < nums.length / 2; i++) {
            // Initialize a temporary set to store the new subset sums
            const temp = new Set();
            
            // Add the current number to each subset sum in the set
            for (const sum of subsetSums) {
                temp.add(sum + nums[i]);
            }
            
            // Add the current number as a new subset sum
            temp.add(nums[i]);
            
            // Update the subset sums set
            subsetSums.clear();
            for (const sum of temp) {
                subsetSums.add(sum);
            }
        }
        
        // Initialize the minimum difference
        let minDiff = Infinity;
        
        // Compute all possible subset sums for the second half of the array
        for (let i = nums.length / 2; i < nums.length; i++) {
            // Initialize a temporary set to store the new subset sums
            const temp = new Set();
            
            // Add the current number to each subset sum in the set
            for (const sum of subsetSums) {
                temp.add(sum + nums[i]);
            }
            
            // Add the current number as a new subset sum
            temp.add(nums[i]);
            
            // Update the subset sums set
            subsetSums.clear();
            for (const sum of temp) {
                subsetSums.add(sum);
            }
            
            // Use binary search to find the closest subset sum to the target sum
            for (const sum of subsetSums) {
                // Calculate the difference between the current subset sum and the target sum
                const diff = Math.abs(targetSum - sum);
                
                // Update the minimum difference
                minDiff = Math.min(minDiff, diff);
            }
        }
        
        // Return the minimum difference
        return minDiff;
    }
}

// Export the Solution class
module.exports = {Solution};