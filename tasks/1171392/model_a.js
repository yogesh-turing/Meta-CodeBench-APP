function processLogs(logs, errorKeywords) {
  // 1) Normalize all errorKeywords and break multi-word phrases into arrays
  //    Example: ["critical system failure", "error"] -> [ ["critical","system","failure"], ["error"] ]
  const phraseList = errorKeywords.map(phrase =>
    phrase
      .toLowerCase()
      .split(/\s+/) // Split multi-word phrases
  );

  // Sort phrases by length descending so that longer phrases match first
  // (this helps avoid prematurely matching a shorter phrase within a longer one)
  phraseList.sort((a, b) => b.length - a.length);

  // 2) For each log entry, we’ll split on newlines so that we can preserve
  //    multi-line formatting in the final result
  return logs.map(log => {
    const lines = log.split('\n');

    const processedLines = lines.map(line => {
      // Split on spaces to get "tokens" (we won't split punctuation from words here).
      // Example: "Error: Something" -> ["Error:", "Something"]
      const originalTokens = line.split(/\s+/);

      const newTokens = [];
      let i = 0;

      // 3) Process tokens with a “sliding window” approach
      while (i < originalTokens.length) {
        let replaced = false;

        // Try matching multi-word phrases first
        for (const phrase of phraseList) {
          const phraseLength = phrase.length;
          if (i + phraseLength - 1 < originalTokens.length) {
            let match = true;

            // Compare each token in this window to each word in the phrase
            for (let j = 0; j < phraseLength; j++) {
              // Strip punctuation for matching but keep original token for final output
              const compareCandidate = stripNonAlphaNum(originalTokens[i + j]).toLowerCase();
              if (compareCandidate !== phrase[j]) {
                match = false;
                break;
              }
            }

            // If we got a full match on this phrase
            if (match) {
              // We'll redact the entire phrase with a single [REDACTED],
              // attaching whatever punctuation was on the last token in the phrase
              const lastToken = originalTokens[i + phraseLength - 1];
              const trailingPunct = getTrailingPunctuation(lastToken);

              newTokens.push("[REDACTED]" + trailingPunct);

              // Advance the index by the length of the phrase
              i += phraseLength;
              replaced = true;
              break;
            }
          }
        }

        // If we did NOT replace with a multi-word phrase,
        // check single-word keywords
        if (!replaced) {
          const stripped = stripNonAlphaNum(originalTokens[i]).toLowerCase();

          // If it matches a single-word error keyword, redact it
          if (errorKeywords.some(kw => kw.toLowerCase() === stripped)) {
            const trailingPunct = getTrailingPunctuation(originalTokens[i]);
            newTokens.push("[REDACTED]" + trailingPunct);
          } else {
            // Otherwise, leave it as is
            newTokens.push(originalTokens[i]);
          }
          i++;
        }
      }

      // Rejoin tokens for this line with a single space
      return newTokens.join(" ");
    });

    // Rejoin lines using newlines to preserve multi-line logs
    return processedLines.join("\n");
  });
}

// Utility: Strip all leading/trailing punctuation and keep only alphanumerics
//          (e.g. "Error:" -> "Error", "Disk!!!" -> "Disk")
function stripNonAlphaNum(token) {
  return token.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

// Utility: Grab trailing punctuation from the token (if any)
//          (e.g. "Error:" -> ":", "Disk!!!" -> "!!!")
function getTrailingPunctuation(token) {
  const match = token.match(/[^a-zA-Z0-9]+$/);
  return match ? match[0] : "";
}

module.exports = { processLogs };