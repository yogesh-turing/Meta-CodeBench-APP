function processLogs(logs, errorKeywords) {
  // Prepare error keywords: sort by length (descending) and escape special characters
  const preparedKeywords = errorKeywords
      .map(keyword => ({
          original: keyword,
          regex: new RegExp(
              `(^|\\s)(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([\\s!?:.,;]|$)`,
              'gi'
          )
      }))
      .sort((a, b) => b.original.length - a.original.length);

  return logs.map(log => {
      let processedLog = log;
      
      // Process each log line for all keywords
      preparedKeywords.forEach(({ regex }) => {
          processedLog = processedLog.replace(regex, (match, prefix, target, suffix) => {
              // Preserve original spacing and punctuation
              return `${prefix}[REDACTED]${suffix}`;
          });
      });

      // Handle multi-line logs
      if (log.includes('\n')) {
          return processedLog.split('\n').join('\n');
      }

      return processedLog;
  });
}

module.exports = { processLogs };