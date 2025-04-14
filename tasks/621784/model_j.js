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
    const validation = {};
    const { validation: schemas } = route;

    // Normalize email if present
    const normalizeEmail = email => 
        email.toLowerCase().trim().replace(/\s/g, '+');

    // Validate query parameters
    if (schemas.query) {
        const querySchema = Joi.object(schemas.query);
        const { error, value } = querySchema.validate(req.query, { convert: true });
        if (error) {
            return res.status(400).json({ error: `Query: ${error.details[0].message}` });
        }
        validation.query = value;
    }

    // Validate URL parameters
    if (schemas.params) {
        const paramsSchema = Joi.object(schemas.params);
        const { error, value } = paramsSchema.validate(req.params, { convert: true });
        if (error) {
            return res.status(400).json({ error: `Params: ${error.details[0].message}` });
        }
        validation.params = value;
    }

    // Validate request body
    if (schemas.body) {
        const bodySchema = Joi.object(schemas.body);
        const body = req.body;

        // Normalize email in the body if present
        if (body.email) {
            body.email = normalizeEmail(body.email);
        }

        const { error, value } = bodySchema.validate(body, { convert: true });
        if (error) {
            return res.status(400).json({ error: `Body: ${error.details[0].message}` });
        }
        validation.body = value;
    }

    req.validation = validation;
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