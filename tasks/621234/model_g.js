require('dotenv').config();
const express = require('express');
const { configureStore, createSlice } = require('@reduxjs/toolkit');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const crypto = require('crypto');

// Security constants
const VALID_API_KEYS = [process.env.API_KEY];

// Encryption/Decryption utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16
const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// API Key Authentication Middleware
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!VALID_API_KEYS.includes(apiKey)) {
        return res.status(403).send({ error: USER_MESSAGES.API_KEY_INVALID });
    }
    next();
};

// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
};

// Initial state
const initialState = {
    wallets: [],
    users: [],
};

// Redux Toolkit slices
const usersSlice = createSlice({
    name: 'users',
    initialState: initialState.users,
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
    initialState: initialState.wallets,
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
        wallets: walletsSlice.reducer,
    }
});

// Server setup
const app = express();
app.use(express.json());
app.use(apiKeyAuth);

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
    WALLET_NOT_FOUND: 'Wallet not found for the specified user',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_INPUT: 'Invalid input. User ID and positive amount are required.',
    USER_WALLET_DELETED: 'User and wallet deleted successfully',
    FUNDS_CREDITED: 'Funds credited successfully',
    TRANSACTION_COMPLETED: 'Transaction completed',
};

// Create a new user and wallet
app.post('/users', (req, res) => {
    const { userId, username, password, email } = req.body;

    // Validate user input
    const { error } = UserSchema.validate({ userId, username, password, email });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Check if user already exists
    if (store.getState().users.find((user) => user.userId === userId)) {
        return res.status(400).send({ error: USER_MESSAGES.USER_EXISTS });
    }

    // Create user
    const newUser = { userId, username, password: encrypt(password), email };
    store.dispatch(usersSlice.actions.createUser(newUser));

    // Create a wallet for the user
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

    // Validate transaction input
    const { error } = TransactionSchema.validate({ sender, recipient, amount });
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Find sender and recipient wallets
    const senderWallet = store.getState().wallets.find((wallet) => wallet.userId === sender);
    const recipientWallet = store.getState().wallets.find((wallet) => wallet.userId === recipient);

    if (!senderWallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }
    if (!recipientWallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }

    // Check if sender has enough balance
    if (senderWallet.balance < amount) {
        return res.status(400).send({ error: USER_MESSAGES.INSUFFICIENT_BALANCE });
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

    // Find and delete the user
    const userIndex = store.getState().users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
        return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });
    }
    store.dispatch(usersSlice.actions.deleteUser(userId));

    // Delete the user's wallet
    const walletIndex = store.getState().wallets.findIndex((wallet) => wallet.userId === userId);
    if (walletIndex !== -1) {
        store.dispatch(walletsSlice.actions.deleteWallet(store.getState().wallets[walletIndex].id));
    }

    res.send({ message: USER_MESSAGES.USER_WALLET_DELETED });
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

    // Validate input
    if (!userId || !amount || amount <= 0) {
        return res.status(400).send({ error: USER_MESSAGES.INVALID_INPUT });
    }

    // Find the wallet
    const wallet = store.getState().wallets.find((wallet) => wallet.userId === userId);
    if (!wallet) {
        return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
    }

    // Update the wallet balance
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

app.use(errorHandler);

module.exports = {
    app,
};