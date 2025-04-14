const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5000;
let server;
let mongod;
let Ticket;
app.use(express.json());

const initializeModels = () => {
    const TicketSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: false,
            trim: true
        },
        status: {
          type: String,
          enum: ['open', 'in-progress', 'completed', 'closed'],
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
        },
        history: [{
            changedBy: {
                id: String,
                role: String
            },
            from: String,
            to: String,
            changedAt: Date
          }],
        stats: {
            timeInOpenStatus: Number,
            timeInProgressStatus: Number,
            timeInCompletedStatus: Number,
            timeFromOpenToInProgress: Number,
            timeFromOpenToCompleted: Number,
            timeFromOpenToClosed: Number,
            timeFromInProgressToCompleted: Number,
            timeFromInProgressToClosed: Number,
            timeFromInCompletedToClosed: Number
        }
      }, { timestamps: true });
      
      Ticket = mongoose.model('Ticket', TicketSchema);
};

const authMiddleware = (req, res, next) => {
    if (req.headers['x-user-id'] === 'admin') {
        req.user = { id: 'admin', role: 'admin' };
    } else if (req.headers['x-user-id'] === 'agent') {
        req.user = { id: 'agent', role: 'agent' };
    } else {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}

const intializeRoutes = (routes) => {
    routes.forEach(route => {
        app[route.method](
            route.path, 
            authMiddleware,
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
                    ticket.stats = {
                        timeInOpenStatus: 0,
                        timeInProgressStatus: 0,
                        timeInCompletedStatus: 0,
                        timeFromOpenToInProgress: 0,
                        timeFromOpenToCompleted: 0,
                        timeFromOpenToClosed: 0,
                        timeFromInProgressToCompleted: 0,
                        timeFromInProgressToClosed: 0,
                        timeFromInCompletedToClosed: 0
                    };
                    await ticket.save();
                    res.status(201).json(ticket);
                } catch (err) {
                res.status(500).json({ error: 'Server error' });
                }
            }
        },
        {
            path: '/api/tickets/:id',
            method: 'get',
            handler: async (req, res) => {
                try {
                    const ticket = await Ticket.findById(req.params.id);
                    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
                    res.status(200).json(ticket);
                } catch (err) {
                    res.status(500).json({ error: 'Server error' });
                }
            }
        },
        {
            path: '/api/tickets',
            method: 'get',
            handler: async (req, res) => {
                try {
                    const tickets = await Ticket.find();
                    res.status(200).json(tickets);
                } catch (err) {
                    res.status(500).json({ error: 'Server error' });
                }
            }
        },
        {
            path: '/api/tickets/:id/status',
            method: 'patch',
            handler: async (req, res) => {
                try {
                    const { id } = req.params;
                    const { status } = req.body;
                    const user = req.user;
                    // TODO:
                    // 1. Validate ObjectId
                    // 2. Joi validate status
                    // 3. Fetch ticket and reject if archived or not found
                    // 4. Reject invalid transition (e.g. open -> closed)
                    // 5. Only admin can close
                    // 6. Prevent same-status updates
                    // 7. Save new status and push history
                    // 8. Return updated ticket
                    res.status(200).json({ message: 'Ticket status updated' });
                } catch (err) {
                    res.status(500).json({ error: 'Server error' });
                }
            }
        },
        {
            path: '/api/tickets/:id',
            method: 'delete',
            handler: async (req, res) => {
                try {
                    const { id } = req.params;
                    const ticket = await Ticket.findById(id);
                    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
                    if (ticket.archived) return res.status(400).json({ error: 'Cannot delete archived ticket' });
                    await Ticket.updateOne({ _id: id }, { archived: true });
                    res.status(204).send();
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