const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 5000;
let server;
let mongod;
let Ticket;
app.use(express.json());

const initializeModels = () => {
    Ticket = new mongoose.Schema({
        title: String,
        description: String,
        status: {
          type: String,
          enum: ['open', 'in-progress', 'closed'],
          default: 'open'
        },
        agentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: false
        },
        archived: {
          type: Boolean,
          default: false
        }
      }, { timestamps: true });
      
    module.exports = mongoose.model('Ticket', Ticket);
};

const intializeRoutes = (routes) => {
    routes.forEach(route => {
        app[route.method](
            route.path, 
            (req, res, next) => route.validation ? validationMiddleware(route, req, res, next) : next(),
            route.handler
        );
    });
}



const initializeUserAPIs = () => {
    const userRoutes = [
        {
            path: '/api/tickets',
            method: 'post',
            handler: async (req, res) => {
                try {
                    const ticket = await Ticket.create(req.body);
                    await ticket.save();
                    res.status(201).json(ticket);
                } catch (err) {
                res.status(500).json({ error: 'Server error' });
                }
            }
        }
    ];
    intializeRoutes(userRoutes);
};

const startServer = async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('Connected to in-memory MongoDB');
    initializeModels();
    initializeUserAPIs();
    server = app.listen(PORT);
};

const stopServer = async () => {
    if (server) await server.close(); 
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    if (mongod) await mongod.stop(); 
};

module.exports = { app, startServer, stopServer };
