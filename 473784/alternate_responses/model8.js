function getMostFrequentWords(text, N) {
    if (!text || N <= 0) return [];

    const words = text.split(/\s+/); // Split on one or more whitespace characters
    const frequencyMap = {};

    words.forEach(word => {
        const cleanedWord = word.toLowerCase().replace(/[^\w\s]|_/g, ""); // Remove all non-word characters and underscores
        if (cleanedWord) {
            frequencyMap[cleanedWord] = (frequencyMap[cleanedWord] || 0) + 1;
        }
    });

    const sortedWords = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1]);

    return sortedWords.slice(0, N).map(word => ({ word: word[0], count: word[1] }));
}

module.exports = { getMostFrequentWords };