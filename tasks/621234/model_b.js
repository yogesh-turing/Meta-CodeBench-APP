require('dotenv').config();
const express = require('express');
const { configureStore, createSlice } = require('@reduxjs/toolkit');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef', 'hex');
const IV_LENGTH = 16;
const VALID_API_KEYS = (process.env.VALID_API_KEYS || 'abcd-1234-xyzx').split(',');

const USER_MESSAGES = {
    API_KEY_INVALID: 'Forbidden: Invalid API Key',
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    WALLET_NOT_FOUND: 'Wallet not found',
    SENDER_WALLET_NOT_FOUND: 'Sender wallet not found',
    RECIPIENT_WALLET_NOT_FOUND: 'Recipient wallet not found',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_INPUT: 'Invalid input. User ID and positive amount are required.',
    WALLET_NOT_FOUND_USER: 'Wallet not found for the specified user.',
    USER_WALLET_DELETED: 'User and wallet deleted successfully',
    TRANSACTION_COMPLETED: 'Transaction completed',
    FUNDS_CREDITED: 'Funds credited successfully',
    USER_WALLET_CREATED: 'User and wallet created'
};

const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const decrypt = (text) => {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const userSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        createUser: (state, action) => { state.push(action.payload); },
        deleteUser: (state, action) => state.filter(user => user.userId !== action.payload)
    }
});

const walletSlice = createSlice({
    name: 'wallets',
    initialState: [],
    reducers: {
        createWallet: (state, action) => { state.push(action.payload); },
        updateWallet: (state, action) => {
            const index = state.findIndex(wallet => wallet.id === action.payload.id);
            if (index !== -1) state[index] = action.payload;
        },
        deleteWallet: (state, action) => state.filter(wallet => wallet.id !== action.payload)
    }
});

const store = configureStore({
    reducer: {
        users: userSlice.reducer,
        wallets: walletSlice.reducer
    }
});

const { createUser, deleteUser } = userSlice.actions;
const { createWallet, updateWallet, deleteWallet } = walletSlice.actions;

const app = express();
app.use(express.json());

const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
        return res.status(403).json({ error: USER_MESSAGES.API_KEY_INVALID });
    }
    next();
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};

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

app.post('/users', validateApiKey, (req, res) => {
    const { userId, username, password, email } = req.body;

    const { error } = UserSchema.validate({ userId, username, password, email });
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (store.getState().users.find(user => user.userId === userId)) {
        return res.status(400).json({ error: USER_MESSAGES.USER_EXISTS });
    }

    const encryptedPassword = encrypt(password);
    const newUser = { userId, username, password: encryptedPassword, email };
    store.dispatch(createUser(newUser));

    const newWallet = {
        id: uuidv4(),
        name: `${username}'s Wallet`,
        privateKey: encrypt(uuidv4()),
        balance: 0,
        transactions: [],
        userId,
    };
    store.dispatch(createWallet(newWallet));

    res.status(201).json({
        message: USER_MESSAGES.USER_WALLET_CREATED,
        user: { userId, username, email },
        wallet: { id: newWallet.id, name: newWallet.name },
    });
});

app.post('/transactions', validateApiKey, (req, res) => {
    const { sender, recipient, amount } = req.body;

    const { error } = TransactionSchema.validate({ sender, recipient, amount });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const senderWallet = store.getState().wallets.find(wallet => wallet.userId === sender);
    const recipientWallet = store.getState().wallets.find(wallet => wallet.userId === recipient);

    if (!senderWallet) return res.status(404).json({ error: USER_MESSAGES.SENDER_WALLET_NOT_FOUND });
    if (!recipientWallet) return res.status(404).json({ error: USER_MESSAGES.RECIPIENT_WALLET_NOT_FOUND });
    if (senderWallet.balance < amount) return res.status(400).json({ error: USER_MESSAGES.INSUFFICIENT_BALANCE });

    const transaction = { sender, recipient, amount, date: new Date(), status: 'completed' };

    store.dispatch(updateWallet({
        ...senderWallet,
        balance: senderWallet.balance - amount,
        transactions: [...senderWallet.transactions, transaction],
    }));

    store.dispatch(updateWallet({
        ...recipientWallet,
        balance: recipientWallet.balance + amount,
        transactions: [...recipientWallet.transactions, transaction],
    }));

    res.json({
        message: USER_MESSAGES.TRANSACTION_COMPLETED,
        transaction,
    });
});

app.get('/users', validateApiKey, (req, res) => {
    res.json({ users: store.getState().users });
});

app.get('/users/:userId', validateApiKey, (req, res) => {
    const { userId } = req.params;
    const user = store.getState().users.find(u => u.userId === userId);
    if (!user) return res.status(404).json({ error: USER_MESSAGES.USER_NOT_FOUND });

    const userWallet = store.getState().wallets.find(wallet => wallet.userId === userId);
    res.json({ user, wallet: userWallet });
});

app.delete('/users/:userId', validateApiKey, (req, res) => {
    const { userId } = req.params;
    const userExists = store.getState().users.some(user => user.userId === userId);
    if (!userExists) return res.status(404).json({ error: USER_MESSAGES.USER_NOT_FOUND });

    store.dispatch(deleteUser(userId));
    const wallet = store.getState().wallets.find(w => w.userId === userId);
    if (wallet) store.dispatch(deleteWallet(wallet.id));

    res.json({ message: USER_MESSAGES.USER_WALLET_DELETED });
});

app.get('/wallets', validateApiKey, (req, res) => {
    const wallets = store.getState().wallets.map(wallet => ({
        ...wallet,
        privateKey: decrypt(wallet.privateKey),
    }));
    res.json({ wallets });
});

app.post('/wallets/credit', validateApiKey, (req, res) => {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ error: USER_MESSAGES.INVALID_INPUT });
    }

    const wallet = store.getState().wallets.find(w => w.userId === userId);
    if (!wallet) return res.status(404).json({ error: USER_MESSAGES.WALLET_NOT_FOUND_USER });

    const updatedWallet = { ...wallet, balance: wallet.balance + amount };
    store.dispatch(updateWallet(updatedWallet));

    res.json({
        message: USER_MESSAGES.FUNDS_CREDITED,
        wallet: {
            id: updatedWallet.id,
            userId: updatedWallet.userId,
            balance: updatedWallet.balance,
        },
    });
});

app.use(errorHandler);

module.exports = { app };