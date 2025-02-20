function getMostFrequentWords(text, N) {
    // Input validation
    if (!text || typeof text !== 'string' || N <= 0) {
        return [];
    }

    // Clean and split the text
    const words = text.trim()
        .toLowerCase()
        // Replace all punctuation with spaces
        .replace(/[.,!?;:'"()\[\]{}]/g, ' ')
        // Replace multiple spaces with single space
        .replace(/\s+/g, ' ')
        .split(' ')
        .filter(word => word.length > 0);

    // If no valid words after cleaning, return empty array
    if (words.length === 0) {
        return [];
    }

    // Count word frequencies
    const frequencyMap = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    // Sort by frequency (descending) and alphabetically for equal frequencies
    const sortedWords = Object.entries(frequencyMap)
        .sort((a, b) => {
            // First sort by count (descending)
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            // If counts are equal, sort alphabetically
            return a[0].localeCompare(b[0]);
        });

    // Return top N results
    return sortedWords
        .slice(0, N)
        .map(([word, count]) => ({ word, count }));
}

module.exports = { getMostFrequentWords };