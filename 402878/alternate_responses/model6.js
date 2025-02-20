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
        const totalSum = nums.reduce((sum, num) => sum + num, 0);
        
        // Calculate the target sum for each partition
        const targetSum = Math.floor(totalSum / 2);
        
        // Initialize variables to store the closest subset sum and its difference
        let closestSum = Infinity;
        let minDiff = Infinity;
        
        // Generate all possible subset sums for the first half of the array
        const subsetSums = this.generateSubsetSums(nums.slice(0, nums.length / 2));
        
        // Iterate over the subset sums in descending order
        for (let i = subsetSums.length - 1; i >= 0; i--) {
            // Use binary search to find the closest subset sum in the second half
            const closestSumInSecondHalf = this.binarySearch(subsetSums, targetSum - subsetSums[i]);
            
            // Calculate the absolute difference between the current subset sum and the closest sum in the second half
            const diff = Math.abs(subsetSums[i] - closestSumInSecondHalf);
            
            // Update the minimum difference and the closest subset sum if a smaller difference is found
            if (diff < minDiff) {
                minDiff = diff;
                closestSum = subsetSums[i];
            }
        }
        
        // Return the minimum absolute difference between the sums of the two partitions
        return minDiff;
    }
    
    /**
     * Generates all possible subset sums for a given array.
     *
     * @param {number[]} nums - An integer array.
     * @returns {number[]} An array of subset sums.
     */
    generateSubsetSums(nums) {
        const subsetSums = [0];
        
        // Iterate over the array and generate subset sums
        for (let i = 0; i < nums.length; i++) {
            const currentNum = nums[i];
            const newSubsetSums = [];
            
            // Generate new subset sums by adding the current number to existing subset sums
            for (let j = 0; j < subsetSums.length; j++) {
                newSubsetSums.push(subsetSums[j] + currentNum);
            }
            
            // Merge the new subset sums with the existing subset sums
            subsetSums.push(...newSubsetSums);
        }
        
        // Sort the subset sums in ascending order
        subsetSums.sort((a, b) => a - b);
        
        return subsetSums;
    }
    
    /**
     * Performs a binary search to find the closest value in a sorted array.
     *
     * @param {number[]} arr - A sorted array.
     * @param {number} target - The target value.
     * @returns {number} The closest value in the array.
     */
    binarySearch(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            // If the target value is found, return it
            if (arr[mid] === target) {
                return arr[mid];
            }
            
            // If the target value is less than the middle element, search in the left half
            if (target < arr[mid]) {
                right = mid - 1;
            }
            
            // If the target value is greater than the middle element, search in the right half
            else {
                left = mid + 1;
            }
        }
        
        // If the target value is not found, return the closest value
        if (Math.abs(arr[left] - target) < Math.abs(arr[right] - target)) {
            return arr[left];
        } else {
            return arr[right];
        }
    }
}

// Export the Solution class
module.exports = {Solution};