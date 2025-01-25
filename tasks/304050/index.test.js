const { validateAndProcessInput } = require('./model_a');

const ERROR_MESSAGES = {
    INVALID_NAME: 'Invalid name',
    INVALID_DATE_OF_BIRTH: 'Invalid date of birth',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_IP_ADDRESS: 'Invalid IP address format',
    INVALID_ADDRESS: 'Invalid address',
    INVALID_ADDRESSES: 'Invalid addresses',
    INVALID_ZIP_CODE: 'Invalid zip code',
    INVALID_ADDRESS_TYPE: 'Invalid address type',
    INVALID_EMPLOYMENT_DETAILS: 'Invalid employment details',
    INVALID_PHONE_NUMBER: 'Invalid phone number',
    INVALID_PASSWORD: 'Invalid password',
    INVALID_USERNAME: 'Invalid username',
    INVALID_EMAIL_DOMAIN: 'Invalid email domain',
    INVALID_AGE: 'User must be at least 18 years old'
};

const errorsCheck = (errors, error_startswith) => {
    return errors.some(error => error.startsWith(error_startswith));
};

const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

describe('validateAndProcessInput', () => {
    test('should return success for valid input', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@example.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(true);
        expect(result.data).toEqual({
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@example.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'johndoe'
        });
    });

    test('should return error for invalid name', () => {
        const input = {
            name: 'Jo',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@example.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_NAME)).toBe(true);
    });

    test('should return error for invalid date of birth', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '2025-01-01',
            email: 'john.doe@example.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_DATE_OF_BIRTH)).toBe(true);
    });

    test('should return error for invalid email format', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@invalid',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_EMAIL)).toBe(true);
    });

    test('should return error for invalid email domain', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@notexample.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_EMAIL_DOMAIN)).toBe(true);
    });

    test('should return error for invalid IP address', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@example.com',
            ipAddress: '999.999.999.999',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_IP_ADDRESS)).toBe(true);
    });

    test('should return error for invalid phone number', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@example.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '12345',
            password: 'Password@123',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_PHONE_NUMBER)).toBe(true);
    });

    test('should return error for invalid password', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@example.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'password',
            username: 'johndoe'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_PASSWORD)).toBe(true);
    });

    test('should return error for disallowed username', () => {
        const input = {
            name: 'John Doe',
            dateOfBirth: '1990-01-01',
            email: 'john.doe@example.com',
            ipAddress: '192.168.1.1',
            addresses: [
                {
                    city: 'New York',
                    zipCode: '10001',
                    type: 'home'
                }
            ],
            isEmployed: true,
            employmentDetails: {
                position: 'Developer',
                startDate: '2020-01-01'
            },
            phoneNumber: '+1234567890',
            password: 'Password@123',
            username: 'admin'
        };

        const result = validateAndProcessInput(input);
        expect(result.success).toBe(false);
        expect(errorsCheck(result.errors, ERROR_MESSAGES.INVALID_USERNAME)).toBe(true);
    });
});