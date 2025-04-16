require('dotenv').config();
const express = require('express');
const { configureStore, createSlice } = require('@reduxjs/toolkit');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const crypto = require('crypto');

// Middleware for API Key Authentication
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !process.env.VALID_API_KEYS.split(',').includes(apiKey)) {
        return res.status(403).send({ error: USER_MESSAGES.API_KEY_INVALID });
    }
    next();
};

// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: USER_MESSAGES.INTERNAL_SERVER_ERROR });
};

// Encryption/Decryption Utilities
const algorithm = 'aes-256-ctr';
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrypted.toString();
};

// Redux Toolkit Slices
const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        createUser: (state, action) => { state.push(action.payload); },
        deleteUser: (state, action) => {
            const index = state.findIndex(user => user.userId === action.payload);
            if (index !== -1) state.splice(index, 1);
        }
    }
});

const walletsSlice = createSlice({
    name: 'wallets',
    initialState: [],
    reducers: {
        createWallet: (state, action) => { state.push(action.payload); },
        updateWallet: (state, action) => {
            const index = state.findIndex(wallet => wallet.id === action.payload.id);
            if (index !== -1) state[index] = { ...state[index], ...action.payload };
        },
        deleteWallet: (state, action) => {
            const index = state.findIndex(wallet => wallet.id === action.payload);
            if (index !== -1) state.splice(index, 1);
        }
    }
});

// Configure Redux Store
const store = configureStore({
    reducer: {
        users: usersSlice.reducer,
        wallets: walletsSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

// Validation Schemas
const UserSchema = Joi.object({
    userId: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
});

const TransactionSchema = Joi.object({
    sender: Joi.string().required(),
    recipient: Joi.string().required(),
    amount: Joi.number().positive().required(),
    date: Joi.date().default(Date.now),
    status: Joi.string().valid('pending', 'completed', 'failed').default('pending'),
});

// User Messages
const USER_MESSAGES = {
    API_KEY_INVALID: 'Forbidden: Invalid API Key',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    WALLET_NOT_FOUND: 'Wallet not found',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_INPUT: 'Invalid input. User ID and positive amount are required.',
};

// Express Application Setup
const app = express();
app.use(express.json());
app.use(apiKeyAuth);

// API Endpoints
app.post('/users', (req, res) => {
    const { userId, username, password, email } = req.body;
    const { error } = UserSchema.validate({ userId, username, password, email });
    if (error) return res.status(400).send({ error: error.details[0].message });

    if (store.getState().users.find(user => user.userId === userId)) {
        return res.status(400).send({ error: USER_MESSAGES.USER_EXISTS });
    }

    const encryptedPassword = encrypt(password);
    store.dispatch(usersSlice.actions.createUser({ userId, username, password: encryptedPassword, email }));

    const walletName = `${username}'s Wallet`;
    const privateKey = uuidv4();
    const encryptedPrivateKey = encrypt(privateKey);
    store.dispatch(walletsSlice.actions.createWallet({
        id: uuidv4(),
        name: walletName,
        privateKey: encryptedPrivateKey,
        balance: 0,
        transactions: [],
        userId,
    }));

    res.status(201).send({
        message: 'User and wallet created',
        user: { userId, username, email },
        wallet: { id: uuidv4(), name: walletName },
    });
});

app.post('/transactions', (req, res) => {
    const { sender, recipient, amount } = req.body;
    const { error } = TransactionSchema.validate({ sender, recipient, amount });
    if (error) return res.status(400).send({ error: error.details[0].message });

    const senderWallet = store.getState().wallets.find(wallet => wallet.userId === sender);
    const recipientWallet = store.getState().wallets.find(wallet => wallet.userId === recipient);

    if (!senderWallet) return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    if (!recipientWallet) return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });

    if (senderWallet.balance < amount) return res.status(400).send({ error: USER_MESSAGES.INSUFFICIENT_BALANCE });

    const updatedSenderWallet = {
        ...senderWallet,
        balance: senderWallet.balance - amount,
        transactions: [...senderWallet.transactions, { sender, recipient, amount, date: new Date(), status: 'completed' }],
    };
    const updatedRecipientWallet = {
        ...recipientWallet,
        balance: recipientWallet.balance + amount,
        transactions: [...recipientWallet.transactions, { sender, recipient, amount, date: new Date(), status: 'completed' }],
    };

    store.dispatch(walletsSlice.actions.updateWallet(updatedSenderWallet));
    store.dispatch(walletsSlice.actions.updateWallet(updatedRecipientWallet));

    res.send({
        message: 'Transaction completed',
        transaction: { sender, recipient, amount, date: new Date(), status: 'completed' },
    });
});

app.get('/users', (req, res) => {
    res.send({ users: store.getState().users });
});

app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const user = store.getState().users.find(u => u.userId === userId);
    if (!user) return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });

    const userWallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    res.send({ user, wallet: userWallet });
});

app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;
    if (store.getState().users.findIndex(user => user.userId === userId) === -1) {
        return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });
    }

    store.dispatch(usersSlice.actions.deleteUser(userId));
    const walletIndex = store.getState().wallets.findIndex(wallet => wallet.userId === userId);
    if (walletIndex !== -1) {
        store.dispatch(walletsSlice.actions.deleteWallet(store.getState().wallets[walletIndex].id));
    }

    res.send({ message: 'User and wallet deleted successfully' });
});

app.get('/wallets', (req, res) => {
    const wallets = store.getState().wallets.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        privateKey: decrypt(wallet.privateKey),
        balance: wallet.balance,
        transactions: wallet.transactions,
    }));
    res.send({ wallets });
});

app.post('/wallets/credit', (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || !amount || amount <= 0) {
        return res.status(400).send({ error: USER_MESSAGES.INVALID_INPUT });
    }

    const wallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    if (!wallet) return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });

    const updatedWallet = { ...wallet, balance: wallet.balance + amount };
    store.dispatch(walletsSlice.actions.updateWallet(updatedWallet));

    res.status(200).send({
        message: 'Funds credited successfully',
        wallet: {
            id: updatedWallet.id,
            userId: updatedWallet.userId,
            balance: updatedWallet.balance,
        },
    });
});

app.use(errorHandler);

module.exports = {
    app,
};