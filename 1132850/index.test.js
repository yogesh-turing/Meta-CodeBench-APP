
const { SearchObject } = require('./solution'); // Replace functionNames with the correct function(s)
describe('SearchObject', () => {
    let testObject;
    beforeEach(() => {
        testObject = {
            userId: 42,
            profile: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                username: 'johndoe',
                phone: null,
                address: undefined
            },
            orders: [
                { id: 1, status: 'delivered', total: 42.00 },
                { id: 2, status: 'pending', total: 42 },
                { id: 3, status: 'cancelled', refundStatus: null },
                { id: 4, deliveryDate: undefined }
            ],
            preferences: {
                'null': 'represents no preference',
                'undefined': 'preference not set',
                theme: null,
                language: null,
                notifications: undefined,
                newsletter: undefined
            },
            metadata: {
                [null]: 'missing data',
                [undefined]: 'data not collected'
            },
            42: 'legacy user id',
            accountStatus: true,
            USERNAME: 'JOHNDOE'
        };
    });

    test('should find value matches for userId', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, 42, 'value');
        expect(results).toHaveLength(3);
        expect(results.some(r => r.key === 'userId' && r.value === 42)).toBe(true);
        expect(results.every(r => r.matchType.includes('value'))).toBe(true);
    });

    test('should find key matches for firstName', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, 'firstName', 'key');
        expect(results).toHaveLength(1);
        expect(results[0].key === 'firstName' && results[0].value === 'John').toBe(true);
        expect(results.every(r => r.matchType.includes('key'))).toBe(true);
    });

    test('should find both key and value matches for johndoe', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, 'johndoe');
        expect(results.length).toBe(2);
        expect(results.some(r => r.key === 'username' && r.value === 'johndoe')).toBe(true);
        expect(results.some(r => r.key === 'USERNAME' && r.value === 'JOHNDOE')).toBe(true);
    });

    test('should handle case insensitive search for username', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, 'JOHNDOE');
        const lowerResults = searcher.search(testObject, 'johndoe');
        expect(results).toEqual(lowerResults);
    });

    test('should handle number search in both string and number format', () => {
        const searcher = new SearchObject();
        const numberResults = searcher.search(testObject, 42);
        const stringResults = searcher.search(testObject, '42');
        expect(numberResults).toEqual(stringResults);
    });


    test('should handle null values in user data', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, null);
        expect(results.some(r => r.key === 'phone' && r.value === null)).toBe(true);
        expect(results.some(r => r.key === 'theme' && r.value === null)).toBe(true);
        expect(results.some(r => r.key === 'language' && r.value === null)).toBe(true);
        expect(results.some(r => r.key === 'refundStatus' && r.value === null)).toBe(true);
        expect(results.some(r => r.key === 'null' && r.value === 'represents no preference')).toBe(true);
        expect(results.some(r => r.key === 'null' && r.value === 'missing data')).toBe(true);
        const nullValueCount = results.filter(r => r.value === null).length;
        expect(nullValueCount).toBe(4);
    });

    test('should handle undefined values in user data', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, undefined);
        expect(results.some(r => r.key === 'address' && r.value === undefined)).toBe(true);
        expect(results.some(r => r.key === 'notifications' && r.value === undefined)).toBe(true);
        expect(results.some(r => r.key === 'newsletter' && r.value === undefined)).toBe(true);
        expect(results.some(r => r.key === 'deliveryDate' && r.value === undefined)).toBe(true);
        expect(results.some(r => r.key === 'undefined' && r.value === 'preference not set')).toBe(true);
        expect(results.some(r => r.key === 'undefined' && r.value === 'data not collected')).toBe(true);
        const undefinedValueCount = results.filter(r => r.value === undefined).length;
        expect(undefinedValueCount).toBe(4);
    });

    test('should handle boolean values', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, true);
        expect(results).toHaveLength(1);
        expect(results[0].key).toBe('accountStatus');
        expect(results[0].value).toBe(true);
    });

    test('should return empty array for non-existent value', () => {
        const searcher = new SearchObject();
        const results = searcher.search(testObject, 'nonexistent');
        expect(results).toHaveLength(0);
    });

    test('should handle empty or invalid input', () => {
        const searcher = new SearchObject();
        expect(searcher.search(null, 'test')).toHaveLength(0);
        expect(searcher.search(undefined, 'test')).toHaveLength(0);
        expect(searcher.search({}, 'test')).toHaveLength(0);
    });

    test('compareValues should correctly compare different types', () => {
        const searcher = new SearchObject();
        const testCases = [
            { val1: 42, val2: '42', expected: true },
            { val1: 'test', val2: 'TEST', expected: true },
            { val1: null, val2: 'null', expected: true },
            { val1: undefined, val2: 'undefined', expected: true },
            { val1: true, val2: 'true', expected: true },
            { val1: 42, val2: 43, expected: false }
        ];

        testCases.forEach(({ val1, val2, expected }) => {
            expect(searcher.compareValues(val1, val2)).toBe(expected);
        });
    });

    test('Conversion method should convert values consistently', () => {
        const searchObj = new SearchObject();
        const converted1 = searchObj.stringConversion(42);
        const converted2 = searchObj.stringConversion(42);

        // Should return same reference for same input
        expect(converted1).toBe(converted2);

        // Should correctly convert different types
        expect(searchObj.stringConversion(null)).toBe('null');
        expect(searchObj.stringConversion(undefined)).toBe('undefined');
        expect(searchObj.stringConversion(true)).toBe('true');
    });

    test('isMatch should correctly identify matches based on search type', () => {
        const searchObj = new SearchObject();
        const entry = { key: 'testKey', value: 'testValue' };

        // Test key matches
        expect(searchObj.isMatch(entry, 'testkey', 'key')).toBe(true);
        expect(searchObj.isMatch(entry, 'wrongkey', 'key')).toBe(false);

        // Test value matches
        expect(searchObj.isMatch(entry, 'testvalue', 'value')).toBe(true);
        expect(searchObj.isMatch(entry, 'wrongvalue', 'value')).toBe(false);

        // Test both matches
        expect(searchObj.isMatch(entry, 'testkey', 'both')).toBe(true);
        expect(searchObj.isMatch(entry, 'testvalue', 'both')).toBe(true);
    });

    test('search function should use recursion', () => {
        const searcher = new SearchObject();
        let callCount = 0;

        // Override search to count calls
        const originalSearch = searcher.search;
        searcher.search = function(obj, searchTerm, searchType) {
            callCount++;
            return originalSearch.call(this, obj, searchTerm, searchType);
        };

        const deepObject = {
            a: {
                b: {
                    c: 'target'
                }
            }
        };

        searcher.search(deepObject, 'target');

        console.log(callCount)
        
        // If search is only called once, it's not recursive
        expect(callCount).toBeGreaterThan(1);
    });

    test('should handle mixed type comparisons', () => {
        const mixedObject = {
            '42': 'string',
            42: 'number',
            true: 'boolean string',
            [true]: 'boolean'
        };

        const searcher = new SearchObject();
        const results = searcher.search(mixedObject, 42);
        expect(results.length).toBeGreaterThan(0);

        const boolResults = searcher.search(mixedObject, true);
        expect(boolResults.length).toBeGreaterThan(0);
    });
});