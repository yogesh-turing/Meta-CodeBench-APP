const express = require('express');
const { createStore } = require('redux');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

// Security constants
const API_KEY = 'abcd-1234-xyzx'; // Replace with a secure key

// Utility functions for encryption and decryption
const encrypt = (text) => {
    return Buffer.from(text).toString('base64')
}

const decrypt = (encryptedText) => {
    return Buffer.from(encryptedText, 'base64').toString('utf-8');
};

// Initial state
const initialState = {
    wallets: [],
    users: [], // Add users to the state
};

// Reducer function
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_WALLET':
            return { ...state, wallets: [...state.wallets, action.payload] };
        case 'UPDATE_WALLET':
            return {
                ...state,
                wallets: state.wallets.map((wallet) =>
                    wallet.id === action.payload.id ? { ...wallet, ...action.payload } : wallet
                ),
            };
        case 'DELETE_WALLET':
            return {
                ...state,
                wallets: state.wallets.filter((wallet) => wallet.id !== action.payload),
            };
        case 'CREATE_USER': // Add a new user
            return { ...state, users: [...state.users, action.payload] };
        case 'DELETE_USER': // Delete a user
            return {
                ...state,
                users: state.users.filter((user) => user.userId !== action.payload),
            };
        default:
            return state;
    }
};

// Create Redux store
const store = createStore(reducer);

// Server setup
const app = express();
app.use(express.json());

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

const USER_MESSAGES = {
    API_KEY_INVALID: 'Forbidden: Invalid API Key',
}

// Create a new user and wallet
app.post('/users', (req, res) => {
    const { userId, username, password, email } = req.body;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).send({ error: USER_MESSAGES.API_KEY_INVALID });
    }

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
    store.dispatch({ type: 'CREATE_USER', payload: newUser });

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
    store.dispatch({ type: 'CREATE_WALLET', payload: newWallet });

    res.status(201).send({
        message: 'User and wallet created',
        user: { userId, username, email },
        wallet: { id: newWallet.id, name: newWallet.name },
    });
});

// Create a transaction between users
app.post('/transactions', (req, res) => {
    const { sender, recipient, amount } = req.body;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).send({ error: 'Forbidden: Invalid API Key' });
    }

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
    store.dispatch({ type: 'UPDATE_WALLET', payload: updatedSenderWallet });
    store.dispatch({ type: 'UPDATE_WALLET', payload: updatedRecipientWallet });

    res.send({
        message: 'Transaction completed',
        transaction: { sender, recipient, amount, date: new Date(), status: 'completed' },
    });
});

// Get all users
app.get('/users', (req, res) => {

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).send({ error: 'Forbidden: Invalid API Key' });
    }
    res.send({ users: store.getState().users });
});

// Get user by ID
app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).send({ error: 'Forbidden: Invalid API Key' });
    }

    const user = store.getState().users.find((u) => u.userId === userId);

    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }

    const userWallet = store.getState().wallets.find((wallet) => wallet.userId === userId);
    res.send({ user, wallet: userWallet });
});

// Delete a user
app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).send({ error: 'Forbidden: Invalid API Key' });
    }

    // Find and delete the user
    const userIndex = store.getState().users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
        return res.status(404).send({ error: 'User not found' });
    }
    store.dispatch({ type: 'DELETE_USER', payload: userId });

    // Delete the user's wallet
    const walletIndex = store.getState().wallets.findIndex((wallet) => wallet.userId === userId);
    if (walletIndex !== -1) {
        store.dispatch({ type: 'DELETE_WALLET', payload: store.getState().wallets[walletIndex].id });
    }

    res.send({ message: 'User and wallet deleted successfully' });
});

// Get all wallets
app.get('/wallets', (req, res) => {

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).send({ error: 'Forbidden: Invalid API Key' });
    }
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

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).send({ error: 'Forbidden: Invalid API Key' });
    }

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
    store.dispatch({ type: 'UPDATE_WALLET', payload: updatedWallet });

    res.status(200).send({
        message: 'Funds credited successfully',
        wallet: {
            id: updatedWallet.id,
            userId: updatedWallet.userId,
            balance: updatedWallet.balance,
        },
    });
});


module.exports = {
    app,
};