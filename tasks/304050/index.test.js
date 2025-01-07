const { autocomplete } = require('./correct');

describe('Autocomplete Function', () => {
    test('should be case insensitive', () => {
        const keywords = [
            { keyword: 'Apple', frequency: 10 },
            { keyword: 'app', frequency: 15 },
            { keyword: 'Application', frequency: 5 },
            { keyword: 'banana', frequency: 20 }
        ];
        const result = autocomplete(keywords, 'APP', 2);
        expect(result).toEqual([
            { keyword: 'app', frequency: 15 },
            { keyword: 'Apple', frequency: 10 }
        ]);
    });

    test('should return suggestions that contain the prefix', () => {
        const keywords = [
            { keyword: 'apple', frequency: 10 },
            { keyword: 'app', frequency: 15 },
            { keyword: 'application', frequency: 5 },
            { keyword: 'banana', frequency: 20 }
        ];
        const result = autocomplete(keywords, 'pli', 2);
        expect(result).toEqual([
            { keyword: 'application', frequency: 5 }
        ]);
    });

    test('should return all suggestions if k is greater than the number of matches', () => {
        const keywords = [
            { keyword: 'apple', frequency: 10 },
            { keyword: 'app', frequency: 15 },
            { keyword: 'application', frequency: 5 }
        ];
        const result = autocomplete(keywords, 'app', 5);
        expect(result).toEqual([
            { keyword: 'app', frequency: 15 },
            { keyword: 'apple', frequency: 10 },
            { keyword: 'application', frequency: 5 }
        ]);
    });

    test('should return top k suggestions sorted by frequency', () => {
        const keywords = [
            { keyword: 'apple', frequency: 10 },
            { keyword: 'app', frequency: 15 },
            { keyword: 'application', frequency: 5 },
            { keyword: 'applet', frequency: 20 }
        ];
        const result = autocomplete(keywords, 'app', 3);
        expect(result).toEqual([
            { keyword: 'applet', frequency: 20 },
            { keyword: 'app', frequency: 15 },
            { keyword: 'apple', frequency: 10 }
        ]);
    });

    test('should handle empty keyword list', () => {
        const keywords = [];
        const result = autocomplete(keywords, 'app', 3);
        expect(result).toEqual([]);
    });

    test('should handle empty prefix', () => {
        const keywords = [
            { keyword: 'apple', frequency: 10 },
            { keyword: 'app', frequency: 15 },
            { keyword: 'application', frequency: 5 }
        ];
        const result = autocomplete(keywords, '', 3);
        expect(result).toEqual([]);
    });

    test('should handle k less than or equal to 0', () => {
        const keywords = [
            { keyword: 'apple', frequency: 10 },
            { keyword: 'app', frequency: 15 },
            { keyword: 'application', frequency: 5 }
        ];
        const result = autocomplete(keywords, 'app', 0);
        expect(result).toEqual([]);
    });
});