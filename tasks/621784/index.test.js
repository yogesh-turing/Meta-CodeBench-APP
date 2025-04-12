const request = require('supertest');
const { ObjectId } = require('mongodb');
const { app, startServer, stopServer } = require('./base');

let createdUserId;
let usersCollection;


beforeAll(async () => {
  const { db } = await startServer();
  usersCollection = db.collection('users');
});

afterAll(async () => {
  await stopServer();
});

describe('Users API', () => {

  test('Create a user - success', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com', age: 30 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Alice');
    createdUserId = res.body._id; // Store the created user ID for later tests
  });

  test('Create a user - missing fields', async () => {
    const res = await request(app).post('/api/users').send({ email: 'bob@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('Create a user - duplicate email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Duplicate', email: 'alice@example.com' });
    expect(res.status).toBe(400);
  });

  test('Get all users - success', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Get user by ID - success', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(createdUserId);
  });

  test('Get user by ID - invalid ID', async () => {
    const res = await request(app).get(`/api/users/invalid-id`);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('Get user by ID - non-existent', async () => {
    const res = await request(app).get(`/api/users/000000000000000000000000`);
    expect(res.status >= 400).toBe(true);
  });

  test('Update user - success', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({ name: 'Alice Updated' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice Updated');
  });

  test('Update user - invalid ID', async () => {
    const res = await request(app).put('/api/users/invalid-id').send({ name: 'Test' });
    expect(res.status).toBe(400);
  });

  test('Update user - non-existent', async () => {
    const res = await request(app)
      .put(`/api/users/000000000000000000000000`)
      .send({ name: 'Ghost' });
    expect(res.status >= 400).toBe(true);
  });

  test('Delete user - success', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });

  test('Delete user - already deleted', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.status).toBe(404);
  });

  test('Delete user - invalid ID', async () => {
    const res = await request(app).delete('/api/users/invalid-id');
    expect(res.status).toBe(500);
  });

  test('Send MFA code - success', async () => {
    const res = await request(app).post(`/api/users/${createdUserId}/mfa/send`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('MFA code sent');
    const user = await usersCollection.findOne({ _id: new ObjectId(createdUserId) });
    expect(user).toHaveProperty('mfaCode');
    expect(user).toHaveProperty('mfaExpiry');
    expect(user).toHaveProperty('verified', false);
  });

  test('Send MFA code - invalid user ID', async () => {
    const res = await request(app).post('/api/users/invalid-id/mfa/send');
    expect(res.status).toBe(500); // Invalid ObjectId format
    expect(res.body).toHaveProperty('error');
  });

  test('Send MFA code - non-existent user', async () => {
    const res = await request(app).post('/api/users/000000000000000000000000/mfa/send');
    expect(res.status).toBe(404); // User not found
    expect(res.body.error).toBe('User not found');
  });

  test('Send MFA code - user already has an active code', async () => {
    await request(app).post(`/api/users/${createdUserId}/mfa/send`);
    const res = await request(app).post(`/api/users/${createdUserId}/mfa/send`);
    expect(res.status).toBe(200); // Should still allow sending a new code
    expect(res.body.message).toBe('MFA code sent');
  });

  test('Send MFA code - missing user ID in URL', async () => {
    const res = await request(app).post('/api/users//mfa/send');
    expect(res.status).toBe(404); // Invalid route
  });

  test('Verify MFA code - success', async () => {
    const user = await usersCollection.findOne({ _id: new ObjectId(createdUserId) });
    const res = await request(app)
      .post(`/api/users/${createdUserId}/mfa/verify`)
      .send({ email: user.email, code: user.mfaCode });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User verified successfully');
  });

  test('Verify MFA code - invalid user ID', async () => {
    const res = await request(app)
      .post('/api/users/invalid-id/mfa/verify')
      .send({ email: 'test@example.com', code: '123456' });
    expect(res.status).toBe(500); // Invalid ObjectId format
    expect(res.body).toHaveProperty('error');
  });

  test('Verify MFA code - non-existent user', async () => {
    const res = await request(app)
      .post('/api/users/000000000000000000000000/mfa/verify')
      .send({ email: 'ghost@example.com', code: '123456' });
    expect(res.status).toBe(404); // User not found
    expect(res.body.error).toBe('User not found');
  });

  test('Verify MFA code - already verified', async () => {
    await request(app).post(`/api/users/${createdUserId}/mfa/send`);
    await request(app)
      .post(`/api/users/${createdUserId}/mfa/verify`)
      .send({ email: 'alice@example.com', code: '123456' });
    const res = await request(app)
      .post(`/api/users/${createdUserId}/mfa/verify`)
      .send({ email: 'alice@example.com', code: '123456' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('User already verified');
  });

  test('Verify MFA code - expired code', async () => {
    const user = await usersCollection.findOne({ _id: new ObjectId(createdUserId) });
    await usersCollection.updateOne(
      { _id: new ObjectId(createdUserId) },
      { $set: { mfaExpiry: Date.now() - 1000 } } // Set expiry in the past
    );
    const res = await request(app)
      .post(`/api/users/${createdUserId}/mfa/verify`)
      .send({ email: user.email, code: user.mfaCode });
    expect(res.status).toBe(410);
    expect(res.body.error).toBe('Code expired');
  });

  test('Verify MFA code - invalid code', async () => {
    const user = await usersCollection.findOne({ _id: new ObjectId(createdUserId) });
    const res = await request(app)
      .post(`/api/users/${createdUserId}/mfa/verify`)
      .send({ email: user.email, code: 'wrong-code' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid code');
  });

});