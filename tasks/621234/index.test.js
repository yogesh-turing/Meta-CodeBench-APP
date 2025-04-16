const fs = require('fs');
const request = require('supertest');
const { app } = require('./base'); 

const API_KEY = 'abcd-1234-xyzx'; // Same API key as in the app
const INVALID_API_KEY = 'wrong-api-key'; // Invalid API key for testing

describe('Crypto Wallet Management API', () => {
    let userId, walletId;

    beforeAll(async () => {
        // API_KEY="abcd-1234-xyzx"
        // create .env file on the root directory and add the API_KEY variable
        const envs = [
            "ENCRYPTION_KEY=\"0123456789abcdef0123456789abcdef\"",
            "ENCRYPTION_IV=\"abcdef9876543210\"",
            "IV=\"abcdef9876543210\"",
            "API_KEY=\"abcd-1234-xyzx\"",
            "API_KEYS=\"abcd-1234-xyzx\"",
            "VALID_API_KEYS=\"abcd-1234-xyzx\"",
        ]
        fs.writeFileSync('.env', envs.join('\n'), 'utf8');
    });

    afterAll(async () => {
        // Clean up the .env file after tests
        // fs.unlinkSync('.env');
    });

    // Test creating a new user and wallet
    it('should create a new user and wallet', async () => {
        const response = await request(app)
            .post('/users')
            .set('x-api-key', API_KEY)
            .send({
                userId: 'user1',
                username: 'TestUser',
                password: 'password123',
                email: 'testuser@example.com',
            });

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('userId', 'user1');
        expect(response.body.wallet).toHaveProperty('id');

        userId = response.body.user.userId;
        walletId = response.body.wallet.id;
    });

    // Test creating a user with missing fields
    it('should return 400 for missing user fields', async () => {
        const response = await request(app)
            .post('/users')
            .set('x-api-key', API_KEY)
            .send({
                username: 'IncompleteUser',
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    // Test creating a user that already exists
    it('should return 400 for duplicate user', async () => {
        const response = await request(app)
            .post('/users')
            .set('x-api-key', API_KEY)
            .send({
                userId: 'user1',
                username: 'TestUser',
                password: 'password123',
                email: 'testuser@example.com',
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User already exists');
    });

    // Test creating a user with invalid API key
    it('should return 403 for invalid API key', async () => {
        const response = await request(app)
            .post('/users')
            .set('x-api-key', INVALID_API_KEY)
            .send({
                userId: 'user1',
                username: 'TestUser',
                password: 'password123',
                email: 'testuser@example.com',
            });
        expect(response.status).toBe(403);
    });

    // Test retrieving all users
    it('should retrieve all users', async () => {
        const response = await request(app)
            .get('/users')
            .set('x-api-key', API_KEY);

        expect(response.status).toBe(200);
        expect(response.body.users).toBeInstanceOf(Array);
        expect(response.body.users.length).toBeGreaterThan(0);
        expect(response.body.users[0]).toHaveProperty('userId');
    });

    // Test retrieving a user by ID
    it('should retrieve a user by ID', async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .set('x-api-key', API_KEY);

        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('userId', userId);
        expect(response.body.wallet).toHaveProperty('id', walletId);
    });

    // Test retrieving a non-existent user
    it('should return 404 for non-existent user', async () => {
        const response = await request(app)
            .get('/users/nonexistent')
            .set('x-api-key', API_KEY);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    // Test retrieving a user with invalid API key
    it('should return 403 for invalid API key', async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .set('x-api-key', INVALID_API_KEY);
        expect(response.status).toBe(403);
    });


    it('should credit funds to a user\'s wallet', async () => {
        const response = await request(app)
            .post('/wallets/credit')
            .set('x-api-key', API_KEY)
            .send({
                userId: userId,
                amount: 100,
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Funds credited successfully');
        expect(response.body.wallet).toHaveProperty('id', walletId);
        expect(response.body.wallet).toHaveProperty('balance', 100);
    });

    it('should return 400 for invalid input (negative amount)', async () => {
        const response = await request(app)
            .post('/wallets/credit')
            .set('x-api-key', API_KEY)
            .send({
                userId: userId,
                amount: -50,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid input. User ID and positive amount are required.');
    });

    it('should return 400 for invalid input (missing amount)', async () => {
        const response = await request(app)
            .post('/wallets/credit')
            .set('x-api-key', API_KEY)
            .send({
                userId: userId,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid input. User ID and positive amount are required.');
    });

    it('should return 404 for non-existent user wallet', async () => {
        const response = await request(app)
            .post('/wallets/credit')
            .set('x-api-key', API_KEY)
            .send({
                userId: 'nonexistentUser',
                amount: 100,
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Wallet not found for the specified user.');
    });

    it('should return 403 for invalid API key', async () => {
        const response = await request(app)
            .post('/wallets/credit')
            .set('x-api-key', INVALID_API_KEY)
            .send({
                userId: userId,
                amount: 100,
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Forbidden: Invalid API Key');
    });


    // Test creating a transaction
    it('should create a transaction between users', async () => {
        // Create a recipient user
        const recipientResponse = await request(app)
            .post('/users')
            .set('x-api-key', API_KEY)
            .send({
                userId: 'user2',
                username: 'RecipientUser',
                password: 'password123',
                email: 'recipient@example.com',
            });

        const recipientId = recipientResponse.body.user.userId;

        // Fund the sender's wallet using the new API
        const fundResponse = await request(app)
            .post('/wallets/credit')
            .set('x-api-key', API_KEY)
            .send({
                userId: userId,
                amount: 100, // Add 100 to the sender's wallet balance
            });

        expect(fundResponse.status).toBe(200);
        expect(fundResponse.body.message).toBe('Funds credited successfully');
        expect(fundResponse.body.wallet).toHaveProperty('balance', 200);

        // Create a transaction
        const transactionResponse = await request(app)
            .post('/transactions')
            .set('x-api-key', API_KEY)
            .send({
                sender: userId,
                recipient: recipientId,
                amount: 50,
            });

        expect(transactionResponse.status).toBe(200);
        expect(transactionResponse.body.message).toBe('Transaction completed');
        expect(transactionResponse.body.transaction).toHaveProperty('amount', 50);
    });

    // Test creating a transaction with insufficient balance
    it('should return 400 for insufficient balance', async () => {
        const response = await request(app)
            .post('/transactions')
            .set('x-api-key', API_KEY)
            .send({
                sender: userId,
                recipient: 'user2',
                amount: 200,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Insufficient balance');
    });

    // Test creating a transaction with invalid sender
    it('should return 404 for invalid sender', async () => {
        const response = await request(app)
            .post('/transactions')
            .set('x-api-key', API_KEY)
            .send({
                sender: 'nonexistent',
                recipient: 'user2',
                amount: 50,
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Sender wallet not found');
    });

    // Test creating a transaction with invalid recipient
    it('should return 404 for invalid recipient', async () => {
        const response = await request(app)
            .post('/transactions')
            .set('x-api-key', API_KEY)
            .send({
                sender: userId,
                recipient: 'nonexistent',
                amount: 50,
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Recipient wallet not found');
    });

    // Test creating a transaction with invalid amount
    it('should return 400 for invalid amount', async () => {
        const response = await request(app)
            .post('/transactions')
            .set('x-api-key', API_KEY)
            .send({
                sender: userId,
                recipient: 'user2',
                amount: -50,
            });

        expect(response.status).toBe(400);
    }
    );

    // Test creating a transaction with missing fields 
    it('should return 400 for missing fields', async () => {
        const response = await request(app)
            .post('/transactions')
            .set('x-api-key', API_KEY)
            .send({
                sender: userId,
                amount: 50,
            });

        expect(response.status).toBe(400);
    });

    // Test creating a transaction with invalid API key
    test('should return 403 for invalid API key', async () => {
        const response = await request(app)
            .post('/transactions')
            .set('x-api-key', INVALID_API_KEY)
            .send({
                sender: userId,
                recipient: 'user2',
                amount: 50,
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Forbidden: Invalid API Key');
    }
    );

    // Test retrieving all wallets
    it('should retrieve all wallets', async () => {
        const response = await request(app)
            .get('/wallets')
            .set('x-api-key', API_KEY);

        expect(response.status).toBe(200);
        expect(response.body.wallets).toBeInstanceOf(Array);
        expect(response.body.wallets.length).toBeGreaterThan(0);
        expect(response.body.wallets[0]).toHaveProperty('id');
    });

    // Test retrieving all wallets with invalid API key
    it('should return 403 for invlid API key', async () => {
        const response = await request(app)
            .get('/wallets')
            .set('x-api-key', INVALID_API_KEY); // Set an invalid API key

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Forbidden: Invalid API Key');
    });

    // Test API key authentication
    it('should return 403 for invalid API key', async () => {
        const response = await request(app)
            .get('/users')
            .set('x-api-key', INVALID_API_KEY);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Forbidden: Invalid API Key');
    });

    it('should delete a user and their wallet successfully', async () => {
        // Create a new user to delete
        const createResponse = await request(app)
            .post('/users')
            .set('x-api-key', API_KEY)
            .send({
                userId: 'userToDelete',
                username: 'UserToDelete',
                password: 'password123',
                email: 'deleteuser@example.com',
            });

        expect(createResponse.status).toBe(201);
        const userIdToDelete = createResponse.body.user.userId;

        // Delete the user
        const deleteResponse = await request(app)
            .delete(`/users/${userIdToDelete}`)
            .set('x-api-key', API_KEY);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('User and wallet deleted successfully');

        // Verify the user is deleted
        const getUserResponse = await request(app)
            .get(`/users/${userIdToDelete}`)
            .set('x-api-key', API_KEY);

        expect(getUserResponse.status).toBe(404);
        expect(getUserResponse.body.error).toBe('User not found');
    });

    it('should return 404 for deleting a non-existent user', async () => {
        const response = await request(app)
            .delete('/users/nonexistentUser')
            .set('x-api-key', API_KEY);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    it('should return 403 for invalid API key', async () => {
        const response = await request(app)
            .delete('/users/user1')
            .set('x-api-key', INVALID_API_KEY);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Forbidden: Invalid API Key');
    });

    it('should handle deleting a user without an associated wallet gracefully', async () => {
        // Create a user without a wallet
        const createResponse = await request(app)
            .post('/users')
            .set('x-api-key', API_KEY)
            .send({
                userId: 'userWithoutWallet',
                username: 'UserWithoutWallet',
                password: 'password123',
                email: 'nowallet@example.com',
            });

        expect(createResponse.status).toBe(201);
        const userIdWithoutWallet = createResponse.body.user.userId;

        // Delete the user
        const deleteResponse = await request(app)
            .delete(`/users/${userIdWithoutWallet}`)
            .set('x-api-key', API_KEY);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('User and wallet deleted successfully');
    });

});