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
    const AddressSchema = new mongoose.Schema({
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        isPrimary: { type: Boolean, default: false }
    });

    const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: Number,
        addresses: [AddressSchema]
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
                    const users = await User.find().populate('addresses');
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
                    const user = await User.findById(req.params.id).populate('addresses');
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
                    const user = await User.findById(req.params.id);
                    if (!user) return res.status(404).json({ error: 'User not found' });

                    const { street, city, state, postalCode, country, isPrimary } = req.body;
                    if (!street || !city || !state || !postalCode || !country) {
                        return res.status(400).json({ error: 'All address fields are required' });
                    }

                    if (isPrimary) {
                        user.addresses.forEach(address => address.isPrimary = false);
                    } else if (user.addresses.length === 0) {
                        req.body.isPrimary = true; // Set the first address as primary
                    }

                    user.addresses.push(req.body);
                    await user.save();
                    res.status(201).json(user);
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
                    const user = await User.findById(req.params.id);
                    if (!user) return res.status(404).json({ error: 'User not found' });

                    const address = user.addresses.id(req.params.addressId);
                    if (!address) return res.status(404).json({ error: 'Address not found' });

                    const { street, city, state, postalCode, country, isPrimary } = req.body;
                    if (!street || !city || !state || !postalCode || !country) {
                        return res.status(400).json({ error: 'All address fields are required' });
                    }

                    if (isPrimary) {
                        user.addresses.forEach(addr => addr.isPrimary = false);
                    }

                    Object.assign(address, req.body);
                    await user.save();
                    res.json(user);
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
                    let user = await User.findById(req.params.id);
                    if (!user) return res.status(404).json({ error: 'User not found' });

                    const address = user.addresses.id(req.params.addressId);
                    if (!address) return res.status(404).json({ error: 'Address not found' });

                    await User.updateOne(
                        { _id: req.params.id },
                        { $pull: { addresses: { _id: req.params.addressId } } }
                    );
                    user = await User.findById(req.params.id); // Refresh user data
                    if (address.isPrimary && user.addresses.length > 0) {
                        user.addresses[0].isPrimary = true; // Set the first address as primary if it was the only one
                    } else if (user.addresses.length === 0) {
                        user.isPrimary = false; // No addresses left, set primary to false
                    }
                    await user.save();
                    res.json({ message: 'Address deleted' });
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
