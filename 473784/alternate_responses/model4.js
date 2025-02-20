function getMostFrequentWords(text, N) {
    // Input validation
    if (!text || typeof text !== 'string' || N <= 0) return [];

    // Clean and normalize the text
    const cleanedText = text
        .toLowerCase()
        .replace(/[^a-zA-Z\s]/g, '') // Remove all non-alphabetic characters
        .trim();

    // Handle empty text after cleaning
    if (!cleanedText) return [];

    // Split into words and create frequency map
    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    const frequencyMap = {};

    // Count word frequencies
    for (const word of words) {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    }

    // Sort words by frequency and alphabetically for equal frequencies
    const sortedWords = Object.entries(frequencyMap)
        .sort((a, b) => {
            // First sort by frequency (descending)
            const frequencyDiff = b[1] - a[1];
            // If frequencies are equal, sort alphabetically
            return frequencyDiff !== 0 ? frequencyDiff : a[0].localeCompare(b[0]);
        });

    // Return top N results
    return sortedWords
        .slice(0, N)
        .map(([word, count]) => ({ word, count }));
}

module.exports = { getMostFrequentWords };