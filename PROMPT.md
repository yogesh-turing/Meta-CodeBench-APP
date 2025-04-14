Base Code:
```javascript
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
    // TODO: Implement validation middleware
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
```

Prompt:

Please complete the `validationMiddleware` function.

- This is generic middleware that gets executed on all APIs.
- It should validate incoming HTTP request data (query parameters, request body, and URL parameters) against predefined schemas.
-  The middleware should sanitize and normalize the data, ensuring it is in the correct format for subsequent middleware and route handlers.

The function should fulfill the following points:

1. Validation of Request Data:
    - Query Parameters (req.query)
    - Request Body (req.body)
    - URL Parameters (req.params)
    - Use a Joi schema-based validation library to define and enforce validation rules.
2. Schema definition:
    - Each route should define its validation schema for query, body, and URL parameters.
    - The middleware should dynamically retrieve and apply the schema from the route configuration.
3. Data Normalization:
    - Normalize specific fields (e.g., email addresses) before validation:
        - Convert email addresses to lowercase.
        - Trim whitespace.
        - Replace spaces with + in email addresses.
    - Ensure the normalized data is passed to subsequent middleware or route handlers.
4. Error Handling:
    - If validation fails:
        - Respond with a 400 Bad Request status code.
        - Return the appropriate error message, which should mention this field having an issue.
5. After successful validation set the results `validation` object on the request object. The `req.validation` object may look like 
    {
        query: <Query validation results>,
        body: <Request body validation results>,
        params: <Request URL params validation results>
    }

Note: Please make sure to return the complete code.