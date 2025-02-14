const { SearchObject } = require('./solution');

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

    describe('stringConversion', () => {
        test('should convert and cache values consistently', () => {
            const searcher = new SearchObject();
            expect(searcher.stringConversion(42)).toBe('42');
            expect(searcher.stringConversion(null)).toBe('null');
            expect(searcher.stringConversion(undefined)).toBe('undefined');
            expect(searcher.stringConversion('TEST')).toBe('test');
            expect(searcher.stringConversion(true)).toBe('true');

            // Test caching
            const value = 'TEST';
            const result1 = searcher.stringConversion(value);
            const result2 = searcher.stringConversion(value);
            expect(result1).toBe(result2);
        });
    });

    describe('compareValues', () => {
        test('should compare different types correctly', () => {
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
    });

    describe('isMatch', () => {
        test('should match keys and values correctly', () => {
            const searcher = new SearchObject();
            const entry = { key: 'testKey', value: 'testValue' };

            console.log(
                searcher.isMatch(entry, 'testkey', 'key'),
                searcher.isMatch(entry, 'wrongkey', 'key'),
                searcher.isMatch(entry, 'testvalue', 'value'),
                searcher.isMatch(entry, 'wrongvalue', 'value'),
                searcher.isMatch(entry, 'testkey', 'both'),
                searcher.isMatch(entry, 'testvalue', 'both')
            )

            expect(searcher.isMatch(entry, 'testkey', 'key')).toBe(true);
            expect(searcher.isMatch(entry, 'wrongkey', 'key')).toBe(false);
            expect(searcher.isMatch(entry, 'testvalue', 'value')).toBe(true);
            expect(searcher.isMatch(entry, 'wrongvalue', 'value')).toBe(false);
            expect(searcher.isMatch(entry, 'testkey', 'both')).toBe(true);
            expect(searcher.isMatch(entry, 'testvalue', 'both')).toBe(true);
        });
    });

    describe('search', () => {
        test('should find value matches', () => {
            const searcher = new SearchObject();
            const results = searcher.search(testObject, 42, 'value');
            expect(results).toHaveLength(3);
            expect(results.some(r => r.key === 'userId' && r.value === 42)).toBe(true);
            expect(results.every(r => r.matchType.includes('value'))).toBe(true);
        });

        test('should find key matches', () => {
            const searcher = new SearchObject();
            const results = searcher.search(testObject, 'firstName', 'key');
            expect(results).toHaveLength(1);
            expect(results[0].key === 'firstName' && results[0].value === 'John').toBe(true);
            expect(results[0].matchType).toContain('key');
        });

        test('should handle case insensitive search', () => {
            const searcher = new SearchObject();
            const results = searcher.searchInObject(testObject, 'JOHNDOE');
            expect(results.length).toBe(2);
            expect(results.some(r => r.key === 'username' && r.value === 'johndoe')).toBe(true);
            expect(results.some(r => r.key === 'USERNAME' && r.value === 'JOHNDOE')).toBe(true);
        });

        test('should handle special values', () => {
            const searcher = new SearchObject();
            
            // Test null
            const nullResults = searcher.searchInObject(testObject, null);
            expect(nullResults.filter(r => r.value === null)).toHaveLength(4);

            // Test undefined
            const undefinedResults = searcher.searchInObject(testObject, undefined);
            expect(undefinedResults.filter(r => r.value === undefined)).toHaveLength(4);

            // Test boolean
            const boolResults = searcher.searchInObject(testObject, true);
            expect(boolResults).toHaveLength(1);
            expect(boolResults[0].key).toBe('accountStatus');
            expect(boolResults[0].value).toBe(true);
        });

        test('should handle empty or invalid input', () => {
            const searcher = new SearchObject();
            expect(searcher.searchInObject(null, 'test')).toHaveLength(0);
            expect(searcher.searchInObject(undefined, 'test')).toHaveLength(0);
            expect(searcher.searchInObject({}, 'test')).toHaveLength(0);
            expect(searcher.searchInObject(testObject, 'nonexistent')).toHaveLength(0);
        });

        test('should handle mixed type comparisons', () => {
            const mixedObject = {
                '42': 'string',
                42: 'number',
                true: 'boolean string',
                [true]: 'boolean'
            };

            const searcher = new SearchObject();
            const results = searcher.searchInObject(mixedObject, 42);
            expect(results.length).toBeGreaterThan(0);

            const boolResults = searcher.searchInObject(mixedObject, true);
            expect(boolResults.length).toBeGreaterThan(0);
        });
    });
});