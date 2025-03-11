function processLogs(logs, errorKeywords) {
  // Sort keywords by length (descending) to handle longer phrases first
  const sortedKeywords = [...errorKeywords].sort((a, b) => b.length - a.length);
  
  return logs.map(log => {
      let processedLog = log;
      
      // Handle multi-line logs
      if (log.includes('\n')) {
          return log.split('\n').map(line => processLine(line, sortedKeywords)).join('\n');
      }
      
      return processLine(processedLog, sortedKeywords);
  });
}

function processLine(line, keywords) {
  let processedLine = line;
  
  // Regular expression to match word boundaries and preserve punctuation
  keywords.forEach(keyword => {
      const regex = new RegExp(
          `(^|\\s)(${escapeRegExp(keyword)})(\\W|$)`,
          'gi'
      );
      
      processedLine = processedLine.replace(regex, (match, prefix, word, suffix) => {
          // Preserve the original spacing and punctuation
          return `${prefix}[REDACTED]${suffix}`;
      });
  });
  
  return processedLine;
}

function escapeRegExp(string) {
  // Escape special characters that might interfere with regex
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { processLogs };