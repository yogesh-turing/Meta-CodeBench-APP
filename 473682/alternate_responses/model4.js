const readline = require('readline');
const axios = require('axios');

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

    print(message) {
        console.log(message);
    }

    close() {
        this.rl.close();
    }
}

class CurrencyRepository {
    constructor() {
        this.currencies = [];
        this.favorites = [];
    }

    setCurrencies(currencies) {
        this.currencies = currencies;
    }

    getCurrencies() {
        return this.currencies;
    }

    addFavorite(from, to) {
        this.favorites.push(`${from}/${to}`);
    }
}

class DateService {
    static getLastNDays(n) {
        return Array.from({ length: n }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        });
    }
}

class CurrencyConverter {
    constructor() {
        this.API_URL = 'https://api.exchangerate.host';
        this.apiService = new ApiService(this.API_URL);
        this.ioService = new InputOutputService();
        this.repository = new CurrencyRepository();
    }

    async getCurrencies() {
        try {
            const response = await this.apiService.get('/symbols');
            this.repository.setCurrencies(
                Object.entries(response.symbols)
                    .map(([code, info]) => [code, info.description])
            );
            this.ioService.print('Currencies loaded!');
        } catch (err) {
            this.ioService.print('Error loading currencies: ' + err);
        }
    }

    async convert() {
        try {
            this.ioService.print('Enter amount:');
            const amount = await this.ioService.question();

            this.ioService.print('From currency (like USD):');
            const from = await this.ioService.question();

            this.ioService.print('To currency (like EUR):');
            const to = await this.ioService.question();

            const response = await this.apiService.get('/convert', { from, to, amount });

            this.ioService.print('Result: ' + response.result);
            this.ioService.print('Rate: ' + response.info.rate);
        } catch (err) {
            this.ioService.print('Error converting: ' + err);
        }
    }

    async getHistory() {
        try {
            this.ioService.print('From currency:');
            const from = await this.ioService.question();

            this.ioService.print('To currency:');
            const to = await this.ioService.question();

            const dates = DateService.getLastNDays(7);
            
            for (const dateStr of dates) {
                const response = await this.apiService.get(`/${dateStr}`, {
                    base: from,
                    symbols: to
                });
                this.ioService.print(`${dateStr}: ${response.rates[to]}`);
            }
        } catch (err) {
            this.ioService.print('Error getting history: ' + err);
        }
    }

    async addFavorite() {
        this.ioService.print('From currency:');
        const from = await this.ioService.question();

        this.ioService.print('To currency:');
        const to = await this.ioService.question();

        this.repository.addFavorite(from, to);
        this.ioService.print('Added to favorites!');
    }

    showCurrencies() {
        this.ioService.print('Available currencies:');
        this.repository.getCurrencies().forEach(([code, name]) => {
            this.ioService.print(`${code}: ${name}`);
        });
    }

    question() {
        return this.ioService.question();
    }

    async showMenu() {
        while (true) {
            this.ioService.print('\n--- Currency Converter ---');
            this.ioService.print('1. Convert money');
            this.ioService.print('2. Show currencies');
            this.ioService.print('3. Show history');
            this.ioService.print('4. Add favorite');
            this.ioService.print('5. Exit');

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
                    this.ioService.print('Bye!');
                    this.ioService.close();
                    return;
                default:
                    this.ioService.print('Invalid choice!');
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