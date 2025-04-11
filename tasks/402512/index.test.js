const request = require('supertest');
const mongoose = require('mongoose');
const { app, startServer, stopServer } = require('./model_f');

let createdUserId;

beforeAll(async () => {
  await startServer();
});

afterAll(async () => {
  await stopServer();
});

describe('Roles API', () => {
    test('Create a role - success', async () => {
      const res = await request(app)
        .post('/api/roles')
        .send({ name: 'Admin', permissions: ['read', 'write', 'delete'] });
  
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Admin');
      createdRoleId = res.body._id;
    });
  
    test('Create a role - missing fields', async () => {
      const res = await request(app).post('/api/roles').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  
    test('Get all roles', async () => {
      const res = await request(app).get('/api/roles');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  
    test('Get role by ID - success', async () => {
      const res = await request(app).get(`/api/roles/${createdRoleId}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(createdRoleId);
    });
  
    test('Get role by ID - invalid ID', async () => {
      const res = await request(app).get('/api/roles/invalid-id');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  
    test('Get role by ID - non-existent', async () => {
      const res = await request(app).get('/api/roles/000000000000000000000000');
      expect(res.status >= 400).toBe(true);
    });
  
    test('Update role - success', async () => {
      const res = await request(app)
        .put(`/api/roles/${createdRoleId}`)
        .send({ name: 'Admin Updated' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Admin Updated');
    });
  
    test('Update role - invalid ID', async () => {
      const res = await request(app).put('/api/roles/invalid-id').send({ name: 'Test' });
      expect(res.status).toBe(400);
    });
  
    test('Update role - non-existent', async () => {
      const res = await request(app)
        .put('/api/roles/000000000000000000000000')
        .send({ name: 'Ghost' });
      expect(res.status >= 400).toBe(true);
    });
  
    test('Delete role - success', async () => {
      const res = await request(app).delete(`/api/roles/${createdRoleId}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Role deleted');
    });
  
    test('Delete role - already deleted', async () => {
      const res = await request(app).delete(`/api/roles/${createdRoleId}`);
      expect(res.status).toBe(404);
    });
  
    test('Delete role - invalid ID', async () => {
      const res = await request(app).delete('/api/roles/invalid-id');
      expect(res.status).toBe(500);
    });
  });


  describe('Users API', () => {

    let createdRoleId;

    test('Create a user - success', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Alice', email: 'alice@example.com', age: 30 });
  
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Alice');
      createdUserId = res.body._id;
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

    test('Create a user - with invalid role', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: 'Bob',
                email: 'bob@example.com',
                role_id: 'invalid-role-id',
            })
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('Create a user - with not existing role', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: 'Bob',
                email: 'bob@example.com',
                role_id: new mongoose.Types.ObjectId().toString(),
            })
        // status 404 or 400
        expect(res.status >= 400).toBe(true);
    });

    test('Create a user - with valid role', async () => {
        const res = await request(app)
            .post('/api/roles')
            .send({ name: 'User', permissions: ['read'] });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        const roleId = res.body._id;
        createdRoleId = roleId;
        const userRes = await request(app)
            .post('/api/users')
            .send({
                name: 'Bob',
                email: 'bob@example.com',
                role_id: roleId,
            })
        expect(userRes.status).toBe(201);
        expect(userRes.body).toHaveProperty('_id');
        expect(userRes.body.role._id).toBe(roleId);

        // get all users and check if the user is created with the correct role
        const allUsersRes = await request(app).get('/api/users');
        expect(allUsersRes.status).toBe(200);
        expect(Array.isArray(allUsersRes.body)).toBe(true);
        expect(allUsersRes.body.length).toBeGreaterThan(0);

        // get user by ID and check if the user is created with the correct role
        const userByIdRes = await request(app).get(`/api/users/${userRes.body._id}`);
        expect(userByIdRes.status).toBe(200);
        expect(userByIdRes.body._id).toBe(userRes.body._id);
        expect(userByIdRes.body.role._id).toBe(roleId);
        expect(userByIdRes.body.name).toBe('Bob');
        expect(userByIdRes.body.role.name).toBe('User');
        expect(userByIdRes.body.role.permissions).toEqual(['read']);
    });
  
    test('Get all users', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test('Get all users - with invalid role_id', async () => {
        const res = await request(app).get('/api/users?role_id=invalid-role-id');
        expect(res.status).toBe(400);
    });

    test('Get all users - with valid role_id', async () => {
        const res = await request(app).get(`/api/users?role_id=${createdRoleId}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].role._id).toBe(createdRoleId);
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

    test('Update user - with invalid role', async () => {
        const res = await request(app)
            .put(`/api/users/${createdUserId}`)
            .send({
                name: 'Bob',
                role_id: 'invalid-role-id',
            })
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('Update user - with not existing role', async () => {
        const res = await request(app)
            .put(`/api/users/${createdUserId}`)
            .send({
                name: 'Bob',
                role_id: new mongoose.Types.ObjectId().toString(),
            })
        expect(res.status >= 400).toBe(true);
    });

    test('Update user - with valid role', async () => {

        // create new role
        const res = await request(app)
            .post('/api/roles')
            .send({ name: 'Admin', permissions: ['read', 'write', 'delete'] });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');

        const roleId = res.body._id;
        createdRoleId = roleId;
        const userRes = await request(app)
            .put(`/api/users/${createdUserId}`)
            .send({
                name: 'Bob',
                role_id: roleId,
            })
        expect(userRes.status).toBe(200);
        expect(userRes.body).toHaveProperty('_id');
        expect(userRes.body.role._id).toBe(roleId);
        expect(userRes.body.name).toBe('Bob');
        expect(userRes.body.role.name).toBe('Admin');
        expect(userRes.body.role.permissions).toEqual(['read', 'write', 'delete']);

        // get all users and check if the user is updated with the correct role
        const allUsersRes = await request(app).get('/api/users');
        expect(allUsersRes.status).toBe(200);
        expect(Array.isArray(allUsersRes.body)).toBe(true);
        expect(allUsersRes.body.length).toBeGreaterThan(0);
        expect(allUsersRes.body[0].role._id).toBe(roleId);
        expect(allUsersRes.body[0].name).toBe('Bob');

        // get user by ID and check if the user is updated with the correct role
        const userByIdRes = await request(app).get(`/api/users/${createdUserId}`);
        expect(userByIdRes.status).toBe(200);
        expect(userByIdRes.body._id).toBe(createdUserId);
        expect(userByIdRes.body.role._id).toBe(roleId);
        expect(userByIdRes.body.name).toBe('Bob');
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
  });