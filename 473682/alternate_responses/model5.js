const readline = require('readline');
const axios = require('axios');

class APIService {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.client = axios;
    }

    async get(endpoint, params = {}) {
        try {
            const response = await this.client.get(`${this.baseURL}${endpoint}`, { params });
            return response.data;
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }
}

class InputOutputService {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async question(prompt = '') {
        return new Promise(resolve => this.rl.question(prompt, resolve));
    }

    display(message) {
        console.log(message);
    }

    close() {
        this.rl.close();
    }
}

class CurrencyService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    async fetchCurrencies() {
        const response = await this.apiService.get('/symbols');
        return Object.entries(response.symbols)
            .map(([code, info]) => [code, info.description]);
    }

    async convertCurrency(amount, from, to) {
        const response = await this.apiService.get('/convert', { from, to, amount });
        return {
            result: response.result,
            rate: response.info.rate
        };
    }

    async getHistoricalRates(from, to, days) {
        const rates = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const response = await this.apiService.get(`/${dateStr}`, {
                base: from,
                symbols: to
            });
            rates.push({ date: dateStr, rate: response.rates[to] });
        }
        return rates;
    }
}

class CurrencyConverter {
    constructor() {
        this.ioService = new InputOutputService();
        this.apiService = new APIService('https://api.exchangerate.host');
        this.currencyService = new CurrencyService(this.apiService);
        this.currencies = [];
        this.favorites = [];
    }

    async getCurrencies() {
        try {
            this.currencies = await this.currencyService.fetchCurrencies();
            this.ioService.display('Currencies loaded!');
        } catch (err) {
            this.ioService.display('Error loading currencies: ' + err);
        }
    }

    async convert() {
        try {
            this.ioService.display('Enter amount:');
            const amount = await this.ioService.question();

            this.ioService.display('From currency (like USD):');
            const from = await this.ioService.question();

            this.ioService.display('To currency (like EUR):');
            const to = await this.ioService.question();

            const result = await this.currencyService.convertCurrency(amount, from, to);
            this.ioService.display('Result: ' + result.result);
            this.ioService.display('Rate: ' + result.rate);
        } catch (err) {
            this.ioService.display('Error converting: ' + err);
        }
    }

    async getHistory() {
        try {
            this.ioService.display('From currency:');
            const from = await this.ioService.question();

            this.ioService.display('To currency:');
            const to = await this.ioService.question();

            const historicalRates = await this.currencyService.getHistoricalRates(from, to, 7);
            historicalRates.forEach(({ date, rate }) => {
                this.ioService.display(`${date}: ${rate}`);
            });
        } catch (err) {
            this.ioService.display('Error getting history: ' + err);
        }
    }

    async addFavorite() {
        try {
            this.ioService.display('From currency:');
            const from = await this.ioService.question();

            this.ioService.display('To currency:');
            const to = await this.ioService.question();

            this.favorites.push(`${from}/${to}`);
            this.ioService.display('Added to favorites!');
        } catch (err) {
            this.ioService.display('Error adding favorite: ' + err);
        }
    }

    showCurrencies() {
        this.ioService.display('Available currencies:');
        this.currencies.forEach(([code, name]) => {
            this.ioService.display(`${code}: ${name}`);
        });
    }

    question() {
        return this.ioService.question();
    }

    async showMenu() {
        while (true) {
            this.ioService.display('\n--- Currency Converter ---');
            this.ioService.display('1. Convert money');
            this.ioService.display('2. Show currencies');
            this.ioService.display('3. Show history');
            this.ioService.display('4. Add favorite');
            this.ioService.display('5. Exit');

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
                    this.ioService.display('Bye!');
                    this.ioService.close();
                    return;
                default:
                    this.ioService.display('Invalid choice!');
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