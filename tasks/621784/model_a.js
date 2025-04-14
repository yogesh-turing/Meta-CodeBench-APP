const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5000;
let server, mongod, Ticket;
app.use(express.json());

const initializeModels = () => {
    const TicketSchema = new mongoose.Schema({
        title: { type: String, required: true, trim: true },
        description: { type: String, required: false, trim: true },
        status: { type: String, enum: ['open', 'in-progress', 'completed', 'closed'], default: 'open' },
        agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
        archived: { type: Boolean, default: false },
        history: [{ changedBy: { id: String, role: String }, from: String, to: String, changedAt: Date, description: String }],
        stats: {
            timeInOpenStatus: Number, timeInProgressStatus: Number, timeInCompletedStatus: Number, timeFromOpenToInProgress: Number,
            timeFromOpenToCompleted: Number, timeFromOpenToClosed: Number, timeFromInProgressToCompleted: Number, timeFromInProgressToClosed: Number, timeFromInCompletedToClosed: Number,
        }
    }, { timestamps: true });
    Ticket = mongoose.model('Ticket', TicketSchema);
};

const authMiddleware = (req, res, next) => {
    if (req.headers['x-user-id'] === 'admin') req.user = { id: 'admin', role: 'admin' };
    else if (req.headers['x-user-id'] === 'agent') req.user = { id: 'agent', role: 'agent' };
    else return res.status(403).json({ error: 'Access denied' });
    next();
}

const calculateTimeInStatus = (history, status) => {
    let totalTime = 0;
    const statusChanges = history.filter(h => h.from === status || h.to === status);
    
    for (let i = 0; i < statusChanges.length - 1; i += 2) {
        const start = new Date(statusChanges[i].changedAt);
        const end = statusChanges[i + 1] ? new Date(statusChanges[i + 1].changedAt) : new Date();
        totalTime += (end - start) / 1000;
    }
    
    if (statusChanges.length % 2 !== 0 && statusChanges[statusChanges.length - 1].to === status) {
        const start = new Date(statusChanges[statusChanges.length - 1].changedAt);
        totalTime += (new Date() - start) / 1000;
    }
    
    return Math.round(totalTime);
};

const calculateTransitionTime = (history, fromStatus, toStatus) => {
    const fromChange = history.find(h => h.from === fromStatus);
    const toChange = history.find(h => h.to === toStatus);
    
    if (!fromChange || !toChange) return 0;
    
    const startTime = new Date(fromChange.changedAt);
    const endTime = new Date(toChange.changedAt);
    return Math.round((endTime - startTime) / 1000);
};

const validateStatusTransition = (currentStatus, newStatus, userRole) => {
    const allowedTransitions = {
        'open': ['in-progress'],
        'in-progress': ['completed'],
        'completed': ['closed']
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
        return { valid: false, error: 'Invalid status transition' };
    }

    if (newStatus === 'closed' && userRole !== 'admin') {
        return { valid: false, error: 'Only admins can close tickets' };
    }

    return { valid: true };
};

const intializeRoutes = (routes) => {
    routes.forEach(route => {
        app[route.method](route.path, authMiddleware, route.handler);
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
                    ticket.history = [];
                    await ticket.save();
                    res.status(201).json(ticket);
                } catch (err) { res.status(500).json({ error: 'Server error' }); }
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
                } catch (err) { res.status(500).json({ error: 'Server error' }); }
            }
        },
        {
            path: '/api/tickets',
            method: 'get',
            handler: async (req, res) => {
                try {
                    const tickets = await Ticket.find();
                    res.status(200).json(tickets);
                } catch (err) { res.status(500).json({ error: 'Server error' }); }
            }
        },
        {
            path: '/api/tickets/:id/status',
            method: 'patch',
            handler: async (req, res) => {
                try {
                    const { id } = req.params;
                    const { status: newStatus } = req.body;
                    const user = req.user;

                    if (!mongoose.Types.ObjectId.isValid(id)) {
                        return res.status(400).json({ error: 'Invalid ticket ID' });
                    }

                    const ticket = await Ticket.findById(id);
                    if (!ticket) {
                        return res.status(404).json({ error: 'Ticket not found' });
                    }

                    if (ticket.archived) {
                        return res.status(400).json({ error: 'Cannot update archived ticket' });
                    }

                    if (ticket.status === newStatus) {
                        return res.status(400).json({ error: 'Ticket is already in this status' });
                    }

                    const validationResult = validateStatusTransition(ticket.status, newStatus, user.role);
                    if (!validationResult.valid) {
                        return res.status(400).json({ error: validationResult.error });
                    }

                    const currentDate = new Date();
                    const historyEntry = {
                        changedBy: { id: user.id, role: user.role },
                        from: ticket.status,
                        to: newStatus,
                        changedAt: currentDate,
                        description: `${user.role} changed status from ${ticket.status} to ${newStatus} at ${currentDate.toISOString()}`
                    };

                    ticket.history.push(historyEntry);
                    ticket.status = newStatus;

                    ticket.stats = {
                        timeInOpenStatus: calculateTimeInStatus(ticket.history, 'open'),
                        timeInProgressStatus: calculateTimeInStatus(ticket.history, 'in-progress'),
                        timeInCompletedStatus: calculateTimeInStatus(ticket.history, 'completed'),
                        timeFromOpenToInProgress: calculateTransitionTime(ticket.history, 'open', 'in-progress'),
                        timeFromOpenToCompleted: calculateTransitionTime(ticket.history, 'open', 'completed'),
                        timeFromOpenToClosed: calculateTransitionTime(ticket.history, 'open', 'closed'),
                        timeFromInProgressToCompleted: calculateTransitionTime(ticket.history, 'in-progress', 'completed'),
                        timeFromInProgressToClosed: calculateTransitionTime(ticket.history, 'in-progress', 'closed'),
                        timeFromInCompletedToClosed: calculateTransitionTime(ticket.history, 'completed', 'closed')
                    };

                    await ticket.save();
                    res.status(200).json(ticket);
                } catch (err) { res.status(500).json({ error: 'Server error' }); }
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
                } catch (err) { res.status(500).json({ error: 'Server error' }); }
            }
        }
    ];
    intializeRoutes(userRoutes);
};

const startServer = async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    initializeModels();
    initializeUserAPIs();
    server = app.listen(PORT);
};

const stopServer = async () => {
    if (server) await server.close(); 
    if (mongoose.connection.readyState) await mongoose.disconnect();
    if (mongod) await mongod.stop(); 
};

module.exports = { app, startServer, stopServer };