// const { logger } = require('./solution.js');
const { logger } = require(process.env.TARGET_FILE);

describe('Advanced Logger ', () => {
  // Freeze time so that timestamps are predictable.
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    logger.clear();
    logger.setLogLevel('DEBUG');
    jest.clearAllMocks();
  });

  // --- Utility and Internal Methods ---
  describe('Utility Methods & Internal Logic', () => {
    test('getTimestamp returns an ISO string matching current time', () => {
      const ts = logger.getTimestamp();
      expect(new Date(ts).toISOString()).toBe(ts);
    });

    test('levelPriority returns correct priorities for known levels and 0 for unknown', () => {
      expect(logger.levelPriority('DEBUG')).toBe(1);
      expect(logger.levelPriority('INFO')).toBe(2);
      expect(logger.levelPriority('WARN')).toBe(3);
      expect(logger.levelPriority('ERROR')).toBe(4);
      expect(logger.levelPriority('FOO')).toBe(0);
    });

    test('_shouldLog respects set log level', () => {
      logger.setLogLevel('WARN');
      expect(logger._shouldLog('DEBUG')).toBe(false);
      expect(logger._shouldLog('INFO')).toBe(false);
      expect(logger._shouldLog('WARN')).toBe(true);
      expect(logger._shouldLog('ERROR')).toBe(true);
    });

    test('setLogLevel throws error for invalid log level', () => {
      expect(() => logger.setLogLevel('INVALID')).toThrow('Invalid log level');
    });
  });

  // --- Advanced log() Tests ---
  describe('Generic log() method with complex data', () => {
    test('logs a nested object correctly', () => {
      const nestedObj = { a: { b: [1, { c: 'd' }] } };
      const expected = JSON.stringify(nestedObj);
      const output = logger.log(nestedObj);
      expect(output).toBe(expected);
    });

    test('logs an array using proper JSON serialization', () => {
      const arr = [1, 2, 3];
      const expected = JSON.stringify(arr);
      const output = logger.log(arr);
      expect(output).toBe(expected);
    });

    test('attempt to log circular object should throw error', () => {
      const circular = {};
      circular.self = circular;
      expect(() => logger.log(circular)).toThrow(/circular/i);
    });

    test('log() handles non-object types consistently', () => {
      const testCases = [
        { input: null, expected: 'null' },
        { input: undefined, expected: 'undefined' },
        { input: 0, expected: '0' },
        { input: false, expected: 'false' },
      ];
      testCases.forEach(({ input, expected }) => {
        expect(logger.log(input)).toBe(expected);
      });
    });
  });

  // --- Synchronous Logging with Formatting & Filtering ---
  describe('Synchronous logging methods', () => {
    test('info() logs with proper format (but ignores filtering)', () => {
      const output = logger.info('Info advanced message');
      expect(output).toBe(
        'INFO [2023-01-01T00:00:00.000Z]: Info advanced message'
      );
    });

    test('warn() logs with proper format when allowed', () => {
      const output = logger.warn('Warning advanced message');
      expect(output).toBe(
        'WARN [2023-01-01T00:00:00.000Z]: Warning advanced message'
      );
    });

    test('error() logs with proper format when allowed', () => {
      const output = logger.error('Error advanced message');
      expect(output).toBe(
        'ERROR [2023-01-01T00:00:00.000Z]: Error advanced message'
      );
    });

    test('debug() logs with proper format when allowed', () => {
      const output = logger.debug('Debug advanced message');
      expect(output).toBe(
        'DEBUG [2023-01-01T00:00:00.000Z]: Debug advanced message'
      );
    });
    test('synchronous methods obey log level filtering', () => {
      logger.setLogLevel('WARN');
      expect(logger.warn('Filtered warn')).toBe(
        'WARN [2023-01-01T00:00:00.000Z]: Filtered warn'
      );
      expect(logger.error('Filtered error')).toBe(
        'ERROR [2023-01-01T00:00:00.000Z]: Filtered error'
      );
      expect(logger.debug('Filtered debug')).toBe('');
      expect(logger.info('Should be filtered')).toBe('');
    });
  });

  // --- Asynchronous Logging ---
  describe('Asynchronous logging via logAsync()', () => {
    test('logAsync resolves with correct output for an object', async () => {
      const promise = logger.logAsync({ async: true });
      jest.runAllTimers();
      const result = await promise;
      expect(result).toBe(JSON.stringify({ async: true }));
    });

    test('logAsync resolves with correct output for a primitive', async () => {
      const promise = logger.logAsync('asyncTest');
      jest.runAllTimers();
      const result = await promise;
      expect(result).toBe('asyncTest');
    });

    test('logAsync rejects when logging a circular object', async () => {
      const circular = {};
      circular.self = circular;
      const promise = logger.logAsync(circular);
      jest.runAllTimers();
      await expect(promise).rejects.toThrow(/circular/i);
    });

    test('multiple concurrent logAsync calls preserve order', async () => {
      const inputs = [{ x: 1 }, 'test', [1, 2, 3]];
      const promises = inputs.map((inp) => logger.logAsync(inp));
      jest.runAllTimers();
      const results = await Promise.all(promises);
      expect(results[0]).toBe(JSON.stringify({ x: 1 }));
      expect(results[1]).toBe('test');
      expect(results[2]).toBe(JSON.stringify([1, 2, 3]));
    });
  });

  // --- Console Spies to Validate Output Calls ---
  describe('Console method invocations', () => {
    let logSpy, infoSpy, warnSpy, errorSpy, debugSpy;
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    });
    afterEach(() => {
      logSpy.mockRestore();
      infoSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
      debugSpy.mockRestore();
    });

    test('log() calls console.log with correct argument', () => {
      const msg = { k: 'v' };
      const expected = JSON.stringify(msg);
      const output = logger.log(msg);
      expect(logSpy).toHaveBeenCalledWith(expected);
      expect(output).toBe(expected);
    });

    test('info() calls console.info with correct format', () => {
      const output = logger.info('Spy info');
      expect(infoSpy).toHaveBeenCalledWith(output);
    });

    test('warn() calls console.warn when message is logged', () => {
      const output = logger.warn('Spy warn');
      if (output) {
        expect(warnSpy).toHaveBeenCalledWith(output);
      }
    });

    test('error() calls console.error when message is logged', () => {
      const output = logger.error('Spy error');
      if (output) {
        expect(errorSpy).toHaveBeenCalledWith(output);
      }
    });

    test('debug() calls console.debug when message is logged', () => {
      const output = logger.debug('Spy debug');
      if (output) {
        expect(debugSpy).toHaveBeenCalledWith(output);
      }
    });
  });

  describe('Logs history and clearing functionality', () => {
    test('getLogs() returns all logged entries in proper order', () => {
      logger.info('First');
      logger.warn('Second');
      logger.error('Third');
      const logs = logger.getLogs();
      expect(logs).toEqual([
        'INFO [2023-01-01T00:00:00.000Z]: First',
        'WARN [2023-01-01T00:00:00.000Z]: Second',
        'ERROR [2023-01-01T00:00:00.000Z]: Third',
      ]);
    });

    test('clear() empties the logs array', () => {
      logger.log('Some log');
      expect(logger.getLogs().length).toBeGreaterThan(0);
      logger.clear();
      expect(logger.getLogs().length).toBe(0);
    });
  });
});