const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5000;
let server;
let mongod;
let User, Role;
app.use(express.json());

const initializeModels = () => {
    const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: Number,
    }, { timestamps: true });

    User = mongoose.model('User', UserSchema);

    const RoleSchema = new mongoose.Schema({
        name: { type: String, required: true },
        permissions: [String],
    }, { timestamps: true });

    Role = mongoose.model('Role', RoleSchema);
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
        }
    ];
    intializeRoutes(userRoutes);
};

const initializeRoleAPIs = () => {
    const roleRoutes = [
        {
            path: '/api/roles',
            method: 'post',
            handler: async (req, res) => {
                try {
                    const role = await Role.create(req.body);
                    res.status(201).json(role);
                } catch (err) {
                    res.status(400).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/roles',
            method: 'get',
            handler: async (req, res) => {
                try {
                    const roles = await Role.find();
                    res.json(roles);
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/roles/:id',
            method: 'get',
            handler: async (req, res) => {
                try {
                    const role = await Role.findById(req.params.id);
                    if (!role) return res.status(404).json({ error: 'Role not found' });
                    res.json(role);
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/roles/:id',
            method: 'put',
            handler: async (req, res) => {
                try {
                    const updated = await Role.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                        runValidators: true,
                    });
                    if (!updated) return res.status(404).json({ error: 'Role not found' });
                    res.json(updated);
                } catch (err) {
                    res.status(400).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/roles/:id',
            method: 'delete',
            handler: async (req, res) => {
                try {
                    const deleted = await Role.findByIdAndDelete(req.params.id);
                    if (!deleted) return res.status(404).json({ error: 'Role not found' });
                    res.json({ message: 'Role deleted' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        }
    ];

    intializeRoutes(roleRoutes);

}

const startServer = async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('Connected to in-memory MongoDB');
    initializeModels();
    initializeUserAPIs();
    initializeRoleAPIs();
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
