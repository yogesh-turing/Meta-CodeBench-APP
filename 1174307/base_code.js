function getQueryWithSynonyms(query) {
  // Tokenize the query into terms, quoted phrases (double or single), and operators.
  const tokens = query.match(/\(|\)|"[^"]*"|'[^']*'|\b\w[\w.-]*\b|AND|OR|NOT|-/gi);
  if (!tokens) return query; // Return unchanged if the query is empty or invalid

  // Build synonym mapping (assumes a global synonyms array exists)
  const synonymMap = {};
  synonyms.forEach(({ name, aliases }) => {
    const group = [name, ...aliases];
    group.forEach(term => {
      synonymMap[term.toLowerCase()] = group;
    });
  });

  const transformedTokens = [];
  let phraseTokens = []; // accumulate non-operator tokens

  // Flush accumulated phrase tokens into the transformedTokens array
  const flushPhrase = () => {
    if (phraseTokens.length > 0) {
      const phrase = phraseTokens.join(' ').trim();
      // If the phrase is quoted, remove quotes for matching
      let unquoted = phrase;
      if ((phrase.startsWith('"') && phrase.endsWith('"')) || (phrase.startsWith("'") && phrase.endsWith("'"))) {
        unquoted = phrase.substring(1, phrase.length - 1);
      }
      // If an exact match exists in the synonyms mapping, replace it with the synonym group
      if (synonymMap[unquoted.toLowerCase()]) {
        transformedTokens.push(`(${synonymMap[unquoted.toLowerCase()].map(syn => `"${syn}"`).join(' OR ')})`);
      } else {
        // Otherwise, preserve the whole phrase as-is (wrapped in double quotes)
        transformedTokens.push(`"${unquoted}"`);
      }
      phraseTokens = [];
    }
  };

  // Process each token
  tokens.forEach(token => {
    // Normalize boolean operators to uppercase
    if (['and', 'or', 'not'].includes(token.toLowerCase())) {
      token = token.toUpperCase();
    }

    // If token is an operator, parenthesis, or minus, flush any accumulated phrase tokens first
    if (['AND', 'OR', 'NOT', '(', ')', '-'].includes(token)) {
      flushPhrase();
      transformedTokens.push(token);
    } else {
      // If token is a quoted string, flush current phrase and then add the quoted phrase as-is (without further splitting)
      if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
        flushPhrase();
        const inner = token.substring(1, token.length - 1);
        transformedTokens.push(`"${inner}"`);
      } else {
        // Otherwise, accumulate token into phraseTokens
        phraseTokens.push(token);
      }
    }
  });
  // Flush any remaining phrase tokens
  flushPhrase();

  return transformedTokens.join(' ');
}

module.exports = { getQueryWithSynonyms };