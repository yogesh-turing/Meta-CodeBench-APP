const { validateData } = require(process.env.TARGET_FILE);

describe('validateData', () => {
    it('should validate a correct email without plus addressing', () => {
        const data = { email: 'test@example.com' };
        const result = validateData(data);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for email with plus addressing', () => {
        const data = { email: 'test+alias@example.com' };
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for invalid email format', () => {
        const data = { email: 'invalid-email' };
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should validate a correct email with allowed domain', () => {
        const data = { email: 'test@allowed.com' };
        const allowedDomains = ['allowed.com'];
        const result = validateData(data, allowedDomains);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for email with disallowed domain', () => {
        const data = { email: 'test@disallowed.com' };
        const allowedDomains = ['allowed.com'];
        const result = validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with allowed domain is empty', () => {
        const data = { email: 'test@allowed.com' };
        const allowedDomains = [];
        const result = validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation if allowedDomains array contains non-string values', () => {
        const data = { email: 'test@allowed.com' };
        const allowedDomains = ['allowed.com', 123];
        const result = validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should validate a correct email without domain restrictions', () => {
        const data = { email: 'test@anydomain.com' };
        const result = validateData(data);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for missing email field', () => {
        const data = {};
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for empty email field', () => {
        const data = { email: '' };
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with invalid domain', () => {
        const data = { email: 'test@invalid_domain.com' };
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for invalid allowedDomains parameter', () => {
        const data = { email: 'test@invalid_domain.com' };
        const allowedDomains = 'invalid';
        const result = validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with length more than 256', () => {
        const data = { email: 'a'.repeat(257) + '@example.com' };
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with consecutive dots', () => {
        const data = { email: 'test..t@example.com' };
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with invalid TLD', () => {
        const data = { email: 'test@test.test' };
        const result = validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });
});