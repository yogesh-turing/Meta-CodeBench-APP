const readline = require('readline');
const axios = require('axios');

// Constants
const API_URL = 'https://api.exchangerate.host';

// Interfaces
class ICurrency {
    constructor(code, description) {
        this.code = code;
        this.description = description;
    }
}

class IRate {
    constructor(date, rate) {
        this.date = date;
        this.rate = rate;
    }
}

// Repository class for API calls
class ExchangeRateRepository {
    async getCurrencies() {
        try {
            const response = await axios.get(`${API_URL}/symbols`);
            return Object.entries(response.data.symbols)
                .map(([code, info]) => new ICurrency(code, info.description));
        } catch (err) {
            throw new Error(`Error loading currencies: ${err}`);
        }
    }

    async convert(amount, from, to) {
        try {
            const response = await axios.get(`${API_URL}/convert`, {
                params: { from, to, amount }
            });
            return { result: response.data.result, rate: response.data.info.rate };
        } catch (err) {
            throw new Error(`Error converting: ${err}`);
        }
    }

    async getHistory(from, to) {
        try {
            const rates = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const response = await axios.get(`${API_URL}/${dateStr}`, {
                    params: { base: from, symbols: to }
                });
                rates.push(new IRate(dateStr, response.data.rates[to]));
            }
            return rates;
        } catch (err) {
            throw new Error(`Error getting history: ${err}`);
        }
    }
}

// Service class for business logic
class CurrencyService {
    constructor(repository) {
        this.repository = repository;
    }

    async getCurrencies() {
        return await this.repository.getCurrencies();
    }

    async convert(amount, from, to) {
        return await this.repository.convert(amount, from, to);
    }

    async getHistory(from, to) {
        return await this.repository.getHistory(from, to);
    }
}

// Helper class for user input
class InputHelper {
    constructor(readline) {
        this.readline = readline;
    }

    async question(prompt) {
        return new Promise(resolve => this.readline.question(prompt, resolve));
    }
}

// Main class
class CurrencyConverter {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.repository = new ExchangeRateRepository();
        this.service = new CurrencyService(this.repository);
        this.inputHelper = new InputHelper(this.rl);
        this.currencies = [];
        this.favorites = [];
    }

    async start() {
        await this.loadCurrencies();
        await this.showMenu();
    }

    async loadCurrencies() {
        try {
            this.currencies = await this.service.getCurrencies();
            console.log('Currencies loaded!');
        } catch (err) {
            console.log(err.message);
        }
    }

    async convert() {
        try {
            console.log('Enter amount:');
            const amount = await this.inputHelper.question('');

            console.log('From currency (like USD):');
            const from = await this.inputHelper.question('');

            console.log('To currency (like EUR):');
            const to = await this.inputHelper.question('');

            const result = await this.service.convert(amount, from, to);
            console.log('Result:', result.result);
            console.log('Rate:', result.rate);
        } catch (err) {
            console.log(err.message);
        }
    }

    async getHistory() {
        try {
            console.log('From currency:');
            const from = await this.inputHelper.question('');

            console.log('To currency:');
            const to = await this.inputHelper.question('');

            const rates = await this.service.getHistory(from, to);
            rates.forEach(rate => console.log(`${rate.date}: ${rate.rate}`));
        } catch (err) {
            console.log(err.message);
        }
    }

    addFavorite() {
        console.log('From currency:');
        const from = this.rl.question('');

        console.log('To currency:');
        const to = this.rl.question('');

        this.favorites.push(`${from}/${to}`);
        console.log('Added to favorites!');
    }

    showCurrencies() {
        console.log('Available currencies:');
        this.currencies.forEach(currency => {
            console.log(`${currency.code}: ${currency.description}`);
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

            const choice = await this.inputHelper.question('');

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
                    this.addFavorite();
                    break;
                case '5':
                    console.log('Bye!');
                    this.rl.close();
                    return;
                default:
                    console.log('Invalid choice!');
            }
        }
    }
}

module.exports = {
    CurrencyConverter
}