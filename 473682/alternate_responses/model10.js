const readline = require('readline');
const axios = require('axios');

// Constants
const API_URL = 'https://api.exchangerate.host';

// Utility functions
function logError(message, error) {
    console.log(`${message}: ${error}`);
}

function logResult(message, result) {
    console.log(`${message}: ${result}`);
}

// API Client
class ExchangeRateApiClient {
    async getSymbols() {
        try {
            const response = await axios.get(`${API_URL}/symbols`);
            return Object.entries(response.data.symbols)
                .map(([code, info]) => [code, info.description]);
        } catch (err) {
            logError('Error loading currencies', err);
            return [];
        }
    }

    async convert(from, to, amount) {
        try {
            const response = await axios.get(`${API_URL}/convert`, {
                params: { from, to, amount }
            });
            return response.data;
        } catch (err) {
            logError('Error converting', err);
            return null;
        }
    }

    async getHistory(from, to, date) {
        try {
            const response = await axios.get(`${API_URL}/${date}`, {
                params: { base: from, symbols: to }
            });
            return response.data.rates[to];
        } catch (err) {
            logError('Error getting history', err);
            return null;
        }
    }
}

// Favorites
class Favorites {
    constructor() {
        this.favorites = [];
    }

    addFavorite(from, to) {
        this.favorites.push(`${from}/${to}`);
        console.log('Added to favorites!');
    }
}

// User Input
class UserInput {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async question(prompt) {
        return new Promise(resolve => this.rl.question(prompt, resolve));
    }

    close() {
        this.rl.close();
    }
}

// Currency Converter
class CurrencyConverter {
    constructor() {
        this.currencies = [];
        this.favorites = new Favorites();
        this.apiClient = new ExchangeRateApiClient();
        this.userInput = new UserInput();
    }

    async getCurrencies() {
        this.currencies = await this.apiClient.getSymbols();
        console.log('Currencies loaded!');
    }

    async convert() {
        console.log('Enter amount:');
        const amount = await this.userInput.question('');

        console.log('From currency (like USD):');
        const from = await this.userInput.question('');

        console.log('To currency (like EUR):');
        const to = await this.userInput.question('');

        const result = await this.apiClient.convert(from, to, amount);
        if (result) {
            logResult('Result', result.result);
            logResult('Rate', result.info.rate);
        }
    }

    async getHistory() {
        console.log('From currency:');
        const from = await this.userInput.question('');

        console.log('To currency:');
        const to = await this.userInput.question('');

        // Get last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const rate = await this.apiClient.getHistory(from, to, dateStr);
            if (rate) {
                logResult(dateStr, rate);
            }
        }
    }

    async addFavorite() {
        console.log('From currency:');
        const from = await this.userInput.question('');

        console.log('To currency:');
        const to = await this.userInput.question('');

        this.favorites.addFavorite(from, to);
    }

    showCurrencies() {
        console.log('Available currencies:');
        this.currencies.forEach(([code, name]) => {
            console.log(`${code}: ${name}`);
        });
    }

    async showMenu() {
        while (true) {
            console.log('\n--- Currency Converter ---');
            console.log('1. Convert money');
            console.log('2. Show currencies');
            console.log('3. Show history');
            console.log('4. Add favorite');
            console.log('5. Exit');

            const choice = await this.userInput.question('');

            switch (choice) {
                case '1':
                    await this.convert();
                    break;
                case '2':
                    this.showCurrencies();
                    break;
                case '3':
                    await this.getHistory();
                    break;
                case '4':
                    await this.addFavorite();
                    break;
                case '5':
                    console.log('Bye!');
                    this.userInput.close();
                    return;
                default:
                    console.log('Invalid choice!');
            }
        }
    }

    async start() {
        await this.getCurrencies();
        await this.showMenu();
    }
}

module.exports = {
    CurrencyConverter
}