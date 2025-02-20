const readline = require('readline');
const axios = require('axios');

class ConsoleReader {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async readLine() {
        return new Promise(resolve => this.rl.question('', resolve));
    }

    close() {
        this.rl.close();
    }
}

class Logger {
    info(message) {
        console.log(message);
    }

    error(message, error) {
        console.log(`${message}: ${error}`);
    }
}

class CurrencyService {
    constructor() {
        this.API_URL = 'https://api.exchangerate.host';
    }

    async getCurrencies() {
        try {
            const response = await axios.get(`${this.API_URL}/symbols`);
            return Object.entries(response.data.symbols)
                .map(([code, info]) => [code, info.description]);
        } catch (err) {
            throw err;
        }
    }

    async convert(amount, from, to) {
        try {
            const response = await axios.get(`${this.API_URL}/convert`, {
                params: { from, to, amount }
            });
            return { result: response.data.result, rate: response.data.info.rate };
        } catch (err) {
            throw err;
        }
    }

    async getHistory(from, to) {
        try {
            const history = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const response = await axios.get(`${this.API_URL}/${dateStr}`, {
                    params: { base: from, symbols: to }
                });

                history.push({ date: dateStr, rate: response.data.rates[to] });
            }
            return history;
        } catch (err) {
            throw err;
        }
    }
}

class CurrencyConverter {
    constructor() {
        this.consoleReader = new ConsoleReader();
        this.logger = new Logger();
        this.currencyService = new CurrencyService();
        this.currencies = [];
        this.favorites = [];
    }

    async loadCurrencies() {
        try {
            this.currencies = await this.currencyService.getCurrencies();
            this.logger.info('Currencies loaded!');
        } catch (err) {
            this.logger.error('Error loading currencies', err);
        }
    }

    async convert() {
        try {
            this.logger.info('Enter amount:');
            const amount = await this.consoleReader.readLine();

            this.logger.info('From currency (like USD):');
            const from = await this.consoleReader.readLine();

            this.logger.info('To currency (like EUR):');
            const to = await this.consoleReader.readLine();

            const { result, rate } = await this.currencyService.convert(amount, from, to);

            this.logger.info(`Result: ${result}`);
            this.logger.info(`Rate: ${rate}`);
        } catch (err) {
            this.logger.error('Error converting', err);
        }
    }

    async getHistory() {
        try {
            this.logger.info('From currency:');
            const from = await this.consoleReader.readLine();

            this.logger.info('To currency:');
            const to = await this.consoleReader.readLine();

            const history = await this.currencyService.getHistory(from, to);

            history.forEach(({ date, rate }) => {
                this.logger.info(`${date}: ${rate}`);
            });
        } catch (err) {
            this.logger.error('Error getting history', err);
        }
    }

    async addFavorite() {
        this.logger.info('From currency:');
        const from = await this.consoleReader.readLine();

        this.logger.info('To currency:');
        const to = await this.consoleReader.readLine();

        this.favorites.push(`${from}/${to}`);
        this.logger.info('Added to favorites!');
    }

    showCurrencies() {
        this.logger.info('Available currencies:');
        this.currencies.forEach(([code, name]) => {
            this.logger.info(`${code}: ${name}`);
        });
    }

    async showMenu() {
        while (true) {
            this.logger.info('\n--- Currency Converter ---');
            this.logger.info('1. Convert money');
            this.logger.info('2. Show currencies');
            this.logger.info('3. Show history');
            this.logger.info('4. Add favorite');
            this.logger.info('5. Exit');

            const choice = await this.consoleReader.readLine();

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
                    this.logger.info('Bye!');
                    this.consoleReader.close();
                    return;
                default:
                    this.logger.info('Invalid choice!');
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