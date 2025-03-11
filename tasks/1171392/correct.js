function processLogs(logs, errorKeywords) {
  // 1. Sort error keywords so that multi-word phrases (longer) are matched first
  errorKeywords.sort((a, b) => {
    return b.split(/\s+/).length - a.split(/\s+/).length;
  });

  return logs.map((log) => {
    let redactedLog = log;

    // 2. For each keyword/phrase, build a regex that handles:
    //    - Word boundaries (\b) so partial words won't match.
    //    - \W+ between words so punctuation & extra spaces are allowed.
    //    - Case-insensitivity (i).
    for (const keyword of errorKeywords) {
      // Escape any regex meta-characters inside the keyword
      const escapedWords = keyword
        .split(/\s+/)
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

      // Build the pattern, e.g. ["critical","system","failure"]
      // becomes \bcritical\b\W+\bsystem\b\W+\bfailure\b
      const pattern = escapedWords.map((w) => `\\b${w}\\b`).join("\\W+");
      const regex = new RegExp(pattern, "gi");

      // 3. Repeatedly replace the matched substring in the log with "[REDACTED]"
      //    until there are no more matches.  This handles multiple occurrences.
      let match;
      while ((match = regex.exec(redactedLog)) !== null) {
        redactedLog =
          redactedLog.slice(0, match.index) +
          "[REDACTED]" +
          redactedLog.slice(match.index + match[0].length);
        // Adjust regex.lastIndex so we don't skip subsequent occurrences.
        regex.lastIndex = match.index + "[REDACTED]".length;
      }
    }

    return redactedLog;
  });
}

module.exports = { processLogs };