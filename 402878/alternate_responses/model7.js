class Solution {
    minimumDifference(nums) {
        const n = nums.length / 2;
        const leftSums = this.getSortedSums(nums.slice(0, n));
        const rightSums = this.getSortedSums(nums.slice(n));
        let minDiff = Infinity;

        for (let i = 0; i < leftSums.length; i++) {
            const leftSum = leftSums[i];
            const targetSum = (nums.reduce((a, b) => a + b, 0) - leftSum) / 2;
            const closestIndex = this.binarySearch(rightSums, targetSum);
            const closestSum = rightSums[closestIndex];

            minDiff = Math.min(minDiff, Math.abs(leftSum - closestSum));
        }

        return minDiff;
    }

    getSortedSums(nums) {
        const sums = new Set();
        sums.add(0);

        for (let i = 0; i < nums.length; i++) {
            const num = nums[i];
            const newSums = new Set();

            for (let sum of sums) {
                newSums.add(sum + num);
            }

            for (let newSum of newSums) {
                sums.add(newSum);
            }
        }

        return Array.from(sums).sort((a, b) => a - b);
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

        return left;
    }
}

module.exports = {Solution};