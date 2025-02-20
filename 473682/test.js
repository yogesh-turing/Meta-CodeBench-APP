const { CurrencyConverter } = require('./solution.js'); // Replace functionNames with the correct function(s)

const axios = require('axios');

jest.mock('axios');

describe('CurrencyConverter', () => {
    let converter;
    let mockReadline;

    beforeEach(() => {
        mockReadline = {
            question: jest.fn(),
            close: jest.fn()
        };

        jest.spyOn(require('readline'), 'createInterface').mockReturnValue(mockReadline);
        
        converter = new CurrencyConverter();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrencies', () => {
        it('should load currencies successfully', async () => {
            const mockResponse = {
                data: {
                    symbols: {
                        USD: { description: 'United States Dollar' },
                        EUR: { description: 'Euro' }
                    }
                }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            await converter.getCurrencies();

            expect(converter.currencies).toHaveLength(2);
            expect(converter.currencies).toContainEqual(['USD', 'United States Dollar']);
            expect(axios.get).toHaveBeenCalledWith('https://api.exchangerate.host/symbols');
        });

        it('should handle API errors gracefully', async () => {
            axios.get.mockRejectedValueOnce(new Error('API Error'));
            console.log = jest.fn();

            await converter.getCurrencies();

            expect(converter.currencies).toHaveLength(0);
            expect(console.log).toHaveBeenCalledWith(
                'Error loading currencies:',
                expect.any(Error)
            );
        });
    });

    describe('convert', () => {
        it('should convert currency successfully', async () => {
            const mockResponse = {
                data: {
                    result: 85.5,
                    info: { rate: 0.855 }
                }
            };
            axios.get.mockResolvedValueOnce(mockResponse);
            
            mockReadline.question
                .mockImplementationOnce((_, cb) => cb('100'))
                .mockImplementationOnce((_, cb) => cb('USD'))
                .mockImplementationOnce((_, cb) => cb('EUR'));

            console.log = jest.fn();
            await converter.convert();

            expect(axios.get).toHaveBeenCalledWith(
                'https://api.exchangerate.host/convert',
                expect.any(Object)
            );
            expect(console.log).toHaveBeenCalledWith('Result:', 85.5);
        });

        it('should handle invalid input gracefully', async () => {
            mockReadline.question
                .mockImplementationOnce((_, cb) => cb('invalid'))
                .mockImplementationOnce((_, cb) => cb('USD'))
                .mockImplementationOnce((_, cb) => cb('EUR'));

            console.log = jest.fn();
            await converter.convert();

            expect(console.log).toHaveBeenCalledWith(
                'Error converting:',
                expect.any(Error)
            );
        });
    });

    describe('getHistory', () => {
        it('should fetch historical rates successfully', async () => {
            const mockResponse = {
                data: {
                    rates: {
                        EUR: 0.85
                    }
                }
            };
            axios.get.mockResolvedValue(mockResponse);

            mockReadline.question
                .mockImplementationOnce((_, cb) => cb('USD'))
                .mockImplementationOnce((_, cb) => cb('EUR'));

            console.log = jest.fn();
            await converter.getHistory();

            expect(axios.get).toHaveBeenCalledTimes(7);
            expect(console.log).toHaveBeenCalledTimes(9);
        });

        it('should handle API errors in historical data', async () => {
            axios.get.mockRejectedValueOnce(new Error('API Error'));

            mockReadline.question
                .mockImplementationOnce((_, cb) => cb('USD'))
                .mockImplementationOnce((_, cb) => cb('EUR'));

            console.log = jest.fn();
            await converter.getHistory();

            expect(console.log).toHaveBeenCalledWith(
                'Error getting history:',
                expect.any(Error)
            );
        });
    });

    describe('addFavorite', () => {
        it('should add currency pair to favorites', () => {
            mockReadline.question
                .mockImplementationOnce(() => 'USD')
                .mockImplementationOnce(() => 'EUR');

            converter.addFavorite();

            expect(converter.favorites).toContain('USD/EUR');
        });

        it('should allow adding multiple favorites', () => {
            mockReadline.question
                .mockImplementationOnce(() => 'USD')
                .mockImplementationOnce(() => 'EUR')
                .mockImplementationOnce(() => 'USD')
                .mockImplementationOnce(() => 'GBP');

            converter.addFavorite();
            converter.addFavorite();

            expect(converter.favorites).toHaveLength(2);
            expect(converter.favorites).toContain('USD/EUR');
            expect(converter.favorites).toContain('USD/GBP');
        });
    });

    describe('showMenu', () => {
        it('should exit properly', async () => {
            mockReadline.question.mockImplementationOnce((_, cb) => cb('5'));

            await converter.showMenu();

            expect(mockReadline.close).toHaveBeenCalled();
        });

        it('should handle invalid menu choices', async () => {
            mockReadline.question
                .mockImplementationOnce((_, cb) => cb('invalid'))
                .mockImplementationOnce((_, cb) => cb('5'));

            console.log = jest.fn();
            await converter.showMenu();

            expect(console.log).toHaveBeenCalledWith('Invalid choice!');
        });
    });

    describe('edge cases', () => {
        it('should handle empty API responses', async () => {
            axios.get.mockResolvedValueOnce({ data: {} });
            console.log = jest.fn();

            await converter.getCurrencies();

            expect(converter.currencies).toHaveLength(0);
        });

        it('should handle network timeouts', async () => {
            axios.get.mockRejectedValueOnce(new Error('Network timeout'));
            console.log = jest.fn();

            await converter.getCurrencies();

            expect(console.log).toHaveBeenCalledWith(
                'Error loading currencies:',
                expect.any(Error)
            );
        });

        it('should handle malformed API responses', async () => {
            const mockResponse = {
                data: {
                    result: null,
                    info: { rate: undefined }
                }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            mockReadline.question
                .mockImplementationOnce((_, cb) => cb('100'))
                .mockImplementationOnce((_, cb) => cb('USD'))
                .mockImplementationOnce((_, cb) => cb('EUR'));

            console.log = jest.fn();
            await converter.convert();

            expect(console.log).toHaveBeenCalledWith('Result:', null);
        });

        it('should handle zero amount conversions', async () => {
            mockReadline.question
                .mockImplementationOnce((_, cb) => cb('0'))
                .mockImplementationOnce((_, cb) => cb('USD'))
                .mockImplementationOnce((_, cb) => cb('EUR'));

            const mockResponse = {
                data: {
                    result: 0,
                    info: { rate: 0.855 }
                }
            };
            axios.get.mockResolvedValueOnce(mockResponse);

            console.log = jest.fn();
            await converter.convert();

            expect(axios.get).toHaveBeenCalled();
        });
    });
});