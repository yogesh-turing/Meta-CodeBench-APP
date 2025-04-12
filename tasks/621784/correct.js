const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5000;
let server;
let mongod;
let db;
let usersCollection;
let client;

app.use(express.json());

const initializeModels = async () => {
    usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
};

const intializeRoutes = (routes) => {
    routes.forEach(route => {
        app[route.method](route.path, route.handler);
    });
};

const initializeUserAPIs = () => {
    const userRoutes = [
        {
            path: '/api/users',
            method: 'post',
            handler: async (req, res) => {
                try {
                    if (!req.body.name || !req.body.email || !req.body.age) {
                        return res.status(400).json({ error: 'Missing required fields' });
                    }
                    const result = await usersCollection.insertOne(req.body);
                    if (result.insertedId) {
                        const user = await usersCollection.findOne({ _id: result.insertedId });
                        return res.status(201).json(user);
                    }
                    res.status(400).json({ error: 'User not created' });
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
                    const users = await usersCollection.find().toArray();
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
                    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
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
                    const result = await usersCollection.findOneAndUpdate(
                        { _id: new ObjectId(req.params.id) },
                        { $set: req.body },
                        { returnDocument: 'after' }
                    );
                    if (!result) return res.status(404).json({ error: 'User not found' });
                    res.json(result);
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
                    const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
                    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
                    res.json({ message: 'User deleted' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        },
        {
            path: '/api/users/:id/mfa/send',
            method: 'post',
            handler: async (req, res) => {
                // TODO: Implement MFA code sending logic
            }
        },
        {
            path: '/api/users/:id/mfa/verify',
            method: 'post',
            handler: async (req, res) => {
                // TODO: Implement MFA verification logic
            }
        }
    ];
    intializeRoutes(userRoutes);
};

const startServer = async () => {
    mongod = await MongoMemoryServer.create();
    client = new MongoClient(mongod.getUri());
    await client.connect();
    db = client.db();
    console.log('Connected to in-memory MongoDB');
    await initializeModels();
    initializeUserAPIs();
    server = app.listen(PORT);
};

const stopServer = async () => {
    if (server) await server.close();
    if (mongod) await mongod.stop();
    if (client) await client.close();
};

module.exports = { app, startServer, stopServer, db };