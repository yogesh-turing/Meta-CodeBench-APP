/**
 * Calculates the minimum number of cohesive groups required for the given sequence.
 * A group is cohesive if it forms a palindrome.
 *
 * @param {string[]} sequence - The array of strings representing the sequence.
 * @return {number} - The minimum number of cohesive groups, or 0 if the sequence is null or empty.
 */
function minCohesiveGroups(sequence) {
    if (!sequence || sequence.length === 0) {
        return 0; // Return 0 for null or empty input
    }

    const n = sequence.length;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0; // Base case: no groups needed for an empty sequence

    // For each position in the sequence
    for (let i = 1; i <= n; i++) {
        // Initialize with the worst case: each task in its own group
        dp[i] = dp[i - 1] + 1;

        // Try to form cohesive groups ending at position i
        for (let j = 0; j < i - 1; j++) {
            if (isCohesive(sequence, j, i - 1)) {
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }

    return dp[n];
}

/**
 * Checks if the subsequence from start to end (inclusive) is cohesive. A cohesive group is a palindrome.
 *
 * @param {string[]} sequence - The array of strings representing the sequence.
 * @param {number} start - The starting index of the subsequence.
 * @param {number} end - The ending index of the subsequence.
 * @return {boolean} - True if the subsequence is cohesive, false otherwise.
 */
function isCohesive(sequence, start, end) {
    while (start < end) {
        if (sequence[start] !== sequence[end]) {
            return false; // Not cohesive if elements don't match
        }
        start++;
        end--;
    }
    return true; // Cohesive if all elements match
}

module.exports = { minCohesiveGroups };