function processLogs(logs, errorKeywords) {
  // Preprocess error keywords for efficient matching
  const normalizedErrorKeywords = errorKeywords.map(keyword => keyword.toLowerCase());

  return logs.map(log => {
    // Iterate over each error keyword to match against the log
    for (let keyword of normalizedErrorKeywords) {
      // Create a regex to match whole words or phrases with potential punctuation around them
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      // Redact matching phrases
      log = log.replace(regex, '[REDACTED]');
    }
    return log;
  });
}

module.exports = { processLogs };