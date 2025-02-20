const readline = require('readline');
const axios = require('axios');

// Constants
const API_URL = 'https://api.exchangerate.host';

// Utility functions
const logError = (err) => console.log('Error:', err);
const logMessage = (message) => console.log(message);

// Class to handle API requests
class ApiClient {
  async getSymbols() {
    try {
      const response = await axios.get(`${API_URL}/symbols`);
      return Object.entries(response.data.symbols).map(([code, info]) => [code, info.description]);
    } catch (err) {
      logError('Error loading currencies:', err);
      return [];
    }
  }

  async convert(amount, from, to) {
    try {
      const response = await axios.get(`${API_URL}/convert`, { params: { from, to, amount } });
      return response.data;
    } catch (err) {
      logError('Error converting:', err);
      return null;
    }
  }

  async getHistory(from, to, dateStr) {
    try {
      const response = await axios.get(`${API_URL}/${dateStr}`, { params: { base: from, symbols: to } });
      return response.data.rates[to];
    } catch (err) {
      logError('Error getting history:', err);
      return null;
    }
  }
}

// Class to handle user input
class InputHandler {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async question(prompt) {
    return new Promise((resolve) => this.rl.question(prompt, resolve));
  }

  close() {
    this.rl.close();
  }
}

// Class to handle favorites
class FavoritesManager {
  constructor() {
    this.favorites = [];
  }

  addFavorite(from, to) {
    this.favorites.push(`${from}/${to}`);
    logMessage('Added to favorites!');
  }
}

// Main class
class CurrencyConverter {
  constructor() {
    this.apiClient = new ApiClient();
    this.inputHandler = new InputHandler();
    this.favoritesManager = new FavoritesManager();
    this.currencies = [];
  }

  async getCurrencies() {
    this.currencies = await this.apiClient.getSymbols();
    logMessage('Currencies loaded!');
  }

  async convert() {
    try {
      const amount = await this.inputHandler.question('Enter amount: ');
      const from = await this.inputHandler.question('From currency (like USD): ');
      const to = await this.inputHandler.question('To currency (like EUR): ');
      const data = await this.apiClient.convert(amount, from, to);
      logMessage(`Result: ${data.result}`);
      logMessage(`Rate: ${data.info.rate}`);
    } catch (err) {
      logError('Error converting:', err);
    }
  }

  async getHistory() {
    try {
      const from = await this.inputHandler.question('From currency: ');
      const to = await this.inputHandler.question('To currency: ');
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const rate = await this.apiClient.getHistory(from, to, dateStr);
        logMessage(`${dateStr}: ${rate}`);
      }
    } catch (err) {
      logError('Error getting history:', err);
    }
  }

  async addFavorite() {
    try {
      const from = await this.inputHandler.question('From currency: ');
      const to = await this.inputHandler.question('To currency: ');
      this.favoritesManager.addFavorite(from, to);
    } catch (err) {
      logError('Error adding favorite:', err);
    }
  }

  showCurrencies() {
    logMessage('Available currencies:');
    this.currencies.forEach(([code, name]) => logMessage(`${code}: ${name}`));
  }

  async showMenu() {
    while (true) {
      logMessage('\n--- Currency Converter ---');
      logMessage('1. Convert money');
      logMessage('2. Show currencies');
      logMessage('3. Show history');
      logMessage('4. Add favorite');
      logMessage('5. Exit');
      const choice = await this.inputHandler.question('');
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
          logMessage('Bye!');
          this.inputHandler.close();
          return;
        default:
          logMessage('Invalid choice!');
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