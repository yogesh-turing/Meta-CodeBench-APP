const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Joi = require('joi');

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
        age: Number,
    }, { timestamps: true });

    User = mongoose.model('User', UserSchema);
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

const validationMiddleware = (route, req, res, next) => {
    try {
        const validationObject = {};
        const validationErrors = [];

        // Normalize and validate query parameters
        if (route.validation.query && Object.keys(req.query).length) {
            const normalizedQuery = { ...req.query };
            if (normalizedQuery.email) {
                normalizedQuery.email = normalizedQuery.email
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '+');
            }
            const { error, value } = route.validation.query.validate(normalizedQuery, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                validationErrors.push(...error.details.map(err => ({
                    type: 'query',
                    field: err.path.join('.'),
                    message: err.message
                })));
            } else {
                validationObject.query = value;
            }
        }

        // Normalize and validate request body
        if (route.validation.body && Object.keys(req.body).length) {
            const normalizedBody = { ...req.body };
            if (normalizedBody.email) {
                normalizedBody.email = normalizedBody.email
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '+');
            }
            const { error, value } = route.validation.body.validate(normalizedBody, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                validationErrors.push(...error.details.map(err => ({
                    type: 'body',
                    field: err.path.join('.'),
                    message: err.message
                })));
            } else {
                validationObject.body = value;
            }
        }

        // Validate URL parameters
        if (route.validation.params && Object.keys(req.params).length) {
            const { error, value } = route.validation.params.validate(req.params, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                validationErrors.push(...error.details.map(err => ({
                    type: 'params',
                    field: err.path.join('.'),
                    message: err.message
                })));
            } else {
                validationObject.params = value;
            }
        }

        // Handle validation errors
        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationErrors
            });
        }

        // Attach validated and normalized data to request object
        req.validation = validationObject;
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error during validation',
            message: error.message
        });
    }
};

module.exports = { validationMiddleware };
const JoiObjectID = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const VALIDATIONS = {
    POST_USERS: {
        body: {
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            age: Joi.number().optional()
        }
    },
    GET_USERS: {
        query: {
            name: Joi.string().optional(),
            email: Joi.string().optional().email(),
            age: Joi.number().optional()
        }
    },
    GET_USER: {
        params: {
            id: JoiObjectID.required()
        }
    },
    PATCH_USER: {
        params: {
            id: JoiObjectID.required()
        },
        body: {
            name: Joi.string().optional(),
            email: Joi.string().optional().email(),
            age: Joi.number().optional()
        }
    },
    DELETE_USER: {
        params: {
            id: JoiObjectID.required()
        }
    },
}

const initializeUserAPIs = () => {
    const userRoutes = [
        {
            path: '/api/users',
            method: 'post',
            validation: VALIDATIONS.POST_USERS,
            handler: async (req, res) => {
                try {
                    const user = await User.create(req.validation.body);
                    res.status(201).json(user);
                } catch (error) {
                    res.status(400).json({ error: error.message });
                }
            }
        },
        {
            path: '/api/users',
            method: 'get',
            validation: VALIDATIONS.GET_USERS,
            handler: async (req, res) => {
                try {
                    const query = req.validation.query || {};
                    const filter = {};
                    if (query.name) filter.name = query.name;
                    if (query.email) filter.email = query.email;
                    if (query.age) filter.age = query.age;

                    const users = await User.find(filter);
                    res.json(users);
                } catch (error) {
                    res.status(400).json({ error: error.message });
                }
            }
        },
        {
            path: '/api/users/:id',
            method: 'get',
            validation: VALIDATIONS.GET_USER,
            handler: async (req, res) => {
                try {
                    const id = req.validation.params.id;
                    const user = await User.findById(id);
                    if (!user) return res.status(404).json({ error: 'User not found' });
                    res.json(user);
                } catch (error) {
                    res.status(400).json({ error: error.message });
                }
            }
        },
        {
            path: '/api/users/:id',
            method: 'patch',
            validation: VALIDATIONS.PATCH_USER,
            handler: async (req, res) => {
                try {
                    const id = req.validation.params.id;
                    const body = req.validation.body;
                    const updated = await User.findByIdAndUpdate(id, body, {
                        new: true,
                        runValidators: true,
                    });
                    if (!updated) return res.status(404).json({ error: 'User not found' });
                    res.json(updated);
                } catch (error) {
                    res.status(400).json({ error: error.message });
                }
            }
        },
        {
            path: '/api/users/:id',
            method: 'delete',
            validation: VALIDATIONS.DELETE_USER,
            handler: async (req, res) => {
                try {
                    const id = req.validation.params.id;
                    const deleted = await User.findByIdAndDelete(id);
                    if (!deleted) return res.status(404).json({ error: 'User not found' });
                    res.json({ message: 'User deleted' });
                } catch (error) {
                    res.status(400).json({ error: error.message });
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
