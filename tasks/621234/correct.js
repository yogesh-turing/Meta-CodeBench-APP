const express = require('express');
const { configureStore, createSlice } = require('@reduxjs/toolkit');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const Joi = require('joi');
const crypto = require('crypto');
dotenv.config(); // Load environment variables from .env file

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || 'a'.repeat(32), 'utf8');
const IV_LENGTH = 16;
const VALID_API_KEYS =  (process.env.API_KEY || 'abcd-1234-xyzx').split(',');

// Utility functions for encryption and decryption
const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

// Middleware for API key authentication
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!VALID_API_KEYS.includes(apiKey)) {
        return res.status(403).send({ error: 'Forbidden: Invalid API Key' });
    }
    next();
};

// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        error: err.message || 'Internal Server Error',
    });
};

// Redux Toolkit slices
const walletsSlice = createSlice({
    name: 'wallets',
    initialState: [],
    reducers: {
        createWallet: (state, action) => {
            state.push(action.payload);
        },
        updateWallet: (state, action) => {
            const index = state.findIndex((wallet) => wallet.id === action.payload.id);
            if (index !== -1) {
                state[index] = { ...state[index], ...action.payload };
            }
        },
        deleteWallet: (state, action) => {
            return state.filter((wallet) => wallet.id !== action.payload);
        },
    },
});

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        createUser: (state, action) => {
            state.push(action.payload);
        },
        deleteUser: (state, action) => {
            return state.filter((user) => user.userId !== action.payload);
        },
    },
});

// Configure Redux store
const store = configureStore({
    reducer: {
        wallets: walletsSlice.reducer,
        users: usersSlice.reducer,
    },
});

// Server setup
const app = express();
app.use(express.json());
app.use(apiKeyAuth); // Apply API key authentication middleware

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

const WalletSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    privateKey: Joi.string().required(),
    balance: Joi.number().required(),
    transactions: Joi.array().items(TransactionSchema).default([]),
    userId: Joi.string().required(),
});

// API endpoints
app.post('/users', (req, res) => {
    const { userId, username, password, email } = req.body;

    // Validate user input
    const { error } = UserSchema.validate({ userId, username, password, email });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Check if user already exists
    if (store.getState().users.find((user) => user.userId === userId)) {
        return res.status(400).send({ error: 'User already exists' });
    }

    // Create user
    const newUser = { userId, username, password, email };
    store.dispatch(usersSlice.actions.createUser(newUser));

    // Create a wallet for the user
    const walletName = `${username}'s Wallet`;
    const privateKey = uuidv4(); // Generate a new private key
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

app.get('/users', (req, res) => {
    const users = store.getState().users;
    res.status(200).send({ users });
});

app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const user = store.getState().users.find((user) => user.userId === userId);
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }
    const userWallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    res.send({ user, wallet: userWallet });
});

app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const user = store.getState().users.find((user) => user.userId === userId);
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }
    store.dispatch(usersSlice.actions.deleteUser(userId));

    const userWallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    if (userWallet) {
        store.dispatch(walletsSlice.actions.deleteWallet(userWallet.id));
    }
    res.status(200).send({ message: 'User and wallet deleted successfully' });
});

app.get('/wallets', (req, res) => {
    const wallets = store.getState().wallets;
    res.status(200).send({ wallets });
});

app.post('/transactions', (req, res) => {
    const { sender, recipient, amount } = req.body;

    // Validate transaction input
    const { error } = TransactionSchema.validate({ sender, recipient, amount });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Find sender and recipient wallets
    const senderWallet = store.getState().wallets.find((wallet) => wallet.userId === sender);
    const recipientWallet = store.getState().wallets.find((wallet) => wallet.userId === recipient);

    if (!senderWallet) {
        return res.status(404).send({ error: 'Sender wallet not found' });
    }
    if (!recipientWallet) {
        return res.status(404).send({ error: 'Recipient wallet not found' });
    }

    // Check if sender has enough balance
    if (senderWallet.balance < amount) {
        return res.status(400).send({ error: 'Insufficient balance' });
    }

    // Update balances
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

    // Dispatch updates
    store.dispatch(walletsSlice.actions.updateWallet(updatedSenderWallet));
    store.dispatch(walletsSlice.actions.updateWallet(updatedRecipientWallet));

    res.send({
        message: 'Transaction completed',
        transaction: { sender, recipient, amount, date: new Date(), status: 'completed' },
    });
});

app.post('/wallets/credit', (req, res) => {
    const { userId, amount } = req.body;

    // Validate input
    if (!userId || !amount || amount <= 0) {
        return res.status(400).send({ error: 'Invalid input. User ID and positive amount are required.' });
    }

    // Find the wallet
    const wallet = store.getState().wallets.find((wallet) => wallet.userId === userId);
    if (!wallet) {
        return res.status(404).send({ error: 'Wallet not found for the specified user.' });
    }

    // Update the wallet balance
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

// Apply error handling middleware
app.use(errorHandler);

module.exports = {
    app,
};