const validatePassword = require(process.env.TARGET_FILE);

describe('Password Validator', () => {
    test('should validate a strong password', () => {
        const result = validatePassword('P@ssw0rd!2023');
        expect(result.isValid).toBe(true);
        expect(result.suggestions).toHaveLength(0);
    });

    test('should reject non-string input', () => {
        const result = validatePassword(123456);
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Please provide a valid string input');
    });

    test('should reject short passwords', () => {
        const result = validatePassword('Pw1!');
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Password must be between 8 and 32 characters');
    });

    test('should reject long passwords', () => {
        const result = validatePassword('P@ssw0rd!'.repeat(5));
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Password must be between 8 and 32 characters');
    });

    test('should require uppercase letters', () => {
        const result = validatePassword('p@ssw0rd!');
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Include at least one uppercase letter');
    });

    test('should require lowercase letters', () => {
        const result = validatePassword('P@SSW0RD!');
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Include at least one lowercase letter');
    });

    test('should require numbers', () => {
        const result = validatePassword('P@ssword!');
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Include at least one number');
    });

    test('should require special characters', () => {
        const result = validatePassword('Pas4sw0rd1293');
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Include at least one special character');
    });

    test('should reject repeated characters', () => {
        const result = validatePassword('P@ssswww0rd!');
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Avoid repeating the same character more than twice');
    });

    test('should reject obfuscated common words', () => {
        // Test direct substitutions of 'password'
        const result1 = validatePassword('pa@ssw0ord');
        expect(result1.isValid).toBe(false);
        expect(result1.suggestions).toContain('Avoid common words like "password", "123456", "qwerty", or "admin"');

        // Test direct substitutions of 'admin'
        const result2 = validatePassword("admin");
        expect(result2.isValid).toBe(false);
        expect(result2.suggestions).toContain('Avoid common words like "password", "123456", "qwerty", or "admin"');

        // Test exact match of '123456'
        const result3 = validatePassword("123456");
        expect(result3.isValid).toBe(false);
        expect(result3.suggestions).toContain('Avoid common words like "password", "123456", "qwerty", or "admin"');
    });

    test('should reject sequential patterns', () => {
        const result = validatePassword('P@ssabc123!');
        expect(result.isValid).toBe(false);
        expect(result.suggestions).toContain('Avoid sequential patterns like "abc", "123", or "xyz"');
    });

    test('should provide multiple suggestions when multiple rules fail', () => {
        const result = validatePassword('password');
        expect(result.isValid).toBe(false);
        expect(result.suggestions.length).toBeGreaterThan(1);
    });
});
