const readline = require('readline');
const axios = require('axios');

class CurrencyConverter {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.API_URL = 'https://api.exchangerate.host';
        this.currencies = [];
        this.favorites = [];
    }

    async getCurrencies() {
        try {
            const response = await axios.get(`${this.API_URL}/symbols`);
            this.currencies = Object.entries(response.data.symbols)
                .map(([code, info]) => [code, info.description]);
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

            const response = await axios.get(`${this.API_URL}/convert`, {
                params: { from, to, amount }
            });

            console.log('Result:', response.data.result);
            console.log('Rate:', response.data.info.rate);
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

            // Get last 7 days
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const response = await axios.get(`${this.API_URL}/${dateStr}`, {
                    params: { base: from, symbols: to }
                });

                console.log(`${dateStr}: ${response.data.rates[to]}`);
            }
        } catch (err) {
            console.log('Error getting history:', err);
        }
    }

    addFavorite() {
        console.log('From currency:');
        const from = this.rl.question();

        console.log('To currency:');
        const to = this.rl.question();

        this.favorites.push(`${from}/${to}`);
        console.log('Added to favorites!');
    }

    showCurrencies() {
        console.log('Available currencies:');
        this.currencies.forEach(([code, name]) => {
            console.log(`${code}: ${name}`);
        });
    }

    question() {
        return new Promise(resolve => this.rl.question('', resolve));
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
                    this.rl.close();
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