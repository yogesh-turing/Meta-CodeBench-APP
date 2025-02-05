function minCohesiveGroups(sequence) {
    if (!sequence || sequence.length === 0) return 0;
    
    const n = sequence.length;
    
    // Helper function to check if a subsequence is cohesive (palindromic)
    function isCohesive(start, end) {
        while (start < end) {
            if (sequence[start] !== sequence[end]) {
                return false;
            }
            start++;
            end--;
        }
        return true;
    }
    
    // dp[i] represents the minimum number of cohesive groups needed for sequence[0...i]
    const dp = new Array(n).fill(Infinity);
    
    // For each ending position
    for (let i = 0; i < n; i++) {
        // If the sequence from 0 to i is cohesive, we need only 1 group
        if (isCohesive(0, i)) {
            dp[i] = 1;
            continue;
        }
        
        // Try all possible previous positions
        for (let j = 0; j < i; j++) {
            // If the sequence from j+1 to i is cohesive
            if (isCohesive(j + 1, i)) {
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }
    
    return dp[n - 1];
}

module.exports = { minCohesiveGroups };