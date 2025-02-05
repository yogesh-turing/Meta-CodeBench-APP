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
    
    // dp[i] represents the minimum number of splits needed up to index i
    const dp = new Array(sequence.length).fill(Infinity);
    
    // Check all possible endings for subsequences
    for (let i = 0; i < sequence.length; i++) {
        // If the sequence from start to i is cohesive, we can make it one group
        if (isCohesive(0, i)) {
            dp[i] = 0;
        } else {
            // Try all possible splits before position i
            for (let j = 0; j < i; j++) {
                // If the sequence from j+1 to i is cohesive
                if (isCohesive(j + 1, i)) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
    }
    
    // Return the minimum number of groups (splits + 1)
    return dp[sequence.length - 1] + 1;
}

module.exports = { minCohesiveGroups };