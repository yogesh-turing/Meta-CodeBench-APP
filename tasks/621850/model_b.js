function minCohesiveGroups(sequence) {
    if (!sequence || sequence.length === 0) return 0;
    
    // Helper function to check if a sequence is cohesive (palindromic)
    function isCohesive(start, end) {
        while (start < end) {
            if (sequence[start] !== sequence[end]) return false;
            start++;
            end--;
        }
        return true;
    }
    
    // Create memoization array
    const dp = new Array(sequence.length).fill(Infinity);
    
    // Dynamic programming solution
    for (let end = 0; end < sequence.length; end++) {
        if (isCohesive(0, end)) {
            dp[end] = 1;
        } else {
            for (let split = 0; split < end; split++) {
                if (isCohesive(split + 1, end)) {
                    dp[end] = Math.min(dp[end], dp[split] + 1);
                }
            }
        }
    }
    
    return dp[sequence.length - 1];
}

module.exports = { minCohesiveGroups };