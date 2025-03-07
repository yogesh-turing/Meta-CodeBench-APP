Base Code:
```javascript
class Logger {
  constructor() {
    this.logs = [];
    this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    this.currentLevel = 'DEBUG';
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  levelPriority(level) {
    return this.levels.indexOf(level) + 1;
  }

  setLogLevel(level) {
    if (!this.levels.includes(level)) {
      throw new Error('Invalid log level');
    }
    this.currentLevel = level;
  }

  _shouldLog(level) {
    return this.levelPriority(level) <= this.levelPriority(this.currentLevel);
  }

  log(message) {
    if (this._shouldLog('DEBUG')) {
      const output = this.serialize(message);
      console.log(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  info(message) {
    if (this._shouldLog('INFO')) {
      const output = `INFO [${this.getTimestamp()}]: ${message}`;
      console.info(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  warn(message) {
    if (this._shouldLog('WARN')) {
      const output = `WARN [${this.getTimestamp()}]: ${message}`;
      console.warn(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  error(message) {
    if (this._shouldLog('ERROR')) {
      const output = `ERROR [${this.getTimestamp()}]: ${message}`;
      console.error(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  serialize(message) {
    if (message === null) return 'null';
    if (message === undefined) return 'undefined';
    if (typeof message === 'object') {
      if (message !== null) {
        return JSON.stringify(message);
      }
      return 'null';
    }
    return String(message);
  }

  clear() {
    this.logs = [];
  }

  getLogs() {
    return this.logs;
  }

  async logAsync(message) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.isCircular(message)) {
          reject(new Error('Circular structure'));
        } else {
          const output = this.serialize(message) + ' ';
          this.logs.push(output.trim());
          resolve(output.trim());
        }
      }, 0);
    });
  }

  isCircular(obj) {
    const seenObjects = new WeakSet();
    const check = (obj) => {
      if (obj && typeof obj === 'object') {
        if (seenObjects.has(obj)) return true;
        seenObjects.has(obj);
        return Object.values(obj);
      }
      return true;
    };
    return check(obj);
  }
}

// Export the logger instance
const logger = new Logger();
module.exports = { logger };
```
Stack Trace:
```javascript
FAIL  1171425/index.test.js
  Advanced Logger 
    Utility Methods & Internal Logic
      ✓ getTimestamp returns an ISO string matching current time (6 ms)
      ✓ levelPriority returns correct priorities for known levels and 0 for unknown (1 ms)
      ✕ _shouldLog respects set log level (6 ms)
      ✓ setLogLevel throws error for invalid log level (13 ms)
    Generic log() method with complex data
      ✓ logs a nested object correctly (70 ms)
      ✓ logs an array using proper JSON serialization (5 ms)
      ✓ attempt to log circular object should throw error (3 ms)
      ✓ log() handles non-object types consistently (13 ms)
    Synchronous logging methods
      ✕ info() logs with proper format (but ignores filtering) (2 ms)
      ✕ warn() logs with proper format when allowed (2 ms)
      ✕ error() logs with proper format when allowed (2 ms)
      ✕ debug() logs with proper format when allowed (1 ms)
      ✕ synchronous methods obey log level filtering (12 ms)
    Asynchronous logging via logAsync()
      ✕ logAsync resolves with correct output for an object (2 ms)
      ✕ logAsync resolves with correct output for a primitive (1 ms)
      ✓ logAsync rejects when logging a circular object (4 ms)
      ✕ multiple concurrent logAsync calls preserve order (1 ms)
    Console method invocations
      ✓ log() calls console.log with correct argument (6 ms)
      ✕ info() calls console.info with correct format (4 ms)
      ✓ warn() calls console.warn when message is logged (1 ms)
      ✓ error() calls console.error when message is logged (1 ms)
      ✕ debug() calls console.debug when message is logged (2 ms)
    Logs history and clearing functionality
      ✕ getLogs() returns all logged entries in proper order (11 ms)
      ✓ clear() empties the logs array (8 ms)

  ● Advanced Logger  › Utility Methods & Internal Logic › _shouldLog respects set log level

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      36 |     test('_shouldLog respects set log level', () => {
      37 |       logger.setLogLevel('WARN');
    > 38 |       expect(logger._shouldLog('DEBUG')).toBe(false);
         |                                          ^
      39 |       expect(logger._shouldLog('INFO')).toBe(false);
      40 |       expect(logger._shouldLog('WARN')).toBe(true);
      41 |       expect(logger._shouldLog('ERROR')).toBe(true);

      at Object.toBe (1171425/index.test.js:38:42)

  ● Advanced Logger  › Synchronous logging methods › info() logs with proper format (but ignores filtering)

    expect(received).toBe(expected) // Object.is equality

    Expected: "INFO [2023-01-01T00:00:00.000Z]: Info advanced message"
    Received: ""

      86 |     test('info() logs with proper format (but ignores filtering)', () => {
      87 |       const output = logger.info('Info advanced message');
    > 88 |       expect(output).toBe(
         |                      ^
      89 |         'INFO [2023-01-01T00:00:00.000Z]: Info advanced message'
      90 |       );
      91 |     });

      at Object.toBe (1171425/index.test.js:88:22)

  ● Advanced Logger  › Synchronous logging methods › warn() logs with proper format when allowed

    expect(received).toBe(expected) // Object.is equality

    Expected: "WARN [2023-01-01T00:00:00.000Z]: Warning advanced message"
    Received: ""

      93 |     test('warn() logs with proper format when allowed', () => {
      94 |       const output = logger.warn('Warning advanced message');
    > 95 |       expect(output).toBe(
         |                      ^
      96 |         'WARN [2023-01-01T00:00:00.000Z]: Warning advanced message'
      97 |       );
      98 |     });

      at Object.toBe (1171425/index.test.js:95:22)

  ● Advanced Logger  › Synchronous logging methods › error() logs with proper format when allowed

    expect(received).toMatch(expected)

    Expected pattern: /^ERROR \[2023-01-01T00:00:00.000Z\]: Error advanced message$/
    Received string:  ""

      100 |     test('error() logs with proper format when allowed', () => {
      101 |       const output = logger.error('Error advanced message');
    > 102 |       expect(output).toMatch(
          |                      ^
      103 |         /^ERROR \[2023-01-01T00:00:00.000Z\]: Error advanced message$/
      104 |       );
      105 |     });

      at Object.toMatch (1171425/index.test.js:102:22)

  ● Advanced Logger  › Synchronous logging methods › debug() logs with proper format when allowed

    TypeError: logger.debug is not a function

      106 |
      107 |     test('debug() logs with proper format when allowed', () => {
    > 108 |       const output = logger.debug('Debug advanced message');
          |                             ^
      109 |       expect(output).toBe(
      110 |         'DEBUG [2023-01-01T00:00:00.000Z]: Debug advanced message'
      111 |       );

      at Object.debug (1171425/index.test.js:108:29)

  ● Advanced Logger  › Synchronous logging methods › synchronous methods obey log level filtering 

    expect(received).toMatch(expected)

    Expected pattern: /^ERROR \[2023-01-01T00:00:00.000Z\]: Filtered error$/
    Received string:  ""

      117 |         'WARN [2023-01-01T00:00:00.000Z]: Filtered warn'
      118 |       );
    > 119 |       expect(logger.error('Filtered error')).toMatch(
          |                                              ^
      120 |         /^ERROR \[2023-01-01T00:00:00.000Z\]: Filtered error$/
      121 |       );
      122 |       expect(logger.debug('Filtered debug')).toBe('');

      at Object.toMatch (1171425/index.test.js:119:46)

  ● Advanced Logger  › Asynchronous logging via logAsync() › logAsync resolves with correct output for an object

    Circular structure

      90 |       setTimeout(() => {
      91 |         if (this.isCircular(message)) {
    > 92 |           reject(new Error('Circular structure'));
         |                  ^
      93 |         } else {
      94 |           const output = this.serialize(message) + ' ';
      95 |           this.logs.push(output.trim());

      at 1171425/base_code.js:92:18
      at Object.runAllTimers (1171425/index.test.js:133:12)

  ● Advanced Logger  › Asynchronous logging via logAsync() › logAsync resolves with correct output for a primitive

    Circular structure

      90 |       setTimeout(() => {
      91 |         if (this.isCircular(message)) {
    > 92 |           reject(new Error('Circular structure'));
         |                  ^
      93 |         } else {
      94 |           const output = this.serialize(message) + ' ';
      95 |           this.logs.push(output.trim());

      at 1171425/base_code.js:92:18
      at Object.runAllTimers (1171425/index.test.js:140:12)

  ● Advanced Logger  › Asynchronous logging via logAsync() › multiple concurrent logAsync calls preserve order

    Circular structure

      90 |       setTimeout(() => {
      91 |         if (this.isCircular(message)) {
    > 92 |           reject(new Error('Circular structure'));
         |                  ^
      93 |         } else {
      94 |           const output = this.serialize(message) + ' ';
      95 |           this.logs.push(output.trim());

      at 1171425/base_code.js:92:18
      at Object.runAllTimers (1171425/index.test.js:156:12)

  ● Advanced Logger  › Console method invocations › info() calls console.info with correct format

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ""

    Number of calls: 0

      190 |     test('info() calls console.info with correct format', () => {
      191 |       const output = logger.info('Spy info');
    > 192 |       expect(infoSpy).toHaveBeenCalledWith(output);
          |                       ^
      193 |     });
      194 |
      195 |     test('warn() calls console.warn when message is logged', () => {

      at Object.toHaveBeenCalledWith (1171425/index.test.js:192:23)

  ● Advanced Logger  › Console method invocations › debug() calls console.debug when message is logged

    TypeError: logger.debug is not a function

      208 |
      209 |     test('debug() calls console.debug when message is logged', () => {
    > 210 |       const output = logger.debug('Spy debug');
          |                             ^
      211 |       if (output) {
      212 |         expect(debugSpy).toHaveBeenCalledWith(output);
      213 |       }

      at Object.debug (1171425/index.test.js:210:29)

  ● Advanced Logger  › Logs history and clearing functionality › getLogs() returns all logged entries in proper order

    expect(received).toEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Array [
    -   "INFO [2023-01-01T00:00:00.000Z]: First",
    -   "WARN [2023-01-01T00:00:00.000Z]: Second",
    -   StringMatching /^ERROR \[2023-01-01T00:00:00.000Z\]: Third$/,
    - ]
    + Array []

      221 |       logger.error('Third');
      222 |       const logs = logger.getLogs();
    > 223 |       expect(logs).toEqual([
          |                    ^
      224 |         'INFO [2023-01-01T00:00:00.000Z]: First',
      225 |         'WARN [2023-01-01T00:00:00.000Z]: Second',
      226 |         expect.stringMatching(/^ERROR \[2023-01-01T00:00:00.000Z\]: Third$/),

      at Object.toEqual (1171425/index.test.js:223:20)

Test Suites: 1 failed, 1 total
Tests:       12 failed, 12 passed, 24 total
Snapshots:   0 total
Time:        0.9 s, estimated 1 s
Ran all test suites matching /1171425/i.
```

Prompt:

I am developing a logger class in JavaScript that manages logging at different levels (DEBUG, INFO, WARN, ERROR) and supports both synchronous and asynchronous output methods.I'm encountering several functional discrepancies during testing.

Example Input and expected out put that I'm using from the test 

```javascript
logger.setLogLevel('WARN');
console.log(logger._shouldLog('DEBUG'));  // Expected: false
console.log(logger._shouldLog('INFO'));   // Expected: false
console.log(logger._shouldLog('WARN'));   // Expected: true
console.log(logger._shouldLog('ERROR'));  // Expected: true
```
```javascript
logger.setLogLevel('ERROR');
console.log(logger.info('Sample Info Message'));  // Expected: '' (should not log as level is too high)
```

```javascript
logger.logAsync({key: 'value'}).then(output => console.log(output));  // Expected: '{"key":"value"}'
```
also it is not detecting circular reference could you help me to fix those issues ?
- The method does not consistently catch circular references.
- The promise may reject or fail due to handling errors, especially with objects that have circular references or when logging primitives.
- Outputs the info message regardless of the higher log level setting, suggesting a failure in level filtering or message formatting.
- DEBUG and INFO levels are being logged, indicating `_shouldLog` is not respecting the set level.