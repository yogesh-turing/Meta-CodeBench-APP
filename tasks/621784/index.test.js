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

describe('Tickets API', () => {

  // title: String,
  //         description: String,
  //         status: {
  //           type: String,
  //           enum: ['open', 'in-progress', 'closed'],
  //           default: 'open'
  //         },
  //         agentId: {
  //           type: mongoose.Schema.Types.ObjectId,
  //           ref: 'User',
  //           required: false
  //         },
  //         archived: {
  //           type: Boolean,
  //           default: false
  //         }

  test('Create a ticket', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: 'open'
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Ticket');
    expect(response.body.description).toBe('This is a test ticket');
  }  );


});
