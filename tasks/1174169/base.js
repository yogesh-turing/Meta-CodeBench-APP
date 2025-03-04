function processLogs(logs, errorKeywords) {
  return logs.map(log => {
    const words = log.split(" ");
    return words.map(word => 
      errorKeywords.includes(word.toLowerCase()) ? "[REDACTED]" : word
    ).join(" ");
  });
}

module.exports = {processLogs}