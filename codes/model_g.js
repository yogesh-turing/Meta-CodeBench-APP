function processLogs(logs, errorKeywords) {
  const keywordRegexes = errorKeywords.map(keyword => {
    const escapedKeyword = keyword.replace(/[-/\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`\\b${escapedKeyword}\\b`, 'i');
  });

  return logs.map(log => {
    // Perform the redaction on the log
    keywordRegexes.forEach((regex, index) => {
      log = log.replace(regex, "[REDACTED]");
    });
    
    return log;
  });
}

module.exports = { processLogs };