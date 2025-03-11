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
  
  for (const keyword of keywords) {
      const regex = new RegExp(
          `(?<=^|\\s|[\\W])(${escapeRegExp(keyword)})(?=$|\\s|[\\W])`,
          'gi'
      );
      
      // Store matches and their positions
      const matches = [];
      let match;
      while ((match = regex.exec(processedLine)) !== null) {
          matches.push({
              original: match[1],
              start: match.index,
              end: regex.lastIndex
          });
      }
      
      // Replace matches from end to start to maintain correct indices
      for (let i = matches.length - 1; i >= 0; i--) {
          const { start, end, original } = matches[i];
          processedLine = 
              processedLine.substring(0, start) +
              '[REDACTED]' +
              processedLine.substring(end);
      }
  }
  
  return processedLine;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { processLogs };