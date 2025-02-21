const { Solution } = require('./solution.js');
describe('Solution', () => {
    test.each([
        { nums: [3, 9, 7, 3], expected: 2 },
        { nums: [2, -1, 0, 4, -2, -9], expected: 0 },
        { nums: [1, 2], expected: 1 },
        { nums: [5, 5, 5, 5], expected: 0 },
        { nums: [1000000, -1000000, 500000, -500000], expected: 0 },
        { nums: [-36, 36], expected: 72 },
        { nums: [1, 2, 3, 4, 5, 6], expected: 1 }, // Test with a sequence of consecutive numbers
        { nums: [10, 20, 30, 40, 50, 60], expected: 10 }, // Test with larger numbers
        { nums: [1, 1, 1, 1, 1, 1], expected: 0 }, // Test with all elements being the same
        { nums: [1, 2, 3, 4, 5, 6, 7, 8], expected: 0 }, // Test with an even number of elements
        { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], expected: 0 }, // Test with a larger even number of elements
        { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], expected: 0 } // Test with a larger even number of elements
    ])('minimumDifference($nums) returns $expected', ({ nums, expected }) => {
        const solution = new Solution();
        expect(solution.minimumDifference(nums)).toBe(expected);
    });
});
