function getMostFrequentWords(text, N) {
    // Input validation
    if (!text || typeof text !== 'string' || N <= 0) {
        return [];
    }

    // Clean and split the text
    const words = text.trim()
                     .toLowerCase()
                     .replace(/[^\w\s]/g, '')  // Remove all punctuation
                     .split(/\s+/)             // Split on any whitespace
                     .filter(word => word);    // Remove empty strings

    // Count word frequencies
    const frequencyMap = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    // Sort words by frequency and alphabetically
    const sortedWords = Object.entries(frequencyMap)
        .sort((a, b) => {
            // First sort by frequency (descending)
            const countDiff = b[1] - a[1];
            if (countDiff !== 0) return countDiff;
            // Then sort alphabetically for same frequencies
            return a[0].localeCompare(b[0]);
        })
        .slice(0, N)
        .map(([word, count]) => ({ word, count }));

    return sortedWords;
}

module.exports = { getMostFrequentWords };