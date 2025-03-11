function processLogs(logs, errorKeywords) {
  // Sort error keywords by length (descending) to handle longer phrases first
  const sortedKeywords = errorKeywords.slice().sort((a, b) => b.length - a.length);

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
  // Store punctuation positions and characters
  const punctuation = [];
  let cleanLine = line.replace(/([^\w\s])/g, (match, p1, offset) => {
      punctuation.push({ char: p1, position: offset });
      return ' ';
  });

  // Process each keyword
  keywords.forEach(keyword => {
      const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
      cleanLine = cleanLine.replace(keywordRegex, '[REDACTED]');
  });

  // Restore punctuation
  let result = cleanLine;
  punctuation.sort((a, b) => b.position - a.position).forEach(p => {
      if (p.position === 0) {
          result = p.char + result;
      } else {
          result = result.slice(0, p.position) + p.char + result.slice(p.position);
      }
  });

  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

module.exports = { processLogs };