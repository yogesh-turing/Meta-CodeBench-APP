function processLogs(logs, errorKeywords) {
  // Create a regex pattern for each error keyword, ensuring it matches whole words or phrases
  const patterns = errorKeywords.map(keyword => {
    // Escape special regex characters in keywords
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Create a regex pattern that matches the keyword with word boundaries and any surrounding punctuation
    return new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
  });

  return logs.map(log => {
    // Apply each pattern to redact the keyword in the log
    patterns.forEach(pattern => {
      log = log.replace(pattern, '[REDACTED]');
    });
    return log;
  });
}

module.exports = { processLogs }