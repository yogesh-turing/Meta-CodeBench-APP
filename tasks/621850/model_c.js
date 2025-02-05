function minCohesiveGroups(sequence) {
    if (!sequence || sequence.length === 0) return 0;
    
    // Helper function to check if a subsequence is cohesive (palindromic)
    function isCohesive(start, end) {
        while (start < end) {
            if (sequence[start] !== sequence[end]) return false;
            start++;
            end--;
        }
        return true;
    }
    
    const n = sequence.length;
    // dp[i] represents minimum groups needed for sequence[0...i]
    const dp = new Array(n).fill(Infinity);
    
    // Process each ending position
    for (let j = 0; j < n; j++) {
        // Check if sequence from i to j forms a cohesive group
        for (let i = 0; i <= j; i++) {
            if (isCohesive(i, j)) {
                // If it's the first segment (i = 0), it's just 1 group
                // Otherwise, add 1 to the minimum groups needed up to position i-1
                const prevGroups = i === 0 ? 0 : dp[i - 1];
                dp[j] = Math.min(dp[j], prevGroups + 1);
            }
        }
    }
    
    return dp[n - 1];
}

module.exports = { minCohesiveGroups };