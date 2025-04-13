const request = require('supertest');
const { default: mongoose } = require('mongoose');
const { app, startServer, stopServer } = require('./correct');
let createdUserId;

beforeAll(async () => {
  await startServer();
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
    expect(res.status >= 400).toBe(true);
    expect(res.body).toHaveProperty('error');
  });

  test('Get user by ID - non-existent', async () => {
    const res = await request(app).get(`/api/users/${new mongoose.Types.ObjectId()}`);
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
      .put(`/api/users/${new mongoose.Types.ObjectId()}`)
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
    expect(res.status >= 400).toBe(true);
  });

});

describe('Addresses API', () => {
  let userId;
  beforeAll(async () => {
    // Create a test user
    const userResponse = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: `john.doe${Date.now()}@example.com`,
        age: 30
      });
    userId = userResponse.body._id;
  });

  test('Add a new address - success', async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });

    expect(response.status).toBe(201);
    expect(response.body.addresses).toHaveLength(1);
    expect(response.body.addresses[0].isPrimary).toBe(true);
  });

  test('Add a new address - missing fields', async () => {
    // missing street field
    const response = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      });
    expect(response.status).toBe(400);

    // missing city field
    const response1 = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA'
      });

    expect(response1.status).toBe(400);

    // missing state field
    const response2 = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001'
      });
    expect(response2.status).toBe(400);

    // missing postalCode field
    const response3 = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA'
      });
    expect(response3.status).toBe(400);
  });

  test('Add a new address - invalid user ID', async () => {
    const response = await request(app)
      .post('/api/users/invalid-id/addresses')
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    expect(response.status >= 400).toBe(true);

    // non existence user ID
    const response1 = await request(app)
      .post(`/api/users/${new mongoose.Types.ObjectId()}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    expect(response1.status >= 400).toBe(true);
  });

  test('Add new address - Ensure only one primary address', async () => {
    // Add the first address
    await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });

    // Add a second address with isPrimary set to true
    const response = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        isPrimary: true
      });

    expect(response.status).toBe(201);
    const addresses = response.body.addresses;
    const primaryAddresses = addresses.filter(addr => addr.isPrimary);
    expect(primaryAddresses).toHaveLength(1);
    expect(primaryAddresses[0].street).toBe('456 Elm St');
  });

  test('Add new address - Set first address as primary if no other addresses exist', async () => {
    // Create a user
    const userResponse = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: `testuser${Date.now()}@example.com`,
        age: 25
      });
    const userId = userResponse.body._id;

    // Add the first address without explicitly setting isPrimary
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      });

    // Verify the response
    expect(addressResponse.status).toBe(201);
    expect(addressResponse.body.addresses).toHaveLength(1);
    expect(addressResponse.body.addresses[0].isPrimary).toBe(true); // First address should be primary
  });

  test('Update an address - success', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Update the address
    const response = await request(app)
      .put(`/api/users/${userId}/addresses/${addressId}`)
      .send({
        street: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        isPrimary: false
      });

    expect(response.status).toBe(200);
    expect(response.body.addresses[0].street).toBe('456 Elm St');
    expect(response.body.addresses[0].isPrimary).toBe(false);
  });

  test('Update an address - invalid address ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Update the address with an invalid ID
    const response = await request(app)
      .put(`/api/users/${userId}/addresses/invalid-id`)
      .send({
        street: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        isPrimary: false
      });
    expect(response.status >= 400).toBe(true);
  });

  test('Update an address - non-existent address ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Update the address with a non-existent ID
    const response = await request(app)
      .put(`/api/users/${userId}/addresses/${new mongoose.Types.ObjectId()}`)
      .send({
        street: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        isPrimary: false
      });
    expect(response.status >= 400).toBe(true);
  });

  test('Update an address - missing fields', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Update the address with missing fields
    const response = await request(app)
      .put(`/api/users/${userId}/addresses/${addressId}`)
      .send({
        street: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA'
      });
    expect(response.status).toBe(400);
  });

  test('Update an address - invalid user ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Update the address with an invalid user ID
    const response = await request(app)
      .put(`/api/users/invalid-id/addresses/${addressId}`)
      .send({
        street: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        isPrimary: false
      });
    expect(response.status >= 400).toBe(true);
  });

  test('Update an address - non-existent user ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    const response = await request(app)
      .put(`/api/users/${new mongoose.Types.ObjectId()}/addresses/${addressId}`)
      .send({
        street: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        isPrimary: false
      });
    expect(response.status >= 400).toBe(true);
  });

  test('Delete an address - success', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Delete the address
    const response = await request(app)
      .delete(`/api/users/${userId}/addresses/${addressId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Address deleted');
  });

  test('Delete an address - invalid address ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Delete the address with an invalid ID
    const response = await request(app)
      .delete(`/api/users/${userId}/addresses/invalid-id`);

    expect(response.status >= 400).toBe(true);
  })

  test('Delete an address - non-existent address ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Delete the address with a non-existent ID
    const response = await request(app)
      .delete(`/api/users/${userId}/addresses/${new mongoose.Types.ObjectId()}`);

    expect(response.status >= 400).toBe(true);
  });

  test('Delete an address - invalid user ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Delete the address with an invalid user ID
    const response = await request(app)
      .delete(`/api/users/invalid-id/addresses/${addressId}`);

    expect(response.status >= 400).toBe(true);
  });

  test('Delete an address - non-existent user ID', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Delete the address with a non-existent user ID
    const response = await request(app)
      .delete(`/api/users/${new mongoose.Types.ObjectId()}/addresses/${addressId}`);

    expect(response.status >= 400).toBe(true);
  });

  test('Delete an address - already deleted', async () => {
    // Add an address first
    const addressResponse = await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });
    addressId = addressResponse.body.addresses[0]._id;

    // Delete the address
    await request(app).delete(`/api/users/${userId}/addresses/${addressId}`);

    // Try to delete the same address again
    const response = await request(app).delete(`/api/users/${userId}/addresses/${addressId}`);
    expect(response.status).toBe(404);
  });

  test('Delete an address - Set first address as primary or handle no addresses left', async () => {
    // Create a user
    const userResponse = await request(app)
        .post('/api/users')
        .send({
            name: 'Test User',
            email: `testuser${Date.now()}@example.com`,
            age: 25
        });
    expect(userResponse.status).toBe(201);
    const userId = userResponse.body._id;

    // Add two addresses
    const addressResponse1 = await request(app)
        .post(`/api/users/${userId}/addresses`)
        .send({
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            isPrimary: true
        });
    expect(addressResponse1.status).toBe(201);
    expect(addressResponse1.body.addresses).toHaveLength(1);
    const addressId1 = addressResponse1.body.addresses[0]._id;

    const addressResponse2 = await request(app)
        .post(`/api/users/${userId}/addresses`)
        .send({
            street: '456 Elm St',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'USA',
            isPrimary: false
        });
    expect(addressResponse2.status).toBe(201);
    expect(addressResponse2.body.addresses).toHaveLength(2);
    expect(addressResponse2.body.addresses[0].isPrimary).toBe(true);
    expect(addressResponse2.body.addresses[1].isPrimary).toBe(false);
    const addressId2 = addressResponse2.body.addresses[1]._id;

    // Delete the primary address
    const deleteResponse1 = await request(app)
        .delete(`/api/users/${userId}/addresses/${addressId1}`);
    expect(deleteResponse1.status).toBe(200);

    // Verify the second address is now primary
    const userAfterFirstDelete = await request(app).get(`/api/users/${userId}`);
    expect(userAfterFirstDelete.status).toBe(200);
    expect(userAfterFirstDelete.body.addresses).toHaveLength(1);
    expect(userAfterFirstDelete.body.addresses[0].isPrimary).toBe(true);

    // Delete the remaining address
    const deleteResponse2 = await request(app)
        .delete(`/api/users/${userId}/addresses/${addressId2}`);
    expect(deleteResponse2.status).toBe(200);

    // Verify no addresses are left
    const userAfterSecondDelete = await request(app).get(`/api/users/${userId}`);
    expect(userAfterSecondDelete.status).toBe(200);
    expect(userAfterSecondDelete.body.addresses).toHaveLength(0);
});

  test('Get user with addresses - success', async () => {
    // Add an address
    await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });

    // Retrieve the user with addresses
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.addresses.length).toBeGreaterThan(0);
  });

  test('Get users with addresses - success', async () => {
    // Add an address
    await request(app)
      .post(`/api/users/${userId}/addresses`)
      .send({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isPrimary: true
      });

    // Retrieve all users with addresses
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const users = response.body;
    const userWithAddresses = users.find(user => user._id.toString() === userId.toString());
    expect(userWithAddresses).toBeDefined();
    expect(userWithAddresses.addresses.length).toBeGreaterThan(0);
  });
});