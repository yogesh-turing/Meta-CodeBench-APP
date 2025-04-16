const express = require('express');
const { configureStore, createSlice } = require('@reduxjs/toolkit');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const crypto = require('crypto');
require('dotenv').config();

// Security constants
const VALID_API_KEYS = [process.env.API_KEY];

// Encryption/Decryption utilities
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Must be 32 bytes
const IV = Buffer.from(process.env.IV, 'hex'); // Must be 16 bytes

const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Redux Toolkit slices
const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        createUser: (state, action) => {
            state.push(action.payload);
        },
        deleteUser: (state, action) => {
            return state.filter(user => user.userId !== action.payload);
        }
    }
});

const walletsSlice = createSlice({
    name: 'wallets',
    initialState: [],
    reducers: {
        createWallet: (state, action) => {
            state.push(action.payload);
        },
        updateWallet: (state, action) => {
            const index = state.findIndex(wallet => wallet.id === action.payload.id);
            if (index !== -1) {
                state[index] = { ...state[index], ...action.payload };
            }
        },
        deleteWallet: (state, action) => {
            return state.filter(wallet => wallet.id !== action.payload);
        }
    }
});

// Configure Redux store
const store = configureStore({
    reducer: {
        users: usersSlice.reducer,
        wallets: walletsSlice.reducer
    }
});

// Middleware for API key authentication
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!VALID_API_KEYS.includes(apiKey)) {
        return res.status(403).send({ error: USER_MESSAGES.API_KEY_INVALID });
    }
    next();
};

// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
};

// Validation schemas
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

const USER_MESSAGES = {
    API_KEY_INVALID: 'Forbidden: Invalid API Key',
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    WALLET_NOT_FOUND: 'Wallet not found for the specified user.',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_INPUT: 'Invalid input. User ID and positive amount are required.',
    FUNDS_CREDITED: 'Funds credited successfully',
    TRANSACTION_COMPLETED: 'Transaction completed',
    USER_AND_WALLET_DELETED: 'User and wallet deleted successfully'
};

// Server setup
const app = express();
app.use(express.json());
app.use(apiKeyAuth);

// Create a new user and wallet
app.post('/users', (req, res) => {
    const { userId, username, password, email } = req.body;

    const { error } = UserSchema.validate({ userId, username, password, email });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    if (store.getState().users.find((user) => user.userId === userId)) {
        return res.status(400).send({ error: USER_MESSAGES.USER_EXISTS });
    }

    const newUser = { userId, username, password: encrypt(password), email };
    store.dispatch(usersSlice.actions.createUser(newUser));

    const walletName = `${username}'s Wallet`;
    const privateKey = uuidv4();
    const encryptedPrivateKey = encrypt(privateKey);
    const newWallet = {
        id: uuidv4(),
        name: walletName,
        privateKey: encryptedPrivateKey,
        balance: 0,
        transactions: [],
        userId,
    };
    store.dispatch(walletsSlice.actions.createWallet(newWallet));

    res.status(201).send({
        message: 'User and wallet created',
        user: { userId, username, email },
        wallet: { id: newWallet.id, name: newWallet.name },
    });
});

// Create a transaction between users
app.post('/transactions', (req, res) => {
    const { sender, recipient, amount } = req.body;

    const { error } = TransactionSchema.validate({ sender, recipient, amount });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    const senderWallet = store.getState().wallets.find((wallet) => wallet.userId === sender);
    const recipientWallet = store.getState().wallets.find((wallet) => wallet.userId === recipient);

    if (!senderWallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }
    if (!recipientWallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }

    if (senderWallet.balance < amount) {
        return res.status(400).send({ error: USER_MESSAGES.INSUFFICIENT_BALANCE });
    }

    const updatedSenderWallet = {
        ...senderWallet,
        balance: senderWallet.balance - amount,
        transactions: [
            ...senderWallet.transactions,
            { sender, recipient, amount, date: new Date(), status: 'completed' },
        ],
    };
    const updatedRecipientWallet = {
        ...recipientWallet,
        balance: recipientWallet.balance + amount,
        transactions: [
            ...recipientWallet.transactions,
            { sender, recipient, amount, date: new Date(), status: 'completed' },
        ],
    };

    store.dispatch(walletsSlice.actions.updateWallet(updatedSenderWallet));
    store.dispatch(walletsSlice.actions.updateWallet(updatedRecipientWallet));

    res.send({
        message: USER_MESSAGES.TRANSACTION_COMPLETED,
        transaction: { sender, recipient, amount, date: new Date(), status: 'completed' },
    });
});

// Get all users
app.get('/users', (req, res) => {
    res.send({ users: store.getState().users });
});

// Get user by ID
app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;

    const user = store.getState().users.find((u) => u.userId === userId);

    if (!user) {
        return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });
    }

    const userWallet = store.getState().wallets.find((wallet) => wallet.userId === userId);
    res.send({ user, wallet: userWallet });
});

// Delete a user
app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;

    const userIndex = store.getState().users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
        return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });
    }
    store.dispatch(usersSlice.actions.deleteUser(userId));

    const walletIndex = store.getState().wallets.findIndex((wallet) => wallet.userId === userId);
    if (walletIndex !== -1) {
        store.dispatch(walletsSlice.actions.deleteWallet(store.getState().wallets[walletIndex].id));
    }

    res.send({ message: USER_MESSAGES.USER_AND_WALLET_DELETED });
});

// Get all wallets
app.get('/wallets', (req, res) => {
    const wallets = store.getState().wallets.map((wallet) => ({
        id: wallet.id,
        name: wallet.name,
        privateKey: decrypt(wallet.privateKey),
        balance: wallet.balance,
        transactions: wallet.transactions,
    }));
    res.send({ wallets });
});

// Credit funds to a user's wallet
app.post('/wallets/credit', (req, res) => {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
        return res.status(400).send({ error: USER_MESSAGES.INVALID_INPUT });
    }

    const wallet = store.getState().wallets.find((wallet) => wallet.userId === userId);
    if (!wallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }

    const updatedWallet = { ...wallet, balance: wallet.balance + amount };
    store.dispatch(walletsSlice.actions.updateWallet(updatedWallet));

    res.status(200).send({
        message: USER_MESSAGES.FUNDS_CREDITED,
        wallet: {
            id: updatedWallet.id,
            userId: updatedWallet.userId,
            balance: updatedWallet.balance,
        },
    });
});

// Error handling middleware
app.use(errorHandler);

module.exports = {
    app,
};