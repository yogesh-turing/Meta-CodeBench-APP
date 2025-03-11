function processLogs(logs, errorKeywords) {
  const normalizedKeywords = errorKeywords.map(keyword => keyword.toLowerCase());

  return logs.map(log => {
    // Redact complete phrases first, including handling punctuation if needed
    normalizedKeywords.forEach(keyword => {
      // Use regex to match the entire phrase with boundaries and punctuation
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      log = log.replace(regex, '[REDACTED]');
    });

    // After handling phrases, we should also replace single words
    return log.split(/(\s+)/).map(word => {
      const cleanWord = word.toLowerCase().replace(/[.,:!?]/g, '');

      return normalizedKeywords.includes(cleanWord) ? "[REDACTED]" : word;
    }).join('');
  });
}

module.exports = { processLogs }