const { validateData } = require(process.env.TARGET_FILE);

describe('validateData', () => {
    it('should validate a correct email without plus addressing', async () => {
        const data = { email: 'test@example.com' };
        const result = await validateData(data);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for email with plus addressing', async () => {
        const data = { email: 'test+alias@example.com' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for invalid email format', async () => {
        const data = { email: 'invalid-email' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should validate a correct email with allowed domain', async () => {
        const data = { email: 'test@allowed.com' };
        const allowedDomains = ['allowed.com'];
        const result = await validateData(data, allowedDomains);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for email with disallowed domain', async () => {
        const data = { email: 'test@disallowed.com' };
        const allowedDomains = ['allowed.com'];
        const result = await validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with allowed domain is empty', async () => {
        const data = { email: 'test@allowed.com' };
        const allowedDomains = [];
        const result = await validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation if allowedDomains array contains non-string values', async () => {
        const data = { email: 'test@allowed.com' };
        const allowedDomains = ['allowed.com', 123];
        const result = await validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should validate a correct email without domain restrictions', async () => {
        const data = { email: 'test@anydomain.com' };
        const result = await validateData(data);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for missing email field', async () => {
        const data = {};
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for empty email field', async () => {
        const data = { email: '' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with invalid domain', async () => {
        const data = { email: 'test@invalid_domain.com' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for invalid allowedDomains parameter', async () => {
        const data = { email: 'test@invalid_domain.com' };
        const allowedDomains = 'invalid';
        const result = await validateData(data, allowedDomains);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with length more than 256', async () => {
        const data = { email: 'a'.repeat(257) + '@example.com' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with consecutive dots', async () => {
        const data = { email: 'test..t@example.com' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with invalid TLD', async () => {
        const data = { email: 'test@test.test' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for email with special characters', async () => {
        const data = { email: 'test@ex!ample.com' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should validate a correct email with subdomain', async () => {
        const data = { email: 'test@mail.example.com' };
        const result = await validateData(data);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for email with spaces', async () => {
        const data = { email: 'test @example.com' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });


    // credit card tests
    it('should validate a correct credit card', async () => {
        const data = { email: 'test@example.com', creditCard: '1234-5678-1234-5678' };
        const result = await validateData(data);
        expect(result.status).toBe('success');
        expect(result.data).toEqual(data);
    });

    it('should fail validation for invalid credit card format', async () => {
        const data = { email: 'test@example.com', creditCard: '1234-5678-1234' };
        const result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

    it('should fail validation for invalid credit card format', async () => {
        let data = { email: 'test@example.com', creditCard: '1234-5678-1234' };
        let result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);

        data = { email: 'test@example.com', creditCard: '1234-5678-1234-5678-1234' };
        result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);

        data = { email: 'test@example.com', creditCard: '1234-5678-1234-5678-1234-5678' };
        result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);

        data = { email: 'test@example.com', creditCard: '' };
        result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);

        data = { email: 'test@example.com', creditCard: 'abcd-pqrs-abcd' };
        result = await validateData(data);
        expect(result.status).toBe('failed');
        expect(result.message.length).toBeGreaterThan(0);
    });

});
