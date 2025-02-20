const readline = require('readline');
const axios = require('axios');

class APIService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async get(endpoint, params = {}) {
        try {
            return await axios.get(`${this.baseURL}${endpoint}`, { params });
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

    close() {
        this.rl.close();
    }

    display(message) {
        console.log(message);
    }
}

class CurrencyService {
    constructor(apiService) {
        this.apiService = apiService;
        this.currencies = [];
    }

    async loadCurrencies() {
        try {
            const response = await this.apiService.get('/symbols');
            this.currencies = Object.entries(response.data.symbols)
                .map(([code, info]) => [code, info.description]);
            return true;
        } catch (error) {
            throw new Error(`Failed to load currencies: ${error.message}`);
        }
    }

    async getConversionRate(from, to, amount) {
        try {
            const response = await this.apiService.get('/convert', { from, to, amount });
            return {
                result: response.data.result,
                rate: response.data.info.rate
            };
        } catch (error) {
            throw new Error(`Conversion failed: ${error.message}`);
        }
    }

    async getHistoricalRates(from, to, days) {
        try {
            const historicalRates = [];
            for (let i = 0; i < days; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const response = await this.apiService.get(`/${dateStr}`, {
                    base: from,
                    symbols: to
                });
                historicalRates.push({
                    date: dateStr,
                    rate: response.data.rates[to]
                });
            }
            return historicalRates;
        } catch (error) {
            throw new Error(`Failed to get historical rates: ${error.message}`);
        }
    }
}

class FavoriteService {
    constructor() {
        this.favorites = [];
    }

    addFavorite(from, to) {
        this.favorites.push(`${from}/${to}`);
    }

    getFavorites() {
        return [...this.favorites];
    }
}

class CurrencyConverter {
    constructor() {
        this.apiService = new APIService('https://api.exchangerate.host');
        this.ioService = new InputOutputService();
        this.currencyService = new CurrencyService(this.apiService);
        this.favoriteService = new FavoriteService();
        this.currencies = [];
        this.favorites = [];
    }

    async getCurrencies() {
        try {
            await this.currencyService.loadCurrencies();
            this.currencies = this.currencyService.currencies;
            console.log('Currencies loaded!');
        } catch (err) {
            console.log('Error loading currencies:', err);
        }
    }

    async convert() {
        try {
            console.log('Enter amount:');
            const amount = await this.question();

            console.log('From currency (like USD):');
            const from = await this.question();

            console.log('To currency (like EUR):');
            const to = await this.question();

            const { result, rate } = await this.currencyService.getConversionRate(from, to, amount);
            console.log('Result:', result);
            console.log('Rate:', rate);
        } catch (err) {
            console.log('Error converting:', err);
        }
    }

    async getHistory() {
        try {
            console.log('From currency:');
            const from = await this.question();

            console.log('To currency:');
            const to = await this.question();

            const historicalRates = await this.currencyService.getHistoricalRates(from, to, 7);
            historicalRates.forEach(({ date, rate }) => {
                console.log(`${date}: ${rate}`);
            });
        } catch (err) {
            console.log('Error getting history:', err);
        }
    }

    addFavorite() {
        console.log('From currency:');
        const from = this.rl.question();

        console.log('To currency:');
        const to = this.rl.question();

        this.favoriteService.addFavorite(from, to);
        this.favorites = this.favoriteService.getFavorites();
        console.log('Added to favorites!');
    }

    showCurrencies() {
        console.log('Available currencies:');
        this.currencies.forEach(([code, name]) => {
            console.log(`${code}: ${name}`);
        });
    }

    question() {
        return this.ioService.question();
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
                    this.addFavorite();
                    break;
                case '5':
                    console.log('Bye!');
                    this.ioService.close();
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