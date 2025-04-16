require('dotenv').config();
const express = require('express');
const { configureStore, createSlice } = require('@reduxjs/toolkit');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const crypto = require('crypto');

// Security constants
const VALID_API_KEYS = [process.env.API_KEY]; // Use environment variable for API key

// Encryption utilities using AES
const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY; // 32 bytes key
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const decrypt = (encryptedText) => {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// Redux slices
const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        createUser: (state, action) => { state.push(action.payload); },
        deleteUser: (state, action) => {
            return state.filter(user => user.userId !== action.payload);
        },
    },
});

const walletsSlice = createSlice({
    name: 'wallets',
    initialState: [],
    reducers: {
        createWallet: (state, action) => { state.push(action.payload); },
        updateWallet: (state, action) => {
            const index = state.findIndex(wallet => wallet.id === action.payload.id);
            if (index !== -1) state[index] = action.payload;
        },
        deleteWallet: (state, action) => {
            return state.filter(wallet => wallet.id !== action.payload);
        },
    },
});

// Configure Redux store
const store = configureStore({
    reducer: {
        users: usersSlice.reducer,
        wallets: walletsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(store => next => action => {
        console.log('Dispatching action:', action);
        return next(action);
    }),
});

// Server setup
const app = express();
app.use(express.json());

// API Key Authentication Middleware
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
        return res.status(403).send({ error: USER_MESSAGES.API_KEY_INVALID });
    }
    next();
};

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

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
    USER_WALLET_CREATED: 'User and wallet created',
}

// API Endpoints

// Create a new user and wallet
app.post('/users', apiKeyAuth, (req, res, next) => {
    try {
        const { userId, username, password, email } = req.body;

        // Validate user input
        const { error } = UserSchema.validate({ userId, username, password, email });
        if (error) return res.status(400).send({ error: error.details[0].message });

        // Check if user already exists
        if (store.getState().users.find(user => user.userId === userId)) {
            return res.status(400).send({ error: USER_MESSAGES.USER_EXISTS });
        }

        // Create user
        const newUser = { userId, username, password: encrypt(password), email };
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
            message: USER_MESSAGES.USER_WALLET_CREATED,
            user: { userId, username, email },
            wallet: { id: newWallet.id, name: newWallet.name },
        });
    } catch (err) {
        next(err);
    }
});

// Create a transaction between users
app.post('/transactions', apiKeyAuth, (req, res, next) => {
    try {
        const { sender, recipient, amount } = req.body;

        // Validate transaction input
        const { error } = TransactionSchema.validate({ sender, recipient, amount });
        if (error) return res.status(400).send({ error: error.details[0].message });

        // Find sender and recipient wallets
        const senderWallet = store.getState().wallets.find(wallet => wallet.userId === sender);
        const recipientWallet = store.getState().wallets.find(wallet => wallet.userId === recipient);

        if (!senderWallet) return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });
        if (!recipientWallet) return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });

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
    } catch (err) {
        next(err);
    }
});

// Get all users
app.get('/users', apiKeyAuth, (req, res, next) => {
    try {
        res.send({ users: store.getState().users });
    } catch (err) {
        next(err);
    }
});

// Get user by ID
app.get('/users/:userId', apiKeyAuth, (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = store.getState().users.find(u => u.userId === userId);
        if (!user) return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });

        const userWallet = store.getState().wallets.find(wallet => wallet.userId === userId);
        res.send({ user, wallet: userWallet });
    } catch (err) {
        next(err);
    }
});

// Delete a user
app.delete('/users/:userId', apiKeyAuth, (req, res, next) => {
    try {
        const { userId } = req.params;

        // Find and delete the user
        const userIndex = store.getState().users.findIndex(user => user.userId === userId);
        if (userIndex === -1) return res.status(404).send({ error: USER_MESSAGES.USER_NOT_FOUND });
        store.dispatch(usersSlice.actions.deleteUser(userId));

        // Delete the user's wallet
        const walletIndex = store.getState().wallets.findIndex(wallet => wallet.userId === userId);
        if (walletIndex !== -1) {
            store.dispatch(walletsSlice.actions.deleteWallet(store.getState().wallets[walletIndex].id));
        }

        res.send({ message: USER_MESSAGES.USER_WALLET_DELETED });
    } catch (err) {
        next(err);
    }
});

// Get all wallets
app.get('/wallets', apiKeyAuth, (req, res, next) => {
    try {
        const wallets = store.getState().wallets.map(wallet => ({
            id: wallet.id,
            name: wallet.name,
            privateKey: decrypt(wallet.privateKey),
            balance: wallet.balance,
            transactions: wallet.transactions,
        }));
        res.send({ wallets });
    } catch (err) {
        next(err);
    }
});

// Credit funds to a user's wallet
app.post('/wallets/credit', apiKeyAuth, (req, res, next) => {
    try {
        const { userId, amount } = req.body;

        // Validate input
        if (!userId || !amount || amount <= 0) {
            return res.status(400).send({ error: USER_MESSAGES.INVALID_INPUT });
        }

        // Find the wallet
        const wallet = store.getState().wallets.find(wallet => wallet.userId === userId);
        if (!wallet) return res.status(404).send({ error: USER_MESSAGES.WALLET_NOT_FOUND });

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
    } catch (err) {
        next(err);
    }
});

module.exports = {
    app,
};