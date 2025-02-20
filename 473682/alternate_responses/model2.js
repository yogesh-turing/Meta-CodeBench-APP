const readline = require('readline');
const axios = require('axios');

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async get(endpoint, params = {}) {
        try {
            const response = await axios.get(`${this.baseUrl}${endpoint}`, { params });
            return response.data;
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }
}

class InputService {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async question(prompt = '') {
        return new Promise(resolve => this.rl.question(prompt, resolve));
    }

    close() {
        this.rl.close();
    }
}

class CurrencyService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    async fetchSymbols() {
        const response = await this.apiService.get('/symbols');
        return Object.entries(response.symbols)
            .map(([code, info]) => [code, info.description]);
    }

    async convertCurrency(from, to, amount) {
        return await this.apiService.get('/convert', { from, to, amount });
    }

    async getHistoricalRates(from, to, days) {
        const results = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const response = await this.apiService.get(`/${dateStr}`, {
                base: from,
                symbols: to
            });
            results.push({ date: dateStr, rate: response.rates[to] });
        }
        return results;
    }
}

class CurrencyConverter {
    constructor() {
        this.apiService = new ApiService('https://api.exchangerate.host');
        this.inputService = new InputService();
        this.currencyService = new CurrencyService(this.apiService);
        this.currencies = [];
        this.favorites = [];
    }

    async getCurrencies() {
        try {
            this.currencies = await this.currencyService.fetchSymbols();
            console.log('Currencies loaded!');
        } catch (err) {
            console.log('Error loading currencies:', err);
        }
    }

    async convert() {
        try {
            console.log('Enter amount:');
            const amount = await this.inputService.question();

            console.log('From currency (like USD):');
            const from = await this.inputService.question();

            console.log('To currency (like EUR):');
            const to = await this.inputService.question();

            const response = await this.currencyService.convertCurrency(from, to, amount);
            console.log('Result:', response.result);
            console.log('Rate:', response.info.rate);
        } catch (err) {
            console.log('Error converting:', err);
        }
    }

    async getHistory() {
        try {
            console.log('From currency:');
            const from = await this.inputService.question();

            console.log('To currency:');
            const to = await this.inputService.question();

            const historicalRates = await this.currencyService.getHistoricalRates(from, to, 7);
            historicalRates.forEach(({ date, rate }) => {
                console.log(`${date}: ${rate}`);
            });
        } catch (err) {
            console.log('Error getting history:', err);
        }
    }

    async addFavorite() {
        try {
            console.log('From currency:');
            const from = await this.inputService.question();

            console.log('To currency:');
            const to = await this.inputService.question();

            this.favorites.push(`${from}/${to}`);
            console.log('Added to favorites!');
        } catch (err) {
            console.log('Error adding favorite:', err);
        }
    }

    showCurrencies() {
        console.log('Available currencies:');
        this.currencies.forEach(([code, name]) => {
            console.log(`${code}: ${name}`);
        });
    }

    question() {
        return this.inputService.question();
    }

    async showMenu() {
        while (true) {
            console.log('\n--- Currency Converter ---');
            console.log('1. Convert money');
            console.log('2. Show currencies');
            console.log('3. Show history');
            console.log('4. Add favorite');
            console.log('5. Exit');

            const choice = await this.question();

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
                    this.inputService.close();
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
};