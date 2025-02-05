function minCohesiveGroups(sequence) {
    if (!sequence || sequence.length === 0) {
        return 0;
    }

    const n = sequence.length;
    const dp = Array(n + 1).fill(0);
    dp[0] = 0;

    // Loop through each position in the sequence
    for (let i = 1; i <= n; i++) {
        // Initialize with worst case: each task in its own group
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

function isCohesive(sequence, start, end) {
    while (start < end) {
        if (sequence[start] !== sequence[end]) {
            return false;
        }
        start++;
        end--;
    }
    return true;
}

module.exports = { minCohesiveGroups };