const EventEmitter = require('events');
const axios = require('axios');

class StockMarketModule extends EventEmitter {
    constructor(apiUrl, apiKey) {
        super();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.dataCache = new Map();
    }

    async fetchStockData(symbol) {
        try {
            const response = await axios.get(`${this.apiUrl}/stocks/${symbol}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            if (response.status === 200) {
                this.dataCache.set(symbol, response.data);
                this.emit('dataFetched', { symbol, data: response.data });
                return response.data;
            }
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            this.emit('error', error);
        }
    }

    processStockData(symbol) {
        const data = this.dataCache.get(symbol);
        if (!data) return null;
        
        // Example processing: Simple Moving Average (SMA)
        const prices = data.history.map(entry => entry.close);
        const sma = this.calculateSMA(prices, 5);
        const latestPrice = prices[prices.length - 1];
        
        return { latestPrice, sma };
    }

    calculateSMA(prices, period) {
        if (prices.length < period) return null;
        return prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
    }

    analyzeStock(symbol) {
        const processedData = this.processStockData(symbol);
        if (!processedData) return;
        
        const { latestPrice, sma } = processedData;
        
        if (latestPrice > sma) {
            this.emit('buySignal', { symbol, latestPrice, sma });
        } else if (latestPrice < sma) {
            this.emit('sellSignal', { symbol, latestPrice, sma });
        }
    }

    async trade(symbol, type, quantity) {
        try {
            const response = await axios.post(`${this.apiUrl}/trade`, {
                symbol, type, quantity
            }, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            if (response.status === 200) {
                this.emit('tradeExecuted', { symbol, type, quantity, status: response.data });
            }
        } catch (error) {
            console.error(`Trade error for ${symbol}:`, error);
            this.emit('error', error);
        }
    }
}

module.exports = StockMarketModule;
