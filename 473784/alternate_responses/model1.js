function getMostFrequentWords(text, N) {
    // Input validation
    if (!text || typeof text !== 'string' || N <= 0) {
        return [];
    }

    // Clean and split the text
    // Remove all punctuation and convert to lowercase
    const words = text.toLowerCase()
        .replace(/[.,!?;:"'\-_()[\]{}]/g, '')  // Remove punctuation
        .split(/\s+/)                           // Split on whitespace
        .filter(word => word.length > 0);       // Remove empty strings

    if (words.length === 0) {
        return [];
    }

    // Count word frequencies
    const frequencyMap = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    // Sort words by frequency and alphabetically for equal frequencies
    const sortedWords = Object.entries(frequencyMap)
        .sort((a, b) => {
            // First sort by frequency (descending)
            const frequencyDiff = b[1] - a[1];
            if (frequencyDiff !== 0) {
                return frequencyDiff;
            }
            // Then sort alphabetically for equal frequencies
            return a[0].localeCompare(b[0]);
        })
        .slice(0, N)
        .map(([word, count]) => ({ word, count }));

    return sortedWords;
}

module.exports = { getMostFrequentWords };