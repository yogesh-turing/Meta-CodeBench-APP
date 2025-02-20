function getMostFrequentWords(text, N) {
    // Input validation
    if (!text || typeof text !== 'string' || N <= 0) {
        return [];
    }

    // Clean and split the text
    const words = text
        .toLowerCase()
        .replace(/[.,!?;:'"()\[\]{}]/g, '') // Remove punctuation
        .split(/\s+/)                        // Split on whitespace
        .filter(word => word.length > 0);    // Remove empty strings

    if (words.length === 0) {
        return [];
    }

    // Count word frequencies
    const frequencyMap = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    // Sort words by frequency and alphabetically
    const sortedWords = Object.entries(frequencyMap)
        .sort((a, b) => {
            // First sort by count (descending)
            const countDiff = b[1] - a[1];
            if (countDiff !== 0) {
                return countDiff;
            }
            // If counts are equal, sort alphabetically
            return a[0].localeCompare(b[0]);
        })
        .slice(0, N)
        .map(([word, count]) => ({ word, count }));

    return sortedWords;
}

module.exports = { getMostFrequentWords };