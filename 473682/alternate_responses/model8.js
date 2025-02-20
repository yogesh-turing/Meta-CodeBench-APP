const readline = require('readline');
const axios = require('axios');

class InputReader {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    question() {
        return new Promise(resolve => this.rl.question('', resolve));
    }

    close() {
        this.rl.close();
    }
}

class ExchangeRateService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async getCurrencies() {
        try {
            const response = await axios.get(`${this.apiUrl}/symbols`);
            return Object.entries(response.data.symbols)
                .map(([code, info]) => [code, info.description]);
        } catch (err) {
            throw new Error('Error loading currencies:', err);
        }
    }

    async convert(from, to, amount) {
        try {
            const response = await axios.get(`${this.apiUrl}/convert`, {
                params: { from, to, amount }
            });
            return response.data;
        } catch (err) {
            throw new Error('Error converting:', err);
        }
    }

    async getHistory(from, to, date) {
        try {
            const response = await axios.get(`${this.apiUrl}/${date}`, {
                params: { base: from, symbols: to }
            });
            return response.data;
        } catch (err) {
            throw new Error('Error getting history:', err);
        }
    }
}

class CurrencyConverter {
    constructor() {
        this.inputReader = new InputReader();
        this.exchangeRateService = new ExchangeRateService('https://api.exchangerate.host');
        this.currencies = [];
        this.favorites = [];
    }

    async loadCurrencies() {
        try {
            this.currencies = await this.exchangeRateService.getCurrencies();
            console.log('Currencies loaded!');
        } catch (err) {
            console.log(err.message);
        }
    }

    async convert() {
        try {
            console.log('Enter amount:');
            const amount = await this.inputReader.question();

            console.log('From currency (like USD):');
            const from = await this.inputReader.question();

            console.log('To currency (like EUR):');
            const to = await this.inputReader.question();

            const result = await this.exchangeRateService.convert(from, to, amount);
            console.log('Result:', result.result);
            console.log('Rate:', result.info.rate);
        } catch (err) {
            console.log(err.message);
        }
    }

    async getHistory() {
        try {
            console.log('From currency:');
            const from = await this.inputReader.question();

            console.log('To currency:');
            const to = await this.inputReader.question();

            // Get last 7 days
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const result = await this.exchangeRateService.getHistory(from, to, dateStr);
                console.log(`${dateStr}: ${result.rates[to]}`);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    async addFavorite() {
        try {
            console.log('From currency:');
            const from = await this.inputReader.question();

            console.log('To currency:');
            const to = await this.inputReader.question();

            this.favorites.push(`${from}/${to}`);
            console.log('Added to favorites!');
        } catch (err) {
            console.log(err.message);
        }
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

            const choice = await this.inputReader.question();

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
                    this.inputReader.close();
                    return;
                default:
                    console.log('Invalid choice!');
            }
        }
    }

    async start() {
        await this.loadCurrencies();
        await this.showMenu();
    }
}

module.exports = {
    CurrencyConverter
}