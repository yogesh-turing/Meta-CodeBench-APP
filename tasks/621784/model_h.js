const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 5000;
let server, mongod, User;
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
            (req, res) => {
                try {
                    route.handler(req, res);
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            });
    });
}

const validationMiddleware = (route, req, res, next) => {
    const { query, body, params } = route.validation;

    const normalizeData = (data) => {
        if (data.email) {
            data.email = data.email.trim().toLowerCase().replace(/\s/g, '+');
        }
        return data;
    };

    const validate = (data, schema) => {
        if (!schema) return { value: data };
        return schema.validate(data, { abortEarly: false });
    };

    const validationResults = {
        query: validate(normalizeData(req.query), query),
        body: validate(normalizeData(req.body), body),
        params: validate(req.params, params)
    };

    const errors = [];
    for (const key in validationResults) {
        if (validationResults[key].error) {
            validationResults[key].error.details.forEach(detail => {
                errors.push(`${key}: ${detail.message}`);
            });
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    req.validation = {
        query: validationResults.query.value,
        body: validationResults.body.value,
        params: validationResults.params.value
    };

    next();
}

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
                const user = await User.create(req.validation.body);
                res.status(201).json(user);
            }
        },
        {
            path: '/api/users',
            method: 'get',
            validation: VALIDATIONS.GET_USERS,
            handler: async (req, res) => {
                const query = req.validation.query || {};
                const filter = {};
                if (query.name) filter.name = query.name;
                if (query.email) filter.email = query.email;
                if (query.age) filter.age = query.age;

                const users = await User.find(filter);
                res.json(users);
            }
        },
        {
            path: '/api/users/:id',
            method: 'get',
            validation: VALIDATIONS.GET_USER,
            handler: async (req, res) => {
                const id = req.validation.params.id;
                const user = await User.findById(id);
                if (!user) return res.status(404).json({ error: 'User not found' });
                res.json(user);
            }
        },
        {
            path: '/api/users/:id',
            method: 'patch',
            validation: VALIDATIONS.PATCH_USER,
            handler: async (req, res) => {
                const id = req.validation.params.id;
                const body = req.validation.body;
                const updated = await User.findByIdAndUpdate(id, body, {
                    new: true,
                    runValidators: true,
                });
                if (!updated) return res.status(404).json({ error: 'User not found' });
                res.json(updated);
            }
        },
        {
            path: '/api/users/:id',
            method: 'delete',
            validation: VALIDATIONS.DELETE_USER,
            handler: async (req, res) => {
                const id = req.validation.params.id;
                const deleted = await User.findByIdAndDelete(id);
                if (!deleted) return res.status(404).json({ error: 'User not found' });
                res.json({ message: 'User deleted' });
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