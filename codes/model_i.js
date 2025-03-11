function processLogs(logs, errorKeywords) {
  // Create a regex for each error keyword to match words with punctuation.
  const regexKeywords = errorKeywords.map(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i')
  );

  return logs.map(log => {
    // Replace each keyword/phrase in the log with "[REDACTED]"
    regexKeywords.forEach((regex, index) => {
      log = log.replace(regex, '[REDACTED]');
    });
    return log;
  });
}

module.exports = { processLogs };