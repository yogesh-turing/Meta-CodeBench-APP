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
    const validationResults = {};
    const validationErrors = [];

    // Helper function to normalize email fields
    const normalizeEmail = (data) => {
        if (data && data.email) {
            data.email = data.email.toLowerCase().trim().replace(/\s+/g, '+');
        }
        return data;
    };

    // Helper function to validate data against schema
    const validateData = (data, schema, type) => {
        if (!schema || !data) return;

        const normalizedData = type === 'body' ? normalizeEmail(data) : data;
        const { error, value } = schema.validate(normalizedData, {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: false
        });

        if (error) {
            validationErrors.push(...error.details.map(detail => ({
                type,
                field: detail.path.join('.'),
                message: detail.message
            })));
        } else {
            validationResults[type] = value;
        }
    };

    // Validate query parameters
    if (route.validation.query) {
        validateData(req.query, Joi.object(route.validation.query), 'query');
    }

    // Validate request body
    if (route.validation.body) {
        validateData(req.body, Joi.object(route.validation.body), 'body');
    }

    // Validate URL parameters
    if (route.validation.params) {
        validateData(req.params, Joi.object(route.validation.params), 'params');
    }

    // Handle validation errors
    if (validationErrors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
        });
    }

    // Attach validation results to request object
    req.validation = validationResults;
    next();
};

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
