const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5000;
let server;
let mongod;
let User;
app.use(express.json());

const initializeModels = () => {
    const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: Number
    }, { timestamps: true });

    User = mongoose.model('User', UserSchema);
};

const intializeRoutes = (routes) => {
    routes.forEach(route => {
        app[route.method](route.path, route.handler);
    });
}

const initializeUserAPIs = () => {
    const userRoutes = [
        {
            path: '/api/users',
            method: 'post',
            handler: async (req, res) => {
                try {
                    const user = await User.create(req.body);
                    res.status(201).json(user);
                } catch (err) {
                    res.status(400).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users',
            method: 'get',
            handler: async (req, res) => {
                try {
                    const users = await User.find();
                    res.json(users);
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users/:id',
            method: 'get',
            handler: async (req, res) => {
                try {
                    const user = await User.findById(req.params.id);
                    if (!user) return res.status(404).json({ error: 'User not found' });
                    res.json(user);
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users/:id',
            method: 'put',
            handler: async (req, res) => {
                try {
                    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                        runValidators: true,
                    });
                    if (!updated) return res.status(404).json({ error: 'User not found' });
                    res.json(updated);
                } catch (err) {
                    res.status(400).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users/:id',
            method: 'delete',
            handler: async (req, res) => {
                try {
                    const deleted = await User.findByIdAndDelete(req.params.id);
                    if (!deleted) return res.status(404).json({ error: 'User not found' });
                    res.json({ message: 'User deleted' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users/:id/addresses',
            method: 'post',
            handler: async (req, res) => {
                try {
                    // TODO: Implement address creation logic
                } catch (err) {
                    res.status(400).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users/:id/addresses/:addressId',
            method: 'put',
            handler: async (req, res) => {
                try {
                    // TODO: Implement address creation logic
                } catch (err) {
                    res.status(400).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users/:id/addresses/:addressId',
            method: 'delete',
            handler: async (req, res) => {
                try {
                    // TODO: Implement address creation logic
                } catch (err) {
                    res.status(400).json({ error: err.message });
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
