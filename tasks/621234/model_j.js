require('dotenv').config();
const express = require('express');
const { configureStore, createSlice } = require('@reduxjs/toolkit');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const crypto = require('crypto');

// Environment Variables
const API_KEYS = [process.env.API_KEY];

// Encryption/Decryption Utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV = process.env.IV;

const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'base64'), Buffer.from(IV, 'base64'));
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

const decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'base64'), Buffer.from(IV, 'base64'));
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// User and Wallet Slices
const userSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        createUser(state, action) {
            state.push(action.payload);
        },
        deleteUser(state, action) {
            return state.filter(user => user.userId !== action.payload);
        }
    }
});

const walletSlice = createSlice({
    name: 'wallets',
    initialState: [],
    reducers: {
        createWallet(state, action) {
            state.push(action.payload);
        },
        updateWallet(state, action) {
            const index = state.findIndex(wallet => wallet.id === action.payload.id);
            if (index !== -1) {
                state[index] = { ...state[index], ...action.payload };
            }
        },
        deleteWallet(state, action) {
            return state.filter(wallet => wallet.id !== action.payload);
        }
    }
});

// Configure Store
const store = configureStore({
    reducer: {
        users: userSlice.reducer,
        wallets: walletSlice.reducer
    }
});

// Middleware
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!API_KEYS.includes(apiKey)) {
        return res.status(403).send({ error: USER_MESSAGES.API_KEY_INVALID });
    }
    next();
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
};

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

// Server setup
const app = express();
app.use(express.json());
app.use(apiKeyMiddleware);

// USER_MESSAGES for error handling
const USER_MESSAGES = {
    API_KEY_INVALID: 'Forbidden: Invalid API Key',
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    WALLET_NOT_FOUND: 'Wallet not found',
    INSUFFICIENT_FUNDS: 'Insufficient balance',
    INVALID_INPUT: 'Invalid input. User ID and positive amount are required.',
    FUNDS_CREDITED: 'Funds credited successfully',
    TRANSACTION_COMPLETED: 'Transaction completed',
    INVALID_KEY: 'Forbidden: Invalid API Key'
};

// API Routes
app.post('/users', (req, res) => {
    const { userId, username, password, email } = req.body;
    const { error } = UserSchema.validate({ userId, username, password, email });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    if (store.getState().users.find((user) => user.userId === userId)) {
        return res.status(400).send({ error: USER_MESSAGES.USER_EXISTS });
    }
    const encryptedPassword = encrypt(password);
    store.dispatch(userSlice.actions.createUser({ userId, username, password: encryptedPassword, email }));
    const walletName = `${username}'s Wallet`;
    const privateKey = uuidv4();
    const encryptedPrivateKey = encrypt(privateKey);
    store.dispatch(walletSlice.actions.createWallet({
        id: uuidv4(),
        name: walletName,
        privateKey: encryptedPrivateKey,
        balance: 0,
        transactions: [],
        userId
    }));
    res.status(201).send({
        message: 'User and wallet created',
        user: { userId, username, email },
        wallet: { id: uuidv4(), name: walletName }
    });
});

app.post('/transactions', (req, res) => {
    const { sender, recipient, amount } = req.body;
    const { error } = TransactionSchema.validate({ sender, recipient, amount });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    const senderWallet = store.getState().wallets.find(wallet => wallet.userId === sender);
    const recipientWallet = store.getState().wallets.find(wallet => wallet.userId === recipient);
    if (!senderWallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }
    if (!recipientWallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }
    if (senderWallet.balance < amount) {
        return res.status(400).send({ error: USER_MESSAGES.INSUFFICIENT_FUNDS });
    }
    store.dispatch(walletSlice.actions.updateWallet({
        ...senderWallet,
        balance: senderWallet.balance - amount,
        transactions: [...senderWallet.transactions, { sender, recipient, amount, date: new Date(), status: 'completed' }]
    }));
    store.dispatch(walletSlice.actions.updateWallet({
        ...recipientWallet,
        balance: recipientWallet.balance + amount,
        transactions: [...recipientWallet.transactions, { sender, recipient, amount, date: new Date(), status: 'completed' }]
    }));
    res.send({
        message: USER_MESSAGES.TRANSACTION_COMPLETED,
        transaction: { sender, recipient, amount, date: new Date(), status: 'completed' }
    });
});

app.get('/users', (req, res) => {
    res.send({ users: store.getState().users });
});

app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const user = store.getState().users.find(user => user.userId === userId);
    if (!user) {
        return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });
    }
    const userWallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    res.send({ user, wallet: userWallet });
});

app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;
    if (!store.getState().users.find(user => user.userId === userId)) {
        return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });
    }
    store.dispatch(userSlice.actions.deleteUser(userId));
    const wallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    if (wallet) {
        store.dispatch(walletSlice.actions.deleteWallet(wallet.id));
    }
    res.send({ message: 'User and wallet deleted successfully' });
});

app.get('/wallets', (req, res) => {
    const wallets = store.getState().wallets.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        privateKey: decrypt(wallet.privateKey),
        balance: wallet.balance,
        transactions: wallet.transactions
    }));
    res.send({ wallets });
});

app.post('/wallets/credit', (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || !amount || amount <= 0) {
        return res.status(400).send({ error: USER_MESSAGES.INVALID_INPUT });
    }
    const wallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    if (!wallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }
    store.dispatch(walletSlice.actions.updateWallet({ ...wallet, balance: wallet.balance + amount }));
    res.status(200).send({
        message: USER_MESSAGES.FUNDS_CREDITED,
        wallet: {
            id: wallet.id,
            userId: wallet.userId,
            balance: wallet.balance + amount
        }
    });
});

app.use(errorHandler);

module.exports = {
    app,
};