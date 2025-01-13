const { UserAuthService } = require(process.env.TARGET_FILE || './index.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserAuthService', () => {
    let authService;
    const validEmail = 'test@example.com';
    const validPassword = 'TestPass123!';
    const mockToken = 'mock.jwt.token';

    beforeEach(() => {
        authService = new UserAuthService();
        process.env.JWT_SECRET = 'test-secret';
        
        jest.clearAllMocks();
        
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue(mockToken);
    });

    describe('addUser', () => {
        it('should successfully add a valid user and return a UUID', async () => {
            const result = await authService.addUser(validEmail, validPassword);
            
            expect(result.success).toBe(true);
            expect(result.userId).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
            expect(bcrypt.hash).toHaveBeenCalledWith(validPassword, 12);
        });

        it('should generate unique IDs for different users', async () => {
            const result1 = await authService.addUser('user1@example.com', validPassword);
            const result2 = await authService.addUser('user2@example.com', validPassword);
            
            expect(result1.success && result2.success).toBe(true);
            expect(result1.userId).not.toBe(result2.userId);
            expect(result1.userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            expect(result2.userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });

        it('should reject invalid email format', async () => {
            const result = await authService.addUser('invalid-email', validPassword);
            
            expect(result.success).toBe(false);
            expect(result.errors[0].message).toContain('Invalid email');
        });

        it('should reject weak passwords', async () => {
            const result = await authService.addUser(validEmail, 'weak');
            
            expect(result.success).toBe(false);
        });

        it('should prevent duplicate users', async () => {
            await authService.addUser(validEmail, validPassword);
            const result = await authService.addUser(validEmail, validPassword);
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('User already exists');
        });
    });

    describe('authenticateUser', () => {
        let userId;

        beforeEach(async () => {
            const result = await authService.addUser(validEmail, validPassword);
            userId = result.userId;
        });

        it('should authenticate valid credentials', async () => {
            const result = await authService.authenticateUser(validEmail, validPassword);
            
            expect(result.success).toBe(true);
            expect(result.token).toBe(mockToken);
        });

        it('should reject invalid credentials', async () => {
            bcrypt.compare.mockResolvedValueOnce(false);
            
            const result = await authService.authenticateUser(validEmail, validPassword);
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid credentials');
        });

        it('should enforce rate limiting', async () => {
            bcrypt.compare.mockResolvedValue(false);
            
            for (let i = 0; i < 5; i++) {
                await authService.authenticateUser(validEmail, validPassword);
            }
            
            const result = await authService.authenticateUser(validEmail, validPassword);
            
            expect(result.success).toBe(false);
            expect(result.message).toContain('Too many ');
            expect(result.nextAttemptAt).toBeInstanceOf(Date);
        });

        it('should reject invalid input format', async () => {
            const result = await authService.authenticateUser('invalid-email', 'pass');
            
            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });

        it('should reset failed attempts after successful login', async () => {
            bcrypt.compare.mockResolvedValueOnce(false);
            await authService.authenticateUser(validEmail, validPassword);
            bcrypt.compare.mockResolvedValueOnce(true);
            
            const result = await authService.authenticateUser(validEmail, validPassword);
            
            expect(result.success).toBe(true);
            expect(authService.failedAttempts.get(validEmail)).toBeUndefined();
        });
    });

    describe('session management', () => {
        let userId;

        beforeEach(async () => {
            const result = await authService.addUser(validEmail, validPassword);
            userId = result.userId;
        });

        it('should create valid sessions', async () => {
            const result = await authService.authenticateUser(validEmail, validPassword);
            
            expect(result.token).toBe(mockToken);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
        });

        it('should reject expired sessions', () => {
            const token = authService.createSession(userId);
            
            const session = authService.sessions.get(token);
            session.expiresAt = new Date(Date.now() - 1000);
            
            const result = authService.validateSession(token);
            
            expect(result).toBe(false);
            expect(authService.sessions.has(token)).toBe(false);
        });

        it('should reject invalid tokens', () => {
            jwt.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });
            
            const result = authService.validateSession('invalid.token');
            
            expect(result).toBe(false);
        });
    });
});