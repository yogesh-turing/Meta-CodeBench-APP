function getMostFrequentWords(text, N) {
  if (typeof text !== 'string') {
    throw new Error('Input text must be a string');
  }
  if (typeof N !== 'number' || N <= 0 || !Number.isInteger(N)) {
    throw new Error('N must be a positive integer');
  }

  // Normalize text: convert to lowercase and remove punctuation (keep letters, numbers, and underscores)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // removes punctuation; note: underscores are kept since \w includes _
    .split(/\s+/) // split by any whitespace
    .filter((word) => word.length > 0);

  if (words.length === 0) return [];

  // Build a frequency map that also tracks the last occurrence index for each word.
  // Structure: { word: { count, lastOccurrence } }
  const frequencyMap = {};
  words.forEach((word, index) => {
    if (!frequencyMap[word]) {
      frequencyMap[word] = { count: 0, lastOccurrence: index };
    }
    frequencyMap[word].count += 1;
    frequencyMap[word].lastOccurrence = index; // update to current index (i.e. last occurrence)
  });

  // Convert the map into an array and sort by:
  //   1. frequency (descending)
  //   2. last occurrence index (ascending) – so that if two words occur equally often,
  //      the one whose final appearance is earlier comes first.
  const sortedEntries = Object.entries(frequencyMap).sort((a, b) => {
    const countDiff = b[1].count - a[1].count;
    if (countDiff !== 0) return countDiff;
    return a[1].lastOccurrence - b[1].lastOccurrence;
  });

  // Take the top N and map to the desired output format.
  return sortedEntries.slice(0, N).map(([word, data]) => ({
    word,
    count: data.count,
  }));
}

module.exports = { getMostFrequentWords };