Base Code:
```javascript
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

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 mins

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
                try {
                    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
                    if (!user) return res.status(404).json({ error: 'User not found' });

                    const code = generateCode();
                    const expiry = Date.now() + CODE_EXPIRY_MS;

                    await usersCollection.updateOne(
                        { _id: new ObjectId(req.params.id) },
                        { $set: { mfaCode: code, mfaExpiry: expiry, verified: false } }
                    );

                    res.json({ message: 'MFA code sent' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
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
    db = client.db('testdb');
    console.log('Connected to in-memory MongoDB');
    await initializeModels();
    initializeUserAPIs();
    server = app.listen(PORT);
    return { server, db }
};

const stopServer = async () => {
    if (server) await server.close();
    if (mongod) await mongod.stop();
    if (client) await client.close();
};

module.exports = { app, startServer, stopServer };
```

Prompt:

Please help to complete the MFA APIs.
1. MFA Code Sending API (POST /api/users/:id/mfa/send)
    The API should
        - Generate a 6-digit MFA code.
        - Set an expiry time for the code (e.g., 5 minutes from the current time).
        - Save the code, expiry time, and set verified to false in the user's record.
        - Check if the user exists by id. If the user does not exist, return a 404 Not Found error with the message "User not found".
        - On success, return a 200 OK status with the message "MFA code sent".
2. MFA Code Verification API (POST /api/users/:id/mfa/verify)
    The API should
        - Accept the Payload with following fields:
            email: (string) User's email address.
            code: (string) The MFA code sent to the user.
        - Validate the provided email and code.
        - Check if the user exists by id and email.
        - If the user is already verified, return an error.
        - If the code is expired, return an error.
        - If the code does not match, return an error.
        - If all validations pass, update the user:
            - Set mfaCode and mfaExpiry to null.
            - Set verified to true.
            - Add a verified_at field with the current timestamp
        - If the user does not exist, return a 404 Not Found error with the message "User not found".
        - If the user is already verified, return a 400 Bad Request error with the message "User already verified".
        - If the code is expired, return a 410 Gone error with the message "Code expired".
        - If the code is invalid, return a 401 Unauthorized error with the message "Invalid code".
        - On success, return a 200 OK status with the message "User verified successfully".
