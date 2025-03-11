function processLogs(logs, errorKeywords) {
    // Sort error keywords by length (descending) to handle longer phrases first
    const sortedKeywords = [...errorKeywords].sort((a, b) => b.length - a.length);
    
    return logs.map(log => {
        let processedLog = log;
        
        // Create a regex pattern for word boundaries and optional punctuation
        sortedKeywords.forEach(keyword => {
            // Escape special regex characters in the keyword
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Create pattern: word boundary + keyword + optional punctuation
            const pattern = new RegExp(
                `\\b${escapedKeyword}\\b[!?:.,]*`,
                'gi'
            );
            
            // Replace all occurrences in the log
            processedLog = processedLog.replace(pattern, match => {
                // Preserve any punctuation that follows the keyword
                const punctuation = match.match(/[!?:.,]*$/)[0];
                return `[REDACTED]${punctuation}`;
            });
        });
        
        return processedLog;
    });
}

module.exports = { processLogs };