const request = require('supertest');
const mongoose = require('mongoose');
const { app, startServer, stopServer } = require('./model_a');

let createdTicketId;

beforeAll(async () => {
  await startServer();
});

afterAll(async () => {
  await stopServer();
  await mongoose.connection.close();
});

describe('Tickets API', () => {

  afterEach(() => {
    jest.useRealTimers();
  });

  // Test: Create a ticket
  test('Create a ticket - valid data', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'open',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Ticket');
    expect(response.body.description).toBe('This is a test ticket');
    createdTicketId = response.body._id;
  });

  test('Create a ticket - missing required fields', async () => {
    const response = await request(app).post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({});
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  test('Create a ticket - not authorized', async () => {
    const response = await request(app).post('/api/tickets')
      .set({ 'x-user-id': 'user' })
      .send({
        title: 'Unauthorized Ticket',
        description: 'This ticket should not be created',
        status: 'open',
      });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  // Test: Get a ticket by ID
  test('Get a ticket by ID - valid ID', async () => {
    const response = await request(app)
      .get(`/api/tickets/${createdTicketId}`)
      .set({ 'x-user-id': 'admin' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', createdTicketId);
  });

  test('Get a ticket by ID - invalid ID format', async () => {
    const response = await request(app).get('/api/tickets/invalid-id').set({ 'x-user-id': 'admin' });
    expect(response.status >= 400).toBe(true);
  });

  test('Get a ticket by ID - non-existent ID', async () => {
    const response = await request(app).get('/api/tickets/' + new mongoose.Types.ObjectId()).set({ 'x-user-id': 'admin' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Ticket not found');
  });

  test('Get a ticket by ID - not authorized', async () => {
    const response = await request(app)
      .get(`/api/tickets/${createdTicketId}`)
      .set({ 'x-user-id': 'user' });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  // Test: Get all tickets
  test('Get all tickets', async () => {
    const response = await request(app).get('/api/tickets').set({ 'x-user-id': 'admin' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Get all tickets - not authorized', async () => {
    const response = await request(app).get('/api/tickets').set({ 'x-user-id': 'user' });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  // Test: Update ticket status
  test('Update ticket status - valid data', async () => {
    const response = await request(app)
      .patch(`/api/tickets/${createdTicketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'in-progress' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'in-progress');
  });

  test('Update ticket status - invalid status', async () => {
    const response = await request(app)
      .patch(`/api/tickets/${createdTicketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'invalid-status' });
    expect(response.status).toBe(400);
  });

  test('Update ticket status - non-existent ticket', async () => {
    const response = await request(app)
      .patch(`/api/tickets/${new mongoose.Types.ObjectId()}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'in-progress' });
    expect(response.status).toBe(404);
  });

  test('Update ticket status - invalid ID format', async () => {
    const response = await request(app)
      .patch('/api/tickets/invalid-id/status')
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'in-progress' });
    expect(response.status).toBe(400);
  });

  test('Update ticket status - not authorized', async () => {
    const response = await request(app)
      .patch(`/api/tickets/${createdTicketId}/status`)
      .set({ 'x-user-id': 'user' })
      .send({ status: 'in-progress' });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });


  test('Update ticket status - only admin can close', async () => {
    // Create a new ticket
    const response = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'open',
      });
    const ticketId = response.body._id;

    // Attempt to close the ticket as a non-admin user
    const updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'user' })
      .send({ status: 'closed' });
    expect(updateResponse.status).toBe(403);
  });

  test('Update ticket status - ticket status transitions', async () => {
    // Create a new ticket
    const response = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'open',
      });
    const ticketId = response.body._id;

    // Update the ticket status to 'completed'
    let updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'completed' });
    expect(updateResponse.status).toBe(400);

    // Update the ticket status to 'closed'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'closed' });
    expect(updateResponse.status).toBe(400);

    // Update the ticket status to 'in-progress'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'in-progress' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('in-progress');

    // Update the ticket status to 'closed'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'closed' });
    expect(updateResponse.status).toBe(400);

    // Update the ticket status to 'completed'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'completed' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('completed');

    // Update the ticket status to 'closed'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'closed' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('closed');
  });

  test('Update ticket status - ticket history and stats check', async () => {
    // Create a new ticket
    const response = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'open',
      });
    const ticketId = response.body._id;

    // Update the ticket status to 'in-progress'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'in-progress' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('in-progress');

    // Update the ticket status to 'completed'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'completed' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('completed');

    // Update the ticket status to 'closed'
    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'closed' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('closed');

    ticketResponse = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set({ 'x-user-id': 'admin' });
    expect(ticketResponse.status).toBe(200);
    expect(ticketResponse.body.history).toHaveLength(3);
    expect(ticketResponse.body.history[0].from).toBe('open');
    expect(ticketResponse.body.history[0].to).toBe('in-progress');
    expect(ticketResponse.body.history[0].changedBy).toEqual({ id: 'admin', role: 'admin' });
    expect(ticketResponse.body.history[0].changedAt).toBeDefined();
    
    expect(ticketResponse.body.history[1].from).toBe('in-progress');
    expect(ticketResponse.body.history[1].to).toBe('completed');
    expect(ticketResponse.body.history[1].changedBy).toEqual({ id: 'admin', role: 'admin' });
    expect(ticketResponse.body.history[1].changedAt).toBeDefined();

    expect(ticketResponse.body.history[2].from).toBe('completed');
    expect(ticketResponse.body.history[2].to).toBe('closed');
    expect(ticketResponse.body.history[2].changedBy).toEqual({ id: 'admin', role: 'admin' });
    expect(ticketResponse.body.history[2].changedAt).toBeDefined();
    expect(ticketResponse.body.stats.timeFromOpenToInProgress > -1).toBe(true);
    expect(ticketResponse.body.stats.timeInOpenStatus > -1).toBe(true);
    expect(ticketResponse.body.stats.timeInProgressStatus > -1).toBe(true);
    expect(ticketResponse.body.stats.timeFromOpenToCompleted > -1).toBe(true);
    expect(ticketResponse.body.stats.timeFromInProgressToCompleted > -1).toBe(true);
    expect(ticketResponse.body.stats.timeFromOpenToClosed > -1).toBe(true);
    expect(ticketResponse.body.stats.timeFromInProgressToClosed > -1).toBe(true);
    expect(ticketResponse.body.stats.timeFromInCompletedToClosed > -1).toBe(true);

  });

  test('Update ticket status - agent cannot close', async () => {
    // Create a new ticket
    const response = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'open',
      });
    const ticketId = response.body._id;

    // Attempt to close the ticket as a non-admin user
    let updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'agent' })
      .send({ status: 'in-progress' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('in-progress');

    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'agent' })
      .send({ status: 'completed' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('completed');

    updateResponse = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'agent' })
      .send({ status: 'closed' });
    expect(updateResponse.status).toBe(403);
  });

  test('Update ticket status - same status', async () => {
    const response = await request(app)
      .patch(`/api/tickets/${createdTicketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'in-progress' });
    expect(response.status).toBe(400);
  });

  test('Update ticket status - open to close', async () => {
    // create a new ticket
    const createResponse = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'open',
      });
    const ticketId = createResponse.body._id;

    const response = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'closed' });
    expect(response.status).toBe(400);
  });

  test('Update ticket status - archived ticket', async () => {
    // Archive the ticket
    const deleteResponse = await request(app).delete(`/api/tickets/${createdTicketId}`).set({ 'x-user-id': 'admin' });
    expect(deleteResponse.status).toBe(204);

    const response = await request(app)
      .patch(`/api/tickets/${createdTicketId}/status`)
      .set({ 'x-user-id': 'admin' })
      .send({ status: 'in-progress' });
    expect(response.status >= 400).toBe(true);
  });

  // Test: Delete a ticket
  test('create a ticket for deletion', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Ticket to be deleted',
        description: 'This ticket will be deleted',
        status: 'open',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Ticket to be deleted');
    expect(response.body.description).toBe('This ticket will be deleted');
    createdTicketId = response.body._id;
  });

  test('Delete a ticket - valid ID', async () => {
    const response = await request(app).delete(`/api/tickets/${createdTicketId}`).set({ 'x-user-id': 'admin' });
    expect(response.status).toBe(204);
  });

  test('Delete a ticket - already deleted ticket', async () => {
    const response = await request(app).delete(`/api/tickets/${createdTicketId}`).set({ 'x-user-id': 'admin' });
    expect(response.status >= 400).toBe(true);
  });

  test('Delete a ticket - invalid ID format', async () => {
    const response = await request(app).delete('/api/tickets/invalid-id').set({ 'x-user-id': 'admin' });
    expect(response.status >= 400).toBe(true);
  });

  test('Delete a ticket - archived ticket', async () => {
    // Create a new ticket and archive it
    const ticketResponse = await request(app)
      .post('/api/tickets')
      .set({ 'x-user-id': 'admin' })
      .send({
        title: 'Archived Ticket',
        description: 'This ticket will be archived',
        status: 'open',
        archived: true,
      });
    const archivedTicketId = ticketResponse.body._id;

    const response = await request(app).delete(`/api/tickets/${archivedTicketId}`).set({ 'x-user-id': 'admin' });
    expect(response.status).toBe(400);
  });

  test('Delete a ticket - not authorized', async () => {
    const response = await request(app).delete(`/api/tickets/${createdTicketId}`).set({ 'x-user-id': 'user' });
    expect(response.status).toBe(403);
  });
});