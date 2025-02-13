const {TextFormatter} = require(process.env.TARGET_FILE);

describe('TextFormatter', () => {
    let formatter;

    beforeEach(() => {
        formatter = new TextFormatter();
    });

    describe('Basic Formatting', () => {
        test('should format text to uppercase', () => {
            expect(formatter.format('hello', 'uppercase')).toBe('HELLO');
        });

        test('should format text to lowercase', () => {
            expect(formatter.format('HELLO', 'lowercase')).toBe('hello');
        });

        test('should capitalize words', () => {
            expect(formatter.format('hello world', 'capitalize'))
                .toBe('Hello World');
        });
    });

    describe('Advanced Formatters', () => {
        test('should reverse text', () => {
            expect(formatter.format('hello', 'reverse')).toBe('olleh');
        });

        test('should format text to alternating case', () => {
            expect(formatter.format('hello', 'alternating')).toBe('hElLo');
        });

        test('should convert to snake case', () => {
            expect(formatter.format('Hello World', 'snake')).toBe('hello_world');
        });

        test('should convert to camel case', () => {
            expect(formatter.format('hello world', 'camel')).toBe('helloWorld');
        });
    });

    describe('Remove Formatting', () => {
        test('should remove camelCase formatting', () => {
            expect(formatter.removeFormatting('helloWorld', { camel: true }))
                .toBe('hello World');
            expect(formatter.removeFormatting('thisIsATest', { camel: true }))
                .toBe('this Is A Test');
            expect(formatter.removeFormatting('comeHomeBoy', { camel: true }))
                .toBe('come Home Boy');
        });

        test('should remove snake_case formatting', () => {
            expect(formatter.removeFormatting('hello_world', { snake: true }))
                .toBe('hello world');
            expect(formatter.removeFormatting('this_is_a_test', { snake: true }))
                .toBe('this is a test');
            expect(formatter.removeFormatting('come_home_son', { snake: true }))
                .toBe('come home son');
        });

        test('should remove alternating case', () => {
            expect(formatter.removeFormatting('hElLo WoRlD', { alternating: true }))
                .toBe('hello world');
            expect(formatter.removeFormatting('lOVe CoDiNg', { alternating: true }))
                .toBe('love coding');
        });

        test('should remove case formatting', () => {
            expect(formatter.removeFormatting('HELLO WORLD', { case: true }))
                .toBe('hello world');
        });

        test('should remove extra spaces', () => {
            expect(formatter.removeFormatting('  hello   world  ', { spaces: true }))
                .toBe('hello world');
            expect(formatter.removeFormatting('this   has    many     spaces', { spaces: true }))
                .toBe('this has many spaces');
        });

        test('should combine multiple format removals', () => {
            expect(formatter.removeFormatting('hello_World  TEST', {
                camel: true,
                snake: true,
                case: true,
                spaces: true
            })).toBe('hello world test');
        });

        test('should handle invalid input', () => {
            expect(() => formatter.removeFormatting(null))
                .toThrow();
            expect(() => formatter.removeFormatting(''))
                .toThrow();
        });

        test('should return original text if no options provided', () => {
            expect(formatter.removeFormatting('helloWorld'))
                .toBe('helloWorld');
        });
    });

    describe('Formatter Registration', () => {
        test('should allow registering new formatter', () => {
            formatter.registerFormatter('double', text => text + text);
            expect(formatter.format('hello', 'double')).toBe('hellohello');
        });

        test('should throw error for invalid formatter function', () => {
            expect(() => formatter.registerFormatter('invalid', 'not a function'))
                .toThrow();
        });

        test('should throw error for duplicate formatter name', () => {
            expect(() => formatter.registerFormatter('uppercase', text => text))
                .toThrow();
        });

        test('should list available formatters', () => {
            const formatters = formatter.getAvailableFormatters();
            expect(formatters).toContain('uppercase');
            expect(formatters).toContain('lowercase');
            expect(formatters).toContain('capitalize');
            expect(formatters).toContain('reverse');
            expect(formatters).toContain('alternating');
            expect(formatters).toContain('snake');
            expect(formatters).toContain('camel');
        });
    });

    describe('Pattern Registration and Usage', () => {
        test('should register and apply pattern', () => {
            formatter.registerPattern('removeDigits', /\d+/g, '');
            expect(formatter.applyPattern('hello123world', 'removeDigits')).toBe('helloworld');
        });

        test('should throw error for invalid pattern', () => {
            expect(() => formatter.registerPattern('invalid', 'not-regex', ''))
                .toThrow();
        });

        test('should throw error for non-existent pattern', () => {
            expect(() => formatter.applyPattern('text', 'nonexistent'))
                .toThrow();
        });

        test('should list available patterns', () => {
            formatter.registerPattern('test', /test/g, 'passed');
            const patterns = formatter.getAvailablePatterns();
            expect(patterns).toContain('test');
        });
    });

    describe('Advanced Format Options', () => {
        beforeEach(() => {
            formatter.registerPattern('removeSpaces', /\s+/g, '');
        });

        test('should apply trim option', () => {
            expect(formatter.format('  hello  ', 'uppercase', { trim: true }))
                .toBe('HELLO');
        });

        test('should apply pattern option', () => {
            expect(formatter.format('hello world', 'uppercase', { pattern: 'removeSpaces' }))
                .toBe('HELLOWORLD');
        });

        test('should apply repeat option', () => {
            expect(formatter.format('hello', 'uppercase', { repeat: 2 }))
                .toBe('HELLOHELLO');
        });

        test('should apply multiple options together', () => {
            expect(formatter.format('  hello world  ', 'uppercase', {
                trim: true,
                pattern: 'removeSpaces',
                repeat: 2
            })).toBe('HELLOWORLDHELLOWORLD');
        });
    });

    describe('Chain Formatting', () => {
        test('should chain multiple formatters', () => {
            const result = formatter.chainFormat('hello world', [
                'capitalize',
                'reverse'
            ]);
            expect(result).toBe('dlroW olleH');
        });

        test('should chain formatters with options', () => {
            formatter.registerPattern('removeSpaces', /\s+/g, '');
            const result = formatter.chainFormat('  hello world  ', [
                { name: 'uppercase', options: { trim: true } },
                { name: 'reverse', options: { pattern: 'removeSpaces' } }
            ]);
            expect(result).toBe('DLROWOLLEH');
        });
    });

    describe('Error Handling', () => {
        test('should throw error for non-existent formatter', () => {
            expect(() => formatter.format('text', 'nonexistent'))
                .toThrow();
        });

        test('should throw error for invalid input', () => {
            expect(() => formatter.format(null, 'uppercase'))
                .toThrow();
            expect(() => formatter.format(undefined, 'uppercase'))
                .toThrow();
            expect(() => formatter.format('', 'uppercase'))
                .toThrow();
        });

        test('should validate repeat option', () => {
            expect(formatter.format('hello', 'uppercase', { repeat: 0 }))
                .toBe('HELLO');
            expect(formatter.format('hello', 'uppercase', { repeat: -1 }))
                .toBe('HELLO');
            expect(formatter.format('hello', 'uppercase', { repeat: 1.5 }))
                .toBe('HELLO');
        });
    });
});