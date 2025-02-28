const StockMarketModule = require('./base_code');
const axios = require('axios').default;

jest.mock('axios');

describe('StockMarketModule', () => {
    let stockMarketModule;
    const apiUrl = 'http://api.example.com';
    const apiKey = 'test-api-key';

    beforeEach(() => {
        stockMarketModule = new StockMarketModule(apiUrl, apiKey);
    });

    test('fetchStockData should fetch data and emit dataFetched event', async () => {
        const symbol = 'AAPL';
        const mockData = { history: [{ close: 150 }, { close: 155 }] };
        axios.get.mockResolvedValue({ status: 200, data: mockData });

        const dataFetchedListener = jest.fn();
        stockMarketModule.on('dataFetched', dataFetchedListener);

        const data = await stockMarketModule.fetchStockData(symbol);

        expect(data).toEqual(mockData);
        expect(stockMarketModule.dataCache.get(symbol)).toEqual(mockData);
        expect(dataFetchedListener).toHaveBeenCalledWith({ symbol, data: mockData });
    });

    test('fetchStockData should emit error event on failure', async () => {
        const symbol = 'AAPL';
        const mockError = new Error('Network Error');
        axios.get.mockRejectedValue(mockError);

        const errorListener = jest.fn();
        stockMarketModule.on('error', errorListener);

        await stockMarketModule.fetchStockData(symbol);

        expect(errorListener).toHaveBeenCalledWith(mockError);
    });

    test('processStockData should return processed data', () => {
        const symbol = 'AAPL';
        const mockData = { history: [{ close: 150 }, { close: 155 }, { close: 160 }, { close: 165 }, { close: 170 }] };
        stockMarketModule.dataCache.set(symbol, mockData);

        const processedData = stockMarketModule.processStockData(symbol);

        expect(processedData).toEqual({ latestPrice: 170, sma: 160 });
    });

    test('analyzeStock should emit buySignal or sellSignal based on analysis', () => {
        const symbol = 'AAPL';
        const mockData = { history: [{ close: 150 }, { close: 155 }, { close: 160 }, { close: 165 }, { close: 170 }] };
        stockMarketModule.dataCache.set(symbol, mockData);

        const buySignalListener = jest.fn();
        const sellSignalListener = jest.fn();
        stockMarketModule.on('buySignal', buySignalListener);
        stockMarketModule.on('sellSignal', sellSignalListener);

        stockMarketModule.analyzeStock(symbol);

        expect(buySignalListener).toHaveBeenCalledWith({ symbol, latestPrice: 170, sma: 160 });
        expect(sellSignalListener).not.toHaveBeenCalled();
    });

    test('trade should execute trade and emit tradeExecuted event', async () => {
        const symbol = 'AAPL';
        const type = 'buy';
        const quantity = 10;
        const mockResponse = { status: 200, data: { success: true } };
        axios.post.mockResolvedValue(mockResponse);

        const tradeExecutedListener = jest.fn();
        stockMarketModule.on('tradeExecuted', tradeExecutedListener);

        await stockMarketModule.trade(symbol, type, quantity);

        expect(tradeExecutedListener).toHaveBeenCalledWith({ symbol, type, quantity, status: mockResponse.data });
    });

    test('trade should emit error event on failure', async () => {
        const symbol = 'AAPL';
        const type = 'buy';
        const quantity = 10;
        const mockError = new Error('Trade Error');
        axios.post.mockRejectedValue(mockError);

        const errorListener = jest.fn();
        stockMarketModule.on('error', errorListener);

        await stockMarketModule.trade(symbol, type, quantity);

        expect(errorListener).toHaveBeenCalledWith(mockError);
    });
});